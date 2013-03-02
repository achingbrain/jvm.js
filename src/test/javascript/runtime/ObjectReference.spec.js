
describe("jjvm.runtime.ObjectReference test", function () {

	it("should enforce fields not existing", function () {
		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		expect(_.bind(objectRef._hasField, objectRef, "nonExistent")).toThrow();
	});

	it("should enforce field existing", function () {
		var source = "Compiled from \"SimpleExample.java\"\r\n" +
			"public class SimpleExample extends java.lang.Object{\r\n" +
			"public int foo;\r\n" +
			"\r\n" +
			"public SimpleExample();\r\n" +
			"  Code:\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	return\r\n" +
			"\r\n" +
			"}";

		var compiler = new jjvm.compiler.javap.Compiler();
		compiler.compile(source);

		var classDef = jjvm.core.ClassLoader.loadClass("SimpleExample");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		expect(_.bind(objectRef._hasField, objectRef, "foo")).not.toThrow();
	});
});
