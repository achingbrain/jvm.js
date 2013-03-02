
describe("jjvm.compiler.javap.FieldDefinitionParser test", function () {
	var parser = new jjvm.compiler.javap.FieldDefinitionParser();

	it("should accept field line", function () {
		var line = "public int aPublicField;";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should decline to parse non field line", function () {
		var line = "Compiled from MyClass.java";

		expect(parser.canParse(line)).toBeFalsy();
	});

	it("Should parse field line", function () {
		var iterator = new jjvm.core.Iterator(["public int aPublicField;"]);
		var fieldDef = parser.parse(iterator);

		expect(fieldDef.getName()).toEqual("aPublicField");
		expect(fieldDef.getType()).toEqual("int");
		expect(fieldDef.getVisibility()).toEqual("public");
	});
});
