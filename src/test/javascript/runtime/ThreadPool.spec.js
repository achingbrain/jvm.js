
describe("jjvm.runtime.ThreadPool test", function () {

	it("should contain threads", function () {
		var thread = new jjvm.runtime.Thread();

		expect(jjvm.runtime.ThreadPool.threads).toContain(thread);
	});

	it("should reap threads", function () {
		var thread = new jjvm.runtime.Thread();

		expect(jjvm.runtime.ThreadPool.threads).toContain(thread);

		thread.setStatus(jjvm.runtime.Thread.STATUS.TERMINATED);

		jjvm.runtime.ThreadPool.reap();

		expect(jjvm.runtime.ThreadPool.threads).not.toContain(thread);
	});	
});
