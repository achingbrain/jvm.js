jjvm.runtime.Thread = function(frame, parent) {
	_.extend(this, jjvm.core.Watchable);

	jjvm.runtime.ThreadPool.threads.push(this);

	var _initialFrame = frame;
	var _currentFrame = frame;
	var _executionSuspended;
	var _index = jjvm.runtime.Thread.index++;
	var _status = jjvm.runtime.Thread.STATUS.NEW;

	this.run = function() {
		this.setStatus(jjvm.runtime.Thread.STATUS.RUNNABLE);
		frame._execute(this);
	};

	this.isExecutionSuspended = function() {
		return _executionSuspended ? true : false;
	};

	this.setExecutionSuspended = function(executionSuspended) {
		_executionSuspended  = executionSuspended;
	};

	this.isSuspendedInFrame = function(frame) {
		return _executionSuspended && _currentFrame == frame;
	};

	this.isCurrentFrame = function(frame) {
		return _currentFrame == frame;
	};

	this.getCurrentFrame = function() {
		return _currentFrame;
	};

	this.getInitialFrame = function() {
		return _initialFrame;
	};

	this.setCurrentFrame = function(frame) {
		_currentFrame = frame;

		// make sure that we move execution context back to the parent frame once this one is done
		_currentFrame.registerOneTimeListener("onFrameComplete", _.bind(function(sender) {
			if(sender.getParent()) {
				this.setCurrentFrame(sender.getParent());
			} else {
				this.setStatus(jjvm.runtime.Thread.STATUS.TERMINATED);

				if(sender.getMethodDef().getName() == "main") {
					this.dispatch("onExecutionComplete");
				}

				jjvm.runtime.ThreadPool.reap();
			}
		}, this));

		this.dispatch("onCurrentFrameChanged", [this.getData(), _currentFrame.getData()]);
	};

	this.getInitialFrame = function() {
		return _initialFrame;
	};

	this.setStatus = function(status) {
		_status = status;

		this.dispatch("onThreadStatusChanged", [this.getData(), frame.getData()]);
	};

	this.getStatus = function() {
		return _status;
	};

	this.toString = function() {
		return "Thread#" + _index + " (" + _status + ")";
	};

	this.resumeExecution = function(sender) {
		this.setExecutionSuspended(false);
		_currentFrame.executeNextInstruction(true);
	};

	this.suspendExecution = function(sender) {
		
	};

	this.stepOver = function(sender) {
		jjvm.console.debug("Telling frame " + _currentFrame + " to advance");
		_currentFrame.executeNextInstruction(true);
	};

	this.stepInto = function(sender) {
		if(!_currentFrame.getNextInstruction() || !_currentFrame.getNextInstruction().canStepInto()) {
			jjvm.console.warn("Can only step into bytecode that creates a new frame.");
			return;
		}

		_currentFrame.stepIntoNextInstruction();
		_currentFrame.executeNextInstruction(true);
	};

	this.stepOut = function(sender) {
		_executionSuspended = false;

		// suspend execution again once the current frame has finished
		_currentFrame.registerOneTimeListener("onFrameComplete", function(sender) {
			_executionSuspended = true;
		});

		_currentFrame.executeNextInstruction(true);
	};

	this.dropToFrame = function(sender) {
		_currentFrame.reset();
	};

	this.instructionExecuted = function(frame) {
		if(!frame.getNextInstruction()) {
			return;
		}

		if(frame != _currentFrame) {
			return;
		}

		if(frame.isSystemFrame()) {
			// system frame, continue execution
			frame.executeNextInstruction();
		} else if(!_executionSuspended) {
			// we are not suspended, execute next instruction
			frame.executeNextInstruction();
		} else if(!this.isSuspendedInFrame(frame)) {
			// we're suspended, but have stepped over this frame, execute next instruction
			frame.executeNextInstruction();
		}

		//jjvm.console.info("Not executing instruction " + _executionSuspended);
		// wait for instruction from user to continue
	};

	this.getData = function() {
		var frames = [];
		var frame = _initialFrame;

		while(frame) {
			var frameData = frame.getData();

			if(_currentFrame == frame) {
				frameData.currentFrame = true;
			}

			frames.push(frameData);

			frame = frame.getChild();
		}

		return {
			name: this.toString(), 
			status: this.getStatus(),
			frames: frames
		};
	};
};

jjvm.runtime.Thread.index = 0;
jjvm.runtime.Thread.STATUS = {
	NEW: "NEW",
	RUNNABLE: "RUNNABLE",
	BLOCKED: "BLOCKED",
	WAITING: "WAITING",
	TIMED_WAITING: "TIMED_WAITING",
	TERMINATED: "TERMINATED"
};
