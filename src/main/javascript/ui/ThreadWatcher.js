ThreadWatcher = function(list) {
	var _selectedThread;

	this.getSelectedThread = function() {
		return _selectedThread;
	};

	this.setSelectedThread = function(thread) {
		_selectedThread = thread;
	};

	this._update = function() {
		$(list).empty();

		for(var i = 0; i < ThreadPool.threads.length; i++) {
			if(!_selectedThread) {
				_selectedThread = ThreadPool.threads[i];
			}

			this._addThread(ThreadPool.threads[i]);
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

		if(thread.getStatus() == Thread.STATUS.RUNNABLE) {
			$(threadName).addClass("text-success");
		} else if(thread.getStatus() == Thread.STATUS.TERMINATED) {
			$(threadName).addClass("muted");
		} else if(thread.getStatus() == Thread.STATUS.NEW) {
			$(threadName).addClass("text-info");
		} else if(thread.getStatus() == Thread.STATUS.BLOCKED) {
			$(threadName).addClass("text-error");
		} else if(thread.getStatus() == Thread.STATUS.WAITING) {
			$(threadName).addClass("text-warn");
		} else if(thread.getStatus() == Thread.STATUS.TIMED_WAITING) {
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

	NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._update, this));
	NotificationCentre.register("onExecutionComplete", _.bind(this._update, this));
};
