
describe("ConstructorDefinitionParser test", function () {
	var parser = new ConstructorDefinitionParser();

	it("should accept constructor line", function () {
		var line = "public MyClass(int, int);";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should accept constructor line with no arguments", function () {
		var line = "public MyClass();";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should decline to parse line without method name", function () {
		var line = "Compiled from MyClass.java";

		expect(parser.canParse(line)).toBeFalsy();
	});

	it("Should parse constructor definition", function () {
		var iterator = new Iterator([
			"public MyClass(int, int);",
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
		expect(methodDef.getName()).toEqual("MyClass");
		expect(methodDef.getVisibility()).toEqual("public");
		expect(methodDef.getArgs().length).toEqual(2);
	});
});
