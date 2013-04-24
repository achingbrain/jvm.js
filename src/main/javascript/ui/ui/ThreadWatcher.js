jjvm.ui.ThreadWatcher = function(list) {
	var _selectedThread;

	this.getSelectedThread = function() {
		return _selectedThread;
	};

	this.setSelectedThread = function(thread) {
		_selectedThread = thread;
	};

	this._update = function(sender, threads) {
		$(list).empty();

		_.each(threads, _.bind(function(thread) {
			if(!_selectedThread) {
				_selectedThread = thread;
			}

			this._addThread(thread);
		}, this));
	};

	this._addThread = function(thread) {
		var threadName;

		if(_selectedThread == thread) {
			threadName = jjvm.core.DOMUtil.create("span", 
				jjvm.core.DOMUtil.create("i", thread.name, {className: "icon-arrow-right icon-white"})
			);
		} else {
			threadName = jjvm.core.DOMUtil.create("a", thread.name);

			threadName.onclick = _.bind(function(event) {
				event.preventDefault();

				_selectedThread = thread;
				//this._update();
			}, this);
		}

		var li = jjvm.core.DOMUtil.create("li", threadName);

		if(thread.status == "RUNNABLE") {
			threadName.className += " text-success";
		} else if(thread.status == "TERMINATED") {
			threadName.className += " muted";
		} else if(thread.status == "NEW") {
			threadName.className += " text-info";
		} else if(thread.status == "BLOCKED") {
			threadName.className += " text-error";
		} else if(thread.status == "WAITING") {
			threadName.className += " text-warn";
		} else if(thread.status == "TIMED_WAITING") {
			threadName.className += " text-warn";
		}

		var frameList = jjvm.core.DOMUtil.create("ul");

		_.each(thread.frames, function(frame) {
			frameList.appendChild(jjvm.core.DOMUtil.create("li", frame.className + "#" + frame.methodSignature));
		});

		li.appendChild(frameList);
		$(list).append(li);
	};

	jjvm.core.NotificationCentre.register("onGotThreads", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onBreakpointEncountered", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onExecutionStarted", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onThreadGC", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
};
