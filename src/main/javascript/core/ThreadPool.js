ThreadPool = {
	threads: [],
	
	reap: function() {
		for(var i = 0; i < ThreadPool.threads.length; i++) {
			if(ThreadPool.threads[i].getStatus() == "TERMINATED") {
				ThreadPool.threads.splice(i, 1);
			}
		}
	}
};
