
describe("jjvm.compiler.javap.Compiler test", function () {
	var compiler = new jjvm.compiler.javap.Compiler();

	it("should compile class", function () {
		var source = 
			"Compiled from \"CompilerTest.java\"\r\n" +
			"public class CompilerTest extends java.lang.Object implements java.io.Serializable\r\n" +
			"  SourceFile: \"CompilerTest.java\"\r\n" +
			"  minor version: 0\r\n" +
			"  major version: 50\r\n" +
			"  Constant pool:\r\n" +
			"const #1 = Field	#2.#44;	//  CompilerTest.A_STATIC_FIELD:I\r\n" +
			"const #2 = class	#45;	//  CompilerTest\r\n" +
			"const #3 = Method	#2.#46;	//  CompilerTest.\"<init>\":()V\r\n" +
			"const #4 = Method	#14.#46;	//  java/lang/Object.\"<init>\":()V\r\n" +
			"const #5 = Field	#2.#47;	//  CompilerTest.aPublicField:I\r\n" +
			"const #6 = Field	#2.#48;	//  CompilerTest.aProtectedField:I\r\n" +
			"const #7 = Field	#2.#49;	//  CompilerTest.aPrivateField:I\r\n" +
			"const #8 = Method	#50.#51;	//  java/lang/Integer.parseInt:(Ljava/lang/String;)I\r\n" +
			"const #9 = Field	#52.#53;	//  java/lang/System.out:Ljava/io/PrintStream;\r\n" +
			"const #10 = String	#54;	//  finally\r\n" +
			"const #11 = Method	#55.#56;	//  java/io/PrintStream.println:(Ljava/lang/String;)V\r\n" +
			"const #12 = class	#57;	//  java/lang/NumberFormatException\r\n" +
			"const #13 = Method	#12.#58;	//  java/lang/NumberFormatException.getMessage:()Ljava/lang/String;\r\n" +
			"const #14 = class	#59;	//  java/lang/Object\r\n" +
			"const #15 = class	#60;	//  java/io/Serializable\r\n" +
			"const #16 = Asciz	A_STATIC_FIELD;\r\n" +
			"const #17 = Asciz	I;\r\n" +
			"const #18 = Asciz	A_FINAL_STATIC_FIELD;\r\n" +
			"const #19 = Asciz	ConstantValue;\r\n" +
			"const #20 = int	0;\r\n" +
			"const #21 = Asciz	aPublicField;\r\n" +
			"const #22 = Asciz	aProtectedField;\r\n" +
			"const #23 = Asciz	aPrivateField;\r\n" +
			"const #24 = Asciz	aPublicVoidMethodThatThrows;\r\n" +
			"const #25 = Asciz	()V;\r\n" +
			"const #26 = Asciz	Code;\r\n" +
			"const #27 = Asciz	LineNumberTable;\r\n" +
			"const #28 = Asciz	Exceptions;\r\n" +
			"const #29 = class	#61;	//  java/lang/Exception\r\n" +
			"const #30 = Asciz	main;\r\n" +
			"const #31 = Asciz	([Ljava/lang/String;)V;\r\n" +
			"const #32 = Asciz	<init>;\r\n" +
			"const #33 = Asciz	(Ljava/lang/String;)V;\r\n" +
			"const #34 = Asciz	addition;\r\n" +
			"const #35 = Asciz	(II)I;\r\n" +
			"const #36 = Asciz	methodWithBranch;\r\n" +
			"const #37 = Asciz	()I;\r\n" +
			"const #38 = Asciz	StackMapTable;\r\n" +
			"const #39 = Asciz	methodWithTryCatch;\r\n" +
			"const #40 = class	#57;	//  java/lang/NumberFormatException\r\n" +
			"const #41 = class	#62;	//  java/lang/Throwable\r\n" +
			"const #42 = Asciz	SourceFile;\r\n" +
			"const #43 = Asciz	CompilerTest.java;\r\n" +
			"const #44 = NameAndType	#16:#17;//  A_STATIC_FIELD:I\r\n" +
			"const #45 = Asciz	CompilerTest;\r\n" +
			"const #46 = NameAndType	#32:#25;//  \"<init>\":()V\r\n" +
			"const #47 = NameAndType	#21:#17;//  aPublicField:I\r\n" +
			"const #48 = NameAndType	#22:#17;//  aProtectedField:I\r\n" +
			"const #49 = NameAndType	#23:#17;//  aPrivateField:I\r\n" +
			"const #50 = class	#63;	//  java/lang/Integer\r\n" +
			"const #51 = NameAndType	#64:#65;//  parseInt:(Ljava/lang/String;)I\r\n" +
			"const #52 = class	#66;	//  java/lang/System\r\n" +
			"const #53 = NameAndType	#67:#68;//  out:Ljava/io/PrintStream;\r\n" +
			"const #54 = Asciz	finally;\r\n" +
			"const #55 = class	#69;	//  java/io/PrintStream\r\n" +
			"const #56 = NameAndType	#70:#33;//  println:(Ljava/lang/String;)V\r\n" +
			"const #57 = Asciz	java/lang/NumberFormatException;\r\n" +
			"const #58 = NameAndType	#71:#72;//  getMessage:()Ljava/lang/String;\r\n" +
			"const #59 = Asciz	java/lang/Object;\r\n" +
			"const #60 = Asciz	java/io/Serializable;\r\n" +
			"const #61 = Asciz	java/lang/Exception;\r\n" +
			"const #62 = Asciz	java/lang/Throwable;\r\n" +
			"const #63 = Asciz	java/lang/Integer;\r\n" +
			"const #64 = Asciz	parseInt;\r\n" +
			"const #65 = Asciz	(Ljava/lang/String;)I;\r\n" +
			"const #66 = Asciz	java/lang/System;\r\n" +
			"const #67 = Asciz	out;\r\n" +
			"const #68 = Asciz	Ljava/io/PrintStream;;\r\n" +
			"const #69 = Asciz	java/io/PrintStream;\r\n" +
			"const #70 = Asciz	println;\r\n" +
			"const #71 = Asciz	getMessage;\r\n" +
			"const #72 = Asciz	()Ljava/lang/String;;\r\n" +
			"\r\n" +
			"{\r\n" +
			"public static int A_STATIC_FIELD;\r\n" +
			"\r\n" +
			"\r\n" +
			"public static final int A_FINAL_STATIC_FIELD;\r\n" +
			"  Constant value: int 0\r\n" +
			"\r\n" +
			"public int aPublicField;\r\n" +
			"\r\n" +
			"\r\n" +
			"protected int aProtectedField;\r\n" +
			"\r\n" +
			"\r\n" +
			"public static void aPublicVoidMethodThatThrows()   throws java.lang.Exception;\r\n" +
			"  Code:\r\n" +
			"   Stack=2, Locals=0, Args_size=0\r\n" +
			"   0:	iconst_0\r\n" +
			"   1:	putstatic	#1; //Field A_STATIC_FIELD:I\r\n" +
			"   4:	getstatic	#1; //Field A_STATIC_FIELD:I\r\n" +
			"   7:	iconst_1\r\n" +
			"   8:	iadd\r\n" +
			"   9:	putstatic	#1; //Field A_STATIC_FIELD:I\r\n" +
			"   12:	return\r\n" +
			" LineNumberTable: \r\n" +
			"   line 11: 0\r\n" +
			"   line 12: 4\r\n" +
			"   line 13: 12\r\n" +
			"\r\n" +
			"  Exceptions: \r\n" +
			"   throws java.lang.Exception\r\n" +
			"public static void main(java.lang.String[]);\r\n" +
			"  Code:\r\n" +
			"   Stack=2, Locals=2, Args_size=1\r\n" +
			"   0:	new	#2; //class CompilerTest\r\n" +
			"   3:	dup\r\n" +
			"   4:	invokespecial	#3; //Method \"<init>\":()V\r\n" +
			"   7:	astore_1\r\n" +
			"   8:	return\r\n" +
			"  LineNumberTable: \r\n" +
			"   line 16: 0\r\n" +
			"   line 17: 8\r\n" +
			"\r\n" +
			"\r\n" +
			"public CompilerTest();\r\n" +
			"  Code:\r\n" +
			"  Stack=1, Locals=1, Args_size=1\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#4; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	return\r\n" +
			"  LineNumberTable: \r\n" +
			"   line 19: 0\r\n" +
			"   line 21: 4\r\n" +
			"\r\n" +
			"\r\n" +
			"public CompilerTest(java.lang.String);\r\n" +
			"  Code:\r\n" +
			"   Stack=1, Locals=2, Args_size=2\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#4; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	return\r\n" +
			"  LineNumberTable: \r\n" +
			"   line 23: 0\r\n" +
			"   line 25: 4\r\n" +
			"\r\n" +
			"\r\n" +
			"public int addition(int, int);\r\n" +
			"  Code:\r\n" +
			"   Stack=2, Locals=3, Args_size=3\r\n" +
			"   0:	iload_1\r\n" +
			"   1:	iload_2\r\n" +
			"   2:	iadd\r\n" +
			"   3:	ireturn\r\n" +
			"  LineNumberTable: \r\n" +
			"   line 28: 0\r\n" +
			"\r\n" +
			"\r\n" +
			"public int methodWithBranch();\r\n" +
			"  Code:\r\n" +
			"   Stack=3, Locals=1, Args_size=1\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	getfield	#5; //Field aPublicField:I\r\n" +
			"   4:	ifle	20\r\n" +
			"   7:	aload_0\r\n" +
			"   8:	dup\r\n" +
			"   9:	getfield	#6; //Field aProtectedField:I\r\n" +
			"   12:	iconst_1\r\n" +
			"   13:	iadd\r\n" +
			"   14:	putfield	#6; //Field aProtectedField:I\r\n" +
			"   17:	goto	30\r\n" +
			"   20:	aload_0\r\n" +
			"   21:	dup\r\n" +
			"   22:	getfield	#6; //Field aProtectedField:I\r\n" +
			"   25:	iconst_1\r\n" +
			"   26:	iadd\r\n" +
			"   27:	putfield	#6; //Field aProtectedField:I\r\n" +
			"   30:	aload_0\r\n" +
			"   31:	getfield	#7; //Field aPrivateField:I\r\n" +
			"   34:	ireturn\r\n" +
			"  LineNumberTable: \r\n" +
			"   line 32: 0\r\n" +
			"   line 33: 7\r\n" +
			"   line 35: 20\r\n" +
			"   line 38: 30\r\n" +
			"\r\n" +
			"  StackMapTable: number_of_entries = 2\r\n" +
			"   frame_type = 20 /* same */\r\n" +
			"   frame_type = 9 /* same */\r\n" +
			"\r\n" +
			"\r\n" +
			"public void methodWithTryCatch(java.lang.String);\r\n" +
			"  Code:\r\n" +
			"   Stack=2, Locals=4, Args_size=2\r\n" +
			"   0:	aload_1\r\n" +
			"   1:	invokestatic	#8; //Method java/lang/Integer.parseInt:(Ljava/lang/String;)I\r\n" +
			"   4:	istore_2\r\n" +
			"   5:	getstatic	#9; //Field java/lang/System.out:Ljava/io/PrintStream;\r\n" +
			"   8:	ldc	#10; //String finally\r\n" +
			"   10:	invokevirtual	#11; //Method java/io/PrintStream.println:(Ljava/lang/String;)V\r\n" +
			"   13:	goto	44\r\n" +
			"   16:	astore_2\r\n" +
			"   17:	aload_2\r\n" +
			"   18:	invokevirtual	#13; //Method java/lang/NumberFormatException.getMessage:()Ljava/lang/String;\r\n" +
			"   21:	pop\r\n" +
			"   22:	getstatic	#9; //Field java/lang/System.out:Ljava/io/PrintStream;\r\n" +
			"   25:	ldc	#10; //String finally\r\n" +
			"   27:	invokevirtual	#11; //Method java/io/PrintStream.println:(Ljava/lang/String;)V\r\n" +
			"   30:	goto	44\r\n" +
			"   33:	astore_3\r\n" +
			"   34:	getstatic	#9; //Field java/lang/System.out:Ljava/io/PrintStream;\r\n" +
			"   37:	ldc	#10; //String finally\r\n" +
			"   39:	invokevirtual	#11; //Method java/io/PrintStream.println:(Ljava/lang/String;)V\r\n" +
			"   42:	aload_3\r\n" +
			"   43:	athrow\r\n" +
			"   44:	return\r\n" +
			"  Exception table:\r\n" +
			"   from   to  target type\r\n" +
			"     0     5    16   Class java/lang/NumberFormatException\r\n" +
			"\r\n" +
			"     0     5    33   any\r\n" +
			"    16    22    33   any\r\n" +
			"    33    34    33   any\r\n" +
			"  LineNumberTable: \r\n" +
			"   line 43: 0\r\n" +
			"   line 47: 5\r\n" +
			"   line 48: 13\r\n" +
			"   line 44: 16\r\n" +
			"   line 45: 17\r\n" +
			"   line 47: 22\r\n" +
			"   line 48: 30\r\n" +
			"   line 47: 33\r\n" +
			"   line 49: 44\r\n" +
			"\r\n" +
			"  StackMapTable: number_of_entries = 3\r\n" +
			"   frame_type = 80 /* same_locals_1_stack_item */\r\n" +
			"     stack = [ class java/lang/NumberFormatException ]\r\n" +
			"   frame_type = 80 /* same_locals_1_stack_item */\r\n" +
			"     stack = [ class java/lang/Throwable ]\r\n" +
			"   frame_type = 10 /* same */\r\n" +
			"\r\n" +
			"\r\n" +
			"}\r\n" +
			"";

		compiler.compile(source);

		var classes = jjvm.core.ClassLoader.getClassDefinitions();
		var classDef = null;

		for(var i = 0; i < classes.length; i++) {
			if(classes[i].getName() == "CompilerTest") {
				classDef = classes[i];
			}
		}

		expect(classDef).not.toBeNull();
		expect(classDef.getMethods().length).toEqual(3);
		expect(classDef.getFields().length).toEqual(3);

		var numClasses = classes.length;

		// test redefining classes
		compiler.compile(source);

		classes = jjvm.core.ClassLoader.getClassDefinitions();

		// redefined class, should have replaced the old one
		expect(classes.length).toEqual(numClasses);
	});
});
