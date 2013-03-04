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

	this._dropToFrame = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// reset execution index and enabled stepping
		_instructions.reset();
		_currentInstruction = _instructions.peek();
		this.dispatch("onBeforeInstructionExecution", _currentInstruction);
	};

	var stepOverCallback = _.bind(this._stepOver, this);
	var dropToFrameCallback = _.bind(this._dropToFrame, this);
	var resumeExecutionCallback = _.bind(this._resumeExecution, this);

	this.execute = function(thread) {
		_thread = thread;
		_thread.setCurrentFrame(this);
		_thread.register("onStepOver", stepOverCallback);
		_thread.register("onDropToFrame", dropToFrameCallback);
		_thread.register("onResumeExecution", resumeExecutionCallback);

		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var target = args.shift();
			_output = methodDef.getImplementation().apply(target, args);

			this.dispatch("onFrameComplete");
		} else {
			if(_thread.isExecutionSuspended()) {
				_currentInstruction = _instructions.peek();
				this.dispatch("onBeforeInstructionExecution", _currentInstruction);
			} else {
				this._executeNextInstruction();
			}
		}
	};

	this.executeChild = function(classDef, methodDef, args) {
		_child = new jjvm.runtime.Frame(classDef, methodDef, args, this);

		_child.register("onFrameComplete", _.bind(function() {
			if(_child.getOutput() !== undefined) {
				//this.getStack().push(_child.getOutput());
			}

			this.dispatch("onChildFrameCompleted", _child.getOutput());
			_child = null;
			_thread.setCurrentFrame(this);

			// highlight our next instruction
			_currentInstruction = _instructions.peek();
			this.dispatch("onBeforeInstructionExecution", _currentInstruction);
		}, this));

		_child.execute(_thread, _executionHalted);

		return _child;
	};

	this.toString = function() {
		return "Frame#" + _version + " " + classDef.getName() + "." + methodDef.getName() + (_currentInstruction ? ":" + _currentInstruction.getLocation() : "");
	};

	this._shouldStopOnBreakpoint = function() {
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

		this.dispatch("onBeforeInstructionExecution", _currentInstruction);

		if(this._shouldStopOnBreakpoint()) {
			this.dispatch("onBreakpointEncountered", _currentInstruction);
			_thread.setExecutionSuspended(true);
			_instructions.rewind();

			return;
		}

		try {
			var output = _currentInstruction.execute(this, classDef.getConstantPool());

			if(output !== undefined) {
				_output = output;
			}
		} catch(error) {
			if(error instanceof jjvm.runtime.Goto) {
				for(var i = 0; i < methodDef.getInstructions().length; i++) {
					if(methodDef.getInstructions()[i].getLocation() == error.getLocation()) {
						_executionIndex = i - 1;
					}
				}
			} else {
				throw error;
			}
		}

		this.dispatch("onInstructionExecution", _currentInstruction);
		this.dispatch("onAfterInstructionExecution", _currentInstruction);

		if(!_instructions.hasNext()) {
			_thread.deRegister("onStepOver", stepOverCallback);
			_thread.deRegister("onDropToFrame", dropToFrameCallback);
			_thread.deRegister("onResumeExecution", resumeExecutionCallback);

			this.dispatch("onFrameComplete");

			return;
		}

		if(_thread.isExecutionSuspended() !== true) {
			// execute next instruction in one second
			this._executeNextInstruction();
			//setTimeout(_.bind(this._executeNextInstruction, this), 1000);
		} else if(_instructions.hasNext() && _thread.isCurrentFrame(this)) {
			
			// we are suspended, highlight the next instruction
			var next = _instructions.peek();

			this.dispatch("onBeforeInstructionExecution", next);
		}
	};

	this.toString = function() {
		return "Frame#" + classDef.getName() + "#" + methodDef.getName();
	};
};

jjvm.runtime.Frame.index = 0;