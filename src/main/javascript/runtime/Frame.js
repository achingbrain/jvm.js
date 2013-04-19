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
	var _skipBreakpointAtLocation;
	var _executionHalted;
	var _isSystemFrame;

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

	this._resumeExecution = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		_thread.setExecutionSuspended(false);
		_skipBreakpointAtLocation = _currentInstruction.getLocation();

		this._executeNextInstruction();
	};

	this._stepOver = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// start stepping
		this._executeNextInstruction();
	};

	this._stepInto = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		var nextInstruction = _instructions.peek();

		if(!nextInstruction.canStepInto()) {
			console.warn("Can only step into methods that create a new frame.");
			return;
		}

		// start stepping
		this._executeNextInstruction();
	};

	this._dropToFrame = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// reset execution index and enabled stepping
		_instructions.reset();
		_stack = new jjvm.runtime.Stack();
		_currentInstruction = _instructions.peek();
		this._dispatchNotification("onBeforeInstructionExecution");
	};

	var stepOverCallback = _.bind(this._stepOver, this);
	var stepIntoCallback = _.bind(this._stepInto, this);
	var dropToFrameCallback = _.bind(this._dropToFrame, this);
	var resumeExecutionCallback = _.bind(this._resumeExecution, this);

	this.execute = function(thread) {
		_thread = thread;
		_thread.setCurrentFrame(this);
		_thread.register("onStepOver", stepOverCallback);
		_thread.register("onStepInto", stepIntoCallback);
		_thread.register("onDropToFrame", dropToFrameCallback);
		_thread.register("onResumeExecution", resumeExecutionCallback);

		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var target = classDef;

			if(!methodDef.isStatic()) {
				target = _variables.load(0);
			}

			args.unshift(target);
			args.unshift(methodDef);
			args.unshift(classDef);
			args.unshift(this);
			_output = methodDef.getImplementation().apply(target, args);

			this.dispatch("onFrameComplete");
		} else {
			if(_thread.isExecutionSuspended()) {
				_currentInstruction = _instructions.peek();
				this._dispatchNotification("onBeforeInstructionExecution");
			} else {
				this._executeNextInstruction();
			}
		}
	};

	this.executeChild = function(classDef, methodDef, args) {
		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var target = classDef;

			if(!methodDef.isStatic()) {
				target = args.shift();
			}

			args.unshift(target);
			args.unshift(methodDef);
			args.unshift(classDef);
			args.unshift(this);
			var childOutput = methodDef.getImplementation().apply(target, args);

			// override produced output so push it onto the stack
			if(childOutput !== undefined) {
				this.getStack().push(childOutput);
			}

			this.dispatch("onChildFrameCompleted", [childOutput]);
		} else {
			_child = new jjvm.runtime.Frame(classDef, methodDef, args, this);
			_child.setIsSystemFrame(_isSystemFrame);

			_child.registerOneTimeListener("onFrameComplete", _.bind(function(frame, output) {
				// child frame produced output so push it onto the stack
				if(output !== undefined) {
					this.getStack().push(output);
				}

				_child = null;
				_thread.setCurrentFrame(this);

				this.dispatch("onChildFrameCompleted", [output]);
			}, this));
			_child.registerOneTimeListener("onExceptionThrown", _.bind(function(frame, thrown) {
				if(!this.getMethodDef().getExceptionTable()) {
					if(!parent) {
						// nowhere to bubble to...
						throw "Uncaught exception! " + thrown;
					}

					// exception bubbles up
					this.dispatch("onExceptionThrown", [thrown]);

					return;
				}

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
			}, this));

			_child.execute(_thread, _executionHalted);
		}

		return _child;
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

		if(!_currentInstruction.hasBreakpoint()) {
			return false;
		}

		// this makes the resume button work if we're currently on an 
		// instruction with a breakpoint
		if(_currentInstruction.getLocation() == _skipBreakpointAtLocation) {
			_skipBreakpointAtLocation = -1;

			return false;
		}

		if(_thread.isExecutionSuspended()) {
			return false;
		}

		return true;
	};

	this._executeNextInstruction = function() {
		// get instruction to execute
		_currentInstruction = _instructions.next();

		this._dispatchNotification("onBeforeInstructionExecution");

		if(this._shouldStopOnBreakpoint()) {
			_thread.setExecutionSuspended(true, this);
			this._dispatchNotification("onBreakpointEncountered");
			_instructions.rewind();

			return;
		}

		try {
			var constantPool = classDef.getConstantPool();

			// if we're not executing an interface, use the constantpool from 
			// the method definition's containing class
			if(!methodDef.getClassDef().isInterface()) {
				constantPool = methodDef.getClassDef().getConstantPool();
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
				console.error(error);
				throw error;
			}
		}

		this._dispatchNotification("onInstructionExecution");
		this._dispatchNotification("onAfterInstructionExecution");

		if(!_instructions.hasNext()) {
			// all done
			this._tearDownThreadListeners();
			this.dispatch("onFrameComplete", [_output]);

			return;
		}

		//if(!_thread.isSuspendedInFrame(this)) {
		if(!_thread.isExecutionSuspended()) {
			this._executeNextInstruction();
			// execute next instruction in one second
			//setTimeout(_.bind(this._executeNextInstruction, this), 1000);
		}
	};

	this.setIsSystemFrame = function(systemFrame) {
		_isSystemFrame = systemFrame;
	};

	this.isSystemFrame = function() {
		return _isSystemFrame;
	};

	this.toString = function() {
		return "Frame#" + classDef.getName() + "#" + methodDef.getName();
	};

	this._tearDownThreadListeners = function() {
		_thread.deRegister("onStepOver", stepOverCallback);
		_thread.deRegister("onStepInto", stepIntoCallback);
		_thread.deRegister("onDropToFrame", dropToFrameCallback);
		_thread.deRegister("onResumeExecution", resumeExecutionCallback);
	};

	this._dispatchNotification = function(eventType) {
		var stack = [];

		_.each(this.getStack().getStack(), function(index, item) {
			stack.push(item.toString());
		});

		var localVariables = [];

		_.each(this.getLocalVariables().getLocalVariables(), function(index, item) {
			localVariables.push(item.toString());
		});

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