
describe("jjvm.core.runtime.Frame test", function () {
	var source = 
		"Compiled from \"SimpleExample.java\"\r\n" +
		"public class SimpleExample extends java.lang.Object{\r\n" +
		"\r\n" +
		"public SimpleExample();\r\n" +
		"  Code:\r\n" +
		"   0:	aload_0\r\n" +
		"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
		"   4:	return\r\n" +
		"\r\n" +
		"public int addition(int, int);\r\n" +
		"  Code:\r\n" +
		"   0:	iload_1\r\n" +
		"   1:	iload_2\r\n" +
		"   2:	iadd\r\n" +
		"   3:	istore_3\r\n" +
		"   4:	iload_3\r\n" +
		"   5:	ireturn\r\n" +
		"\r\n" +
		"}\r\n";

	beforeEach(function() {
		var compiler = new jjvm.compiler.javap.Compiler();
		compiler.compile(source);
	});

	it("should execute", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.core.runtime.ObjectReference(classDef);

		var frame = new jjvm.core.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.core.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should have executed
		expect(output).toEqual(2);
	});

	it("should execute with breakpoint", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.core.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		var frame = new jjvm.core.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.core.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should be suspended
		expect(output).toBeUndefined();
	});

	it("should execute with breakpoint and continue", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.core.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		var frame = new jjvm.core.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.core.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should be suspended
		expect(thread.isExecutionSuspended()).toBeTruthy();
		expect(output).toBeUndefined();

		// continue execution
		thread.dispatch("onResumeExecution");

		output = frame.getOutput();

		// should have executed
		expect(output).toEqual(2);
	});

	it("should drop to frame", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.core.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		// spy on an instruction
		var instructionSpy = spyOn(methodDef.getInstructions()[0], "execute").andCallThrough();

		var frame = new jjvm.core.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.core.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should be suspended
		expect(output).toBeUndefined();

		// should have been called once
		expect(instructionSpy.callCount).toEqual(1); 

		// drop to frame
		thread.dispatch("onDropToFrame");

		// not executed first instruction yet
		expect(instructionSpy.callCount).toEqual(1);

		// turn off breakpoint
		methodDef.getInstructions()[1].setBreakpoint(false);

		// resume execution
		thread.dispatch("onResumeExecution");

		// should have been called twice
		expect(instructionSpy.callCount).toEqual(2); 

		output = frame.getOutput();

		// should have executed
		expect(output).toEqual(2);
	});

	it("should step over", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.core.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		// spy on an instruction
		var instruction2Spy = spyOn(methodDef.getInstructions()[2], "execute").andCallThrough();
		var instruction3Spy = spyOn(methodDef.getInstructions()[3], "execute").andCallThrough();
		var instruction4Spy = spyOn(methodDef.getInstructions()[4], "execute").andCallThrough();

		var frame = new jjvm.core.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.core.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should be suspended
		expect(output).toBeUndefined();

		// none should have been called
		expect(instruction2Spy.callCount).toEqual(0);
		expect(instruction3Spy.callCount).toEqual(0);
		expect(instruction4Spy.callCount).toEqual(0);

		// step over breakpoint and execute instruction 1
		thread.dispatch("onStepOver");

		// not done instruction 2 yet
		expect(instruction2Spy.callCount).toEqual(0);

		// execute instruction 2
		thread.dispatch("onStepOver");

		// should have called second instruction
		expect(instruction2Spy.callCount).toEqual(1);
		expect(instruction3Spy.callCount).toEqual(0);
		expect(instruction4Spy.callCount).toEqual(0);

		// resume execution
		thread.dispatch("onResumeExecution");

		// all should have been called once
		expect(instruction2Spy.callCount).toEqual(1);
		expect(instruction3Spy.callCount).toEqual(1);
		expect(instruction4Spy.callCount).toEqual(1);

		output = frame.getOutput();

		// should have executed
		expect(output).toEqual(2);
	});
});
