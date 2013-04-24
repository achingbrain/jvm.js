
describe("jjvm.runtime.ThreadPool test", function () {

	it("should contain threads", function () {
		var thread = new jjvm.runtime.Thread();

		expect(jjvm.runtime.ThreadPool.threads).toContain(thread);
	});

	it("should reap threads", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var frame = new jjvm.runtime.Frame(classDef, classDef.getMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER));
		frame.setIsSystemFrame(true);
		var thread = new jjvm.runtime.Thread(frame);

		expect(jjvm.runtime.ThreadPool.threads).toContain(thread);

		thread.setStatus(jjvm.runtime.Thread.STATUS.TERMINATED);

		jjvm.runtime.ThreadPool.reap();

		expect(jjvm.runtime.ThreadPool.threads).not.toContain(thread);
	});	
});
