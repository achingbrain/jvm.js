jjvm.runtime.Thread = function(frame, parent) {
	_.extend(this, jjvm.core.Watchable);

	jjvm.runtime.ThreadPool.threads.push(this);
	
	var _initialFrame = frame;
	var _currentFrame = frame;
	var _index = jjvm.runtime.Thread.index++;
	var _status = jjvm.runtime.Thread.STATUS.NEW;
	var _executionSuspended;

	this.run = function() {
		frame.register("onFrameComplete", _.bind(function() {
			this.setStatus(jjvm.runtime.Thread.STATUS.TERMINATED);

			if(parent === undefined && frame.getMethodDef().getName() == "main") {
				this.dispatch("onExecutionComplete");
			}
		}, this));

		this.setStatus(jjvm.runtime.Thread.STATUS.RUNNABLE);
		frame.execute(this);
	};

	this.isExecutionSuspended = function() {
		return _executionSuspended ? true : false;
	};

	this.setExecutionSuspended = function(executionSuspended) {
		_executionSuspended  = executionSuspended;
	};

	this.isCurrentFrame = function(frame) {
		return _currentFrame == frame;
	};

	this.getCurrentFrame = function() {
		return _currentFrame;
	};

	this.setCurrentFrame = function(frame) {
		_currentFrame = frame;

		this.dispatch("onCurrentFrameChanged", frame);
	};

	this.getInitialFrame = function(frame) {
		return _initialFrame;
	};

	this.setStatus = function(status) {
		_status = status;

		this.dispatch("onThreadStatusChanged", frame);
	};

	this.getStatus = function() {
		return _status;
	};

	this.toString = function() {
		return "Thread#" + _index + " (" + _status + ")";
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
