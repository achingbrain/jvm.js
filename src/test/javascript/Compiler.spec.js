
describe("Compiler test", function () {
	var compiler = new Compiler();

	it("should compile class", function () {
		var source = 
			"Compiled from \"SimpleExample.java\"\r\n" +
			"public class SimpleExample extends java.lang.Object{\r\n" +
			"public int publicArgument;\r\n" +
			"\r\n" +
			"public int yaPublicArgument;\r\n" +
			"\r\n" +
			"protected int protectedArgument;\r\n" +
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
			"public long addition(long, long);\r\n" +
			"  Code:\r\n" +
			"   0:	iload_1\r\n" +
			"   1:	iload_2\r\n" +
			"   2:	iadd\r\n" +
			"   3:	istore_3\r\n" +
			"   4:	iload_3\r\n" +
			"   5:	ireturn\r\n" +
			"\r\n" +
			"}\r\n";

		compiler.compile(source);

		var classes = ClassLoader.getClassDefinitions();
		var classDef = null;

		for(var i = 0; i < classes.length; i++) {
			if(classes[i].getName() == "SimpleExample") {
				classDef = classes[i];
			}
		}

		expect(classDef).not.toBeNull();
		expect(classDef.getConstructors().length).toEqual(1);
		expect(classDef.getMethods().length).toEqual(2);
		expect(classDef.getFields().length).toEqual(3);

		var numClasses = classes.length;

		// test redefining classes
		compiler.compile(source);

		classes = ClassLoader.getClassDefinitions();

		// redefined class, should have replaced the old one
		expect(classes.length).toEqual(numClasses);
	});
});
