jjvm.ui.ThreadWatcher = function(list) {
	var _selectedThread;

	this.getSelectedThread = function() {
		return _selectedThread;
	};

	this.setSelectedThread = function(thread) {
		_selectedThread = thread;
	};

	this._update = function(frame) {
		if(frame instanceof jjvm.runtime.Frame && frame.isSystemFrame()) {
			return;
		}

		$(list).empty();

		for(var i = 0; i < jjvm.runtime.ThreadPool.threads.length; i++) {
			if(!_selectedThread) {
				_selectedThread = jjvm.runtime.ThreadPool.threads[i];
			}

			this._addThread(jjvm.runtime.ThreadPool.threads[i]);
		}
	};

	this._addThread = function(thread) {
		var threadName;

		if(_selectedThread == thread) {
			threadName = $("<span><i class=\"icon-arrow-right icon-white\"></i> " + thread + "</span>");
		} else {
			threadName = $("<a>" + thread + "</a>");

			$(threadName).click(_.bind(function(event) {
				event.preventDefault();

				_selectedThread = thread;
				this._update();
			}, this));
		}

		var li = $("<li />");
		$(li).append(threadName);

		if(thread.getStatus() == jjvm.runtime.Thread.STATUS.RUNNABLE) {
			$(threadName).addClass("text-success");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.TERMINATED) {
			$(threadName).addClass("muted");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.NEW) {
			$(threadName).addClass("text-info");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.BLOCKED) {
			$(threadName).addClass("text-error");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.WAITING) {
			$(threadName).addClass("text-warn");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.TIMED_WAITING) {
			$(threadName).addClass("text-warn");
		}

		var frameList = $("<ul></ul>");
		var frame = thread.getInitialFrame();

		while(frame) {
			$(frameList).append("<li>" + frame + "</li>");	

			frame = frame.getChild();
		}

		$(li).append(frameList);
		$(list).append(li);
	};

	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onThreadGC", _.bind(this._update, this));
};
