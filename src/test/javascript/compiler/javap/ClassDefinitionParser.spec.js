
describe("jjvm.compiler.javap.ClassDefinitionParser test", function () {
	var parser = new jjvm.compiler.javap.ClassDefinitionParser();

	it("should accept class name line", function () {
		var line = "public class MyClass extends java.lang.Object{";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should accept class name line with single interface", function () {
		var line = "public class MyClass extends java.lang.Object implements java.io.PrintStream {";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should accept class name line with multiple interfaces", function () {
		var line = "public class MyClass extends java.lang.Object implements java.io.PrintStream,java.io.Writer {";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should accept interface", function () {
		var line = "public interface java.io.Serializable{";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should accept abstract class name line with no visibility", function () {
		var line = "abstract class MyClass extends java.lang.Object{";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should decline to parse line without class name", function () {
		var line = "Compiled from MyClass.java";

		expect(parser.canParse(line)).toBeFalsy();
	});

	it("Should parse class definition", function () {
		var iterator = new jjvm.core.Iterator([
			"public class MyClass extends java.lang.Object{"
		]);
		var classDef = parser.parse(iterator);

		// should have parsed class definition correctly
		expect(classDef.getName()).toEqual("MyClass");
		expect(classDef.getParent().getName()).toEqual("java.lang.Object");
		expect(classDef.getFields().length).toEqual(0);
		expect(classDef.getMethods().length).toEqual(0);
	});
});
