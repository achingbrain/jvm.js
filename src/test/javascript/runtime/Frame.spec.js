
describe("jjvm.runtime.Frame test", function () {
	var source = [ 
		0xca, 0xfe, 0xba, 0xbe, 0x00, 0x00, 0x00, 0x32,
		0x00, 0x0f, 0x0a, 0x00, 0x03, 0x00, 0x0c, 0x07,
		0x00, 0x0d, 0x07, 0x00, 0x0e, 0x01, 0x00, 0x06,
		0x3c, 0x69, 0x6e, 0x69, 0x74, 0x3e, 0x01, 0x00,
		0x03, 0x28, 0x29, 0x56, 0x01, 0x00, 0x04, 0x43,
		0x6f, 0x64, 0x65, 0x01, 0x00, 0x0f, 0x4c, 0x69,
		0x6e, 0x65, 0x4e, 0x75, 0x6d, 0x62, 0x65, 0x72,
		0x54, 0x61, 0x62, 0x6c, 0x65, 0x01, 0x00, 0x08,
		0x61, 0x64, 0x64, 0x69, 0x74, 0x69, 0x6f, 0x6e,
		0x01, 0x00, 0x05, 0x28, 0x49, 0x49, 0x29, 0x49,
		0x01, 0x00, 0x0a, 0x53, 0x6f, 0x75, 0x72, 0x63,
		0x65, 0x46, 0x69, 0x6c, 0x65, 0x01, 0x00, 0x12,
		0x53, 0x69, 0x6d, 0x70, 0x6c, 0x65, 0x45, 0x78,
		0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x6a, 0x61,
		0x76, 0x61, 0x0c, 0x00, 0x04, 0x00, 0x05, 0x01,
		0x00, 0x0d, 0x53, 0x69, 0x6d, 0x70, 0x6c, 0x65,
		0x45, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x01,
		0x00, 0x10, 0x6a, 0x61, 0x76, 0x61, 0x2f, 0x6c,
		0x61, 0x6e, 0x67, 0x2f, 0x4f, 0x62, 0x6a, 0x65,
		0x63, 0x74, 0x00, 0x21, 0x00, 0x02, 0x00, 0x03,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
		0x00, 0x04, 0x00, 0x05, 0x00, 0x01, 0x00, 0x06,
		0x00, 0x00, 0x00, 0x1d, 0x00, 0x01, 0x00, 0x01,
		0x00, 0x00, 0x00, 0x05, 0x2a, 0xb7, 0x00, 0x01,
		0xb1, 0x00, 0x00, 0x00, 0x01, 0x00, 0x07, 0x00,
		0x00, 0x00, 0x06, 0x00, 0x01, 0x00, 0x00, 0x00,
		0x01, 0x00, 0x01, 0x00, 0x08, 0x00, 0x09, 0x00,
		0x01, 0x00, 0x06, 0x00, 0x00, 0x00, 0x22, 0x00,
		0x02, 0x00, 0x04, 0x00, 0x00, 0x00, 0x06, 0x1b,
		0x1c, 0x60, 0x3e, 0x1d, 0xac, 0x00, 0x00, 0x00,
		0x01, 0x00, 0x07, 0x00, 0x00, 0x00, 0x0a, 0x00,
		0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x04, 0x00,
		0x04, 0x00, 0x01, 0x00, 0x0a, 0x00, 0x00, 0x00,
		0x02, 0x00, 0x0b
	];

	beforeEach(function() {
		var compiler = new jjvm.compiler.Compiler();
		compiler.compileBytes(source);
	});

	it("should execute", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		var frame = new jjvm.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should have executed
		expect(output).toEqual(2);
	});

	it("should execute with breakpoint", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		var frame = new jjvm.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.runtime.Thread(frame);
		thread.run();

		var output = frame.getOutput();

		// should be suspended
		expect(output).toBeUndefined();
	});

	it("should execute with breakpoint and continue", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var methodDef = classDef.getMethod("addition");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		var frame = new jjvm.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.runtime.Thread(frame);
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
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		// spy on an instruction
		var instructionSpy = spyOn(methodDef.getInstructions()[0], "execute").andCallThrough();

		var frame = new jjvm.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.runtime.Thread(frame);
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
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		// set a breakpoint in the second instruction
		methodDef.getInstructions()[1].setBreakpoint(true);

		// spy on an instruction
		var instruction2Spy = spyOn(methodDef.getInstructions()[2], "execute").andCallThrough();
		var instruction3Spy = spyOn(methodDef.getInstructions()[3], "execute").andCallThrough();
		var instruction4Spy = spyOn(methodDef.getInstructions()[4], "execute").andCallThrough();

		var frame = new jjvm.runtime.Frame(classDef, methodDef, [objectRef, 1, 1]);

		var thread = new jjvm.runtime.Thread(frame);
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
