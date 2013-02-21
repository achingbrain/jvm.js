
describe("ThreadPool test", function () {

	it("should contain threads", function () {
		var thread = new Thread();

		expect(ThreadPool.threads).toContain(thread);
	});

	it("should reap threads", function () {
		var thread = new Thread();

		expect(ThreadPool.threads).toContain(thread);

		thread.setStatus(Thread.STATUS.TERMINATED);

		ThreadPool.reap();

		expect(ThreadPool.threads).not.toContain(thread);
	});	
});
