jjvm.runtime.ThreadPool = {
	threads: [],
	
	reap: function() {
		for(var i = 0; i < jjvm.runtime.ThreadPool.threads.length; i++) {
			if(jjvm.runtime.ThreadPool.threads[i].getStatus() == jjvm.runtime.Thread.STATUS.TERMINATED) {
				jjvm.runtime.ThreadPool.threads.splice(i, 1);
			}
		}
	}
};
