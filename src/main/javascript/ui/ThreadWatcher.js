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
			threadName = jjvm.core.DOMUtil.create("span", 
				jjvm.core.DOMUtil.create("i", thread.toString(), {className: "icon-arrow-right icon-white"})
			);
		} else {
			threadName = jjvm.core.DOMUtil.create("a", thread);

			threadName.onclick = _.bind(function(event) {
				event.preventDefault();

				_selectedThread = thread;
				this._update();
			}, this);
		}

		var li = jjvm.core.DOMUtil.create("li", threadName);

		if(thread.getStatus() == jjvm.runtime.Thread.STATUS.RUNNABLE) {
			threadName.className += " text-success";
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.TERMINATED) {
			threadName.className += " muted";
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.NEW) {
			threadName.className += " text-info";
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.BLOCKED) {
			threadName.className += " text-error";
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.WAITING) {
			threadName.className += " text-warn";
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.TIMED_WAITING) {
			threadName.className += " text-warn";
		}

		var frameList = jjvm.core.DOMUtil.create("ul");
		var frame = thread.getInitialFrame();

		while(frame) {
			frameList.appendChild(jjvm.core.DOMUtil.create("li", frame.toString()));	

			frame = frame.getChild();
		}

		li.appendChild(frameList);
		$(list).append(li);
	};

	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onThreadGC", _.bind(this._update, this));
};
