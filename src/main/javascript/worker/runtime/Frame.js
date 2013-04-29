jjvm.runtime.Frame = function(classDef, methodDef, args, parent) {
	_.extend(this, jjvm.core.Watchable);

	var _stack = new jjvm.runtime.Stack();
	var _variables = new jjvm.runtime.LocalVariables(args ? args : []);
	var _child;
	var _thread;
	var _output;
	var _currentInstruction;
	var _version = jjvm.runtime.Frame.index++;
	var _instructions = new jjvm.core.Iterator(methodDef.getInstructions());
	//var _skipBreakpointAtLocation;
	var _isSystemFrame;
	var _shouldStepInto;

	this.getLocalVariables = function() {
		return _variables;
	};

	this.getStack = function() {
		return _stack;
	};

	this.getClassDef = function() {
		return classDef;
	};

	this.getMethodDef = function() {
		return methodDef;
	};

	this.getParent = function() {
		return parent;
	};

	this.getChild = function() {
		return _child;
	};

	this.getCurrentInstruction = function() {
		return _currentInstruction;
	};

	this.getNextInstruction = function() {
		return _instructions.peek();
	};

	this.getOutput = function() {
		return _output;
	};

	this.getThread = function() {
		return _thread;
	};

	this.reset = function() {
		// reset execution index and enabled stepping
		_instructions.reset();
		_stack = new jjvm.runtime.Stack();
		_currentInstruction = _instructions.peek();
		this._dispatchNotification("onBeforeInstructionExecution");
	};

	this._execute = function(thread) {
		_thread = thread;
		_thread.setCurrentFrame(this);

		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var methodArgs = args.concat([]);
			var target = classDef;

			if(methodDef.isStatic()) {
				methodArgs.unshift(target);
			} else {
				target = _variables.load(0);
			}

			methodArgs.unshift(methodDef);
			methodArgs.unshift(classDef);
			methodArgs.unshift(this);
			_output = methodDef.getImplementation().apply(target, methodArgs);

			this.dispatch("onFrameComplete", _output !== undefined ? [_output] : []);
		} else {
			this.executeNextInstruction();
		}
	};

	this.executeChild = function(classDef, methodDef, args) {
		_child = new jjvm.runtime.Frame(classDef, methodDef, args, this);
		_child.setIsSystemFrame(_isSystemFrame);

		var exceptionHandler = _.bind(function(frame, thrown) {
			if(!this.getMethodDef().getExceptionTable()) {
				if(!parent) {
					// nowhere to bubble to...
					throw "Uncaught exception! " + thrown;
				}

				// exception bubbles up
				this.dispatch("onExceptionThrown", [thrown]);

				return;
			}

			// attempt to resolve via exception table
			var exceptionTable = this.getMethodDef().getExceptionTable();
			var jumpTo = exceptionTable.resolve(_currentInstruction.getLocation(), thrown);

			if(jumpTo === null) {
				if(!parent) {
					// nowhere to bubble to...
					throw "Uncaught exception! " + thrown;
				}

				// uncaught exception
				this.dispatch("onExceptionThrown", [thrown]);

				return;
			} else {
				// find the instruction we are to jump to
				for(var i = 0; i < _instructions.getIterable().length; i++) {
					if(_instructions.getIterable()[i].getLocation() == jumpTo) {
						_instructions.jump(i);
					}
				}
			}

			_child = null;
			_thread.setCurrentFrame(this);
		}, this);
		_child.registerOneTimeListener("onExceptionThrown", exceptionHandler);

		_child.registerOneTimeListener("onFrameComplete", _.bind(function(frame, output) {
			// child frame produced output so push it onto the stack
			if(output !== undefined) {
				this.getStack().push(output);
			}

			_child.deRegister("onExceptionThrown", exceptionHandler);

			_child = null;
			_thread.setCurrentFrame(this);

			this.dispatch("onChildFrameCompleted", output !== undefined ? [output] : []);
		}, this));

		// we will want to resume stepping afterwards
		if(_thread.isExecutionSuspended()) {
			if(_shouldStepInto) {
				jjvm.console.debug("Stepping into child frame");
				_thread.setExecutionSuspended(true);
				_shouldStepInto = false;
			} else {
				jjvm.console.debug("Stepping over child frame");
				_thread.setExecutionSuspended(false);

				_child.registerOneTimeListener("onFrameComplete", function(frame, output) {
					jjvm.console.debug("Resuming debug");
					_thread.setExecutionSuspended(true);
				});
			}
		}

		_child._execute(_thread);
	};

	this.toString = function() {
		return "Frame#" + _version + " " + classDef.getName() + "." + methodDef.getName() + (_currentInstruction ? ":" + _currentInstruction.getLocation() : "");
	};

	this._shouldStopOnBreakpoint = function() {
		if(_isSystemFrame) {
			// sometimes we don't want breakpoints - class initializers,
			// internal string ref creation and so on
			return false;
		}

		if(_currentInstruction.hasBreakpoint()) {

			// encountered a breakpoint for the first time in this run
			if(!_thread.isExecutionSuspended()) {
				return true;
			}

			// only break if we're the currently suspended frame
			return _thread.isSuspendedInFrame(this);
		}

		return false;
	};

	this.executeNextInstruction = function(skipBreakpoint) {
		// get instruction to execute
		_currentInstruction = _instructions.next();

		this._dispatchNotification("onBeforeInstructionExecution");

		if(!skipBreakpoint && this._shouldStopOnBreakpoint()) {
			jjvm.console.debug("suspending execution!");
			_thread.setExecutionSuspended(true);

			this._dispatchNotification("onBreakpointEncountered");
			_instructions.rewind();

			return;
		}

		// actually execute the instruction
		this._executeCurrentInstruction();

		this._dispatchNotification("onInstructionExecution");
		this._dispatchNotification("onAfterInstructionExecution");

		_thread.instructionExecuted(this);

		if(!_instructions.hasNext()) {
			// all done, tell everyone
			this.dispatch("onFrameComplete", _output !== undefined ? [_output] : []);
		}
	};

	this._executeCurrentInstruction = function() {
		try {
			var constantPool = classDef.getConstantPool();

			// if we're not executing an interface, use the constantpool from 
			// the method definition's containing class
			if(!methodDef.getClassDef().isInterface()) {
				constantPool = methodDef.getClassDef().getConstantPool();
			}

			if(_thread.getInitialFrame().getMethodDef().getName() == "main") {
				jjvm.console.debug("Executing " + _currentInstruction + " from " + methodDef.getName() + " from " + classDef.getName());
			}

			_output = _currentInstruction.execute(this, constantPool);

			if(_output !== undefined) {
				// have executed a return statement..

				if(_output == jjvm.runtime.Void) {
					_output = undefined;
				}

				// make sure we don't execute any more instructions..
				_instructions.consume();
			}
		} catch(error) {
			if(error instanceof jjvm.runtime.Goto) {
				// jump to another instruction
				for(var i = 0; i < methodDef.getInstructions().length; i++) {
					if(methodDef.getInstructions()[i].getLocation() == error.getLocation()) {
						_instructions.jump(i);
					}
				}
			} else if(error instanceof jjvm.runtime.Thrown) {
				// handle java exception ref
				_output = error.getThrowable();

				this._tearDownThreadListeners();

				this.dispatch("onExceptionThrown", [error.getThrowable()]);

				return;
			} else {
				// don't know what to do
				jjvm.console.error(error);
				throw error;
			}
		}
	};

	this.setIsSystemFrame = function(systemFrame) {
		_isSystemFrame = systemFrame;
	};

	this.isSystemFrame = function() {
		return _isSystemFrame;
	};

	this.toString = function() {
		return "Frame#" + classDef.getName() + "#" + methodDef.getName() + (_currentInstruction ? ":" + _currentInstruction.getLocation() : "");
	};

	this.stepIntoNextInstruction = function() {
		_shouldStepInto = true;
	};

	this._dispatchNotification = function(eventType) {
		if(_isSystemFrame || !_thread.isSuspendedInFrame(this)) {
			return;
		}

		this.dispatch(eventType, [this.getData()]);
	};

	this.getData = function() {
		var stack = [];

		_.each(this.getStack().getStack(), function(item) {
			stack.push(item ? item.toString() : item);
		});

		var localVariables = [];

		_.each(this.getLocalVariables().getLocalVariables(), function(item) {
			localVariables.push(item ? item.toString() : item);
		});

		var nextInstruction = {
			className: classDef.getName(), 
			methodSignature: methodDef.getSignature(), 
			instruction: _instructions.peek()
		};

		if(!nextInstruction.instruction && parent) {
			nextInstruction = {
				className: parent.getClassDef().getName(), 
				methodSignature: parent.getMethodDef().getSignature(), 
				instruction: parent.getNextInstruction()
			};
		}

		if(nextInstruction.instruction) {
			nextInstruction.instruction = nextInstruction.instruction.getData();
		}

		return {
			className: classDef.getName(), 
			methodSignature: methodDef.getSignature(), 
			currentInstruction: _currentInstruction ? _currentInstruction.getData() : null, 
			nextInstruction: nextInstruction, 
			isSystemFrame: _isSystemFrame, 
			isCurrentFrame: _thread ? _thread.isCurrentFrame(this) : false,
			isExecutionSuspended: _thread ? _thread.isExecutionSuspended() : false,
			stack: stack, 
			localVariables: localVariables
		};
	};
};

jjvm.runtime.Frame.index = 0;