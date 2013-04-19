jjvm.ui.JVM = function() {
	var _worker = new Worker("/js/jjvm_compiler_worker.js");

	_worker.onmessage = function(event) {
		var actions = {
			"postNotification": function(type, args) {
				jjvm.core.NotificationCentre.dispatch(this, type, args);
			},
			"consoleError": function(message) {
				jjvm.ui.JJVM.console.error(message);
			},
			"consoleWarn": function(message) {
				jjvm.ui.JJVM.console.warn(message);
			},
			"consoleInfo": function(message) {
				jjvm.ui.JJVM.console.info(message);
			},
			"consoleDebug": function(message) {
				jjvm.ui.JJVM.console.debug(message);
			},
			"getThreads": function(threads) {
				jjvm.core.NotificationCentre.dispatch(this, "onGotThreads", [threads]);
			}
		};

		var args = JSON.parse(event.data.args);

		if(actions[event.data.action]) {
			actions[event.data.action].apply(actions[event.data.action], args);
		} else {
			console.error("Unknown action from worker " + event.data.action);
		}
	};

	// takes a File or Blob object
	this.compile = function(file) {
		var reader = new FileReader();

		// init the reader event handlers
		reader.onload = _.bind(this._onFileLoaded, this, file);

		// begin the read operation
		reader.readAsArrayBuffer(file);
	};

	this._onFileLoaded = function(file, event) {
		_worker.postMessage({
			action: "compile",
			args: [new Uint8Array(event.target.result)]
		});
	};

	this.run = function(args) {
		_worker.postMessage({
			action: "run",
			args: [args]
		});
	};

	this.setBreakpoint = function(className, methodSignature, instructionIndex, setBreakpoint) {
		_worker.postMessage({
			action: "setBreakpoint",
			args: [className, methodSignature, instructionIndex, setBreakpoint]
		});
	};

	this.resumeExecution = function() {
		_worker.postMessage({
			action: "resumeExecution",
			args: []
		});	
	};

	this.suspendExecution = function() {
		_worker.postMessage({
			action: "suspendExecution",
			args: []
		});	
	};

	this.stepOver = function(threadName) {
		_worker.postMessage({
			action: "stepOver",
			args: [threadName]
		});	
	};

	this.stepInto = function(threadName) {
		_worker.postMessage({
			action: "stepInto",
			args: [threadName]
		});	
	};

	this.dropToFrame = function(threadName) {
		_worker.postMessage({
			action: "dropToFrame",
			args: [threadName]
		});	
	};

	this.getThreads = function() {
		_worker.postMessage({
			action: "getThreads",
			args: []
		});	
	};
};
