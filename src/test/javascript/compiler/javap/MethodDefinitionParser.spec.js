
describe("jjvm.compiler.javap.MethodDefinitionParser test", function () {
	var parser = new jjvm.compiler.javap.MethodDefinitionParser();

	it("should accept method name line", function () {
		var line = "public int addition(int, int);";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should decline to parse line without method name", function () {
		var line = "Compiled from MyClass.java";

		expect(parser.canParse(line)).toBeFalsy();
	});

	it("should accept method name line without visibility", function () {
		var line = "static int addition(int, int);";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("Should parse method definition", function () {
		var iterator = new jjvm.core.Iterator([
			"public int addition(int, int);",
			"  Code:",
			"0:	iload_1",
			"1:	iload_2",
			"2:	iadd",
			"3:	istore_3",
			"4:	iload_3",
			"5:	ireturn",
			""
		]);
		var methodDef = parser.parse(iterator);

		// should have parsed class definition correctly
		expect(methodDef.getName()).toEqual("addition");
		expect(methodDef.getVisibility()).toEqual("public");
		expect(methodDef.getArgs().length).toEqual(2);
		expect(methodDef.getReturns()).toEqual("int");
	});

	it("Should parse method definition without visibility", function () {
		var iterator = new jjvm.core.Iterator([
			"int addition(int, int);",
			"  Code:",
			"0:	iload_1",
			"1:	iload_2",
			"2:	iadd",
			"3:	istore_3",
			"4:	iload_3",
			"5:	ireturn",
			""
		]);
		var methodDef = parser.parse(iterator);

		// should have parsed class definition correctly
		expect(methodDef.getName()).toEqual("addition");
		expect(methodDef.getVisibility()).toEqual("public");
		expect(methodDef.getArgs().length).toEqual(2);
		expect(methodDef.getReturns()).toEqual("int");
	});
});
