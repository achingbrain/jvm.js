
describe("ByteCode test", function () {
	var classDef;
	var methodDef;
	var frame;

	beforeEach(function() {
		classDef = ClassLoader.loadClass("java.lang.Object");
		methodDef = new MethodDefinition("public", false, false, false, "void", "foo", [], []);
		frame = new Frame(classDef, methodDef);
	});

	it("should process aload", function () {
		var byteCode = new ByteCode("0: aload_0");
		var value = "foo";

		frame.getLocalVariables().getLocalVariables()[0] = value;

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value);
	});

	it("should process aload without index", function () {
		var byteCode = new ByteCode("32:	dload	4");
		var value = "foo";

		frame.getLocalVariables().getLocalVariables()[4] = value;

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value);
	});

	it("should process add", function () {
		var byteCode = new ByteCode("0: iadd");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 + var2);
	});

	it("should process store", function () {
		var byteCode = new ByteCode("0: istore_3");
		var value = 3;

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getLocalVariables().getLocalVariables()[3]).toEqual(value);
	});

	it("should process store without index", function () {
		var byteCode = new ByteCode("32:	astore	4");
		var value = "foo";

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getLocalVariables().getLocalVariables()[4]).toEqual(value);
	});

	it("should process aastore", function () {
		var byteCode = new ByteCode("0: aastore");
		var value = 3;
		var index = 7;
		var array = [];

		frame.getStack().push(array);
		frame.getStack().push(index);
		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(array[index]).toEqual(value);
	});

	it("should process bastore", function () {
		var byteCode = new ByteCode("0: bastore");
		var value = true;
		var index = 7;
		var array = [];

		frame.getStack().push(array);
		frame.getStack().push(index);
		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(array[index]).toEqual(value);
	});

	it("should process return", function () {
		var byteCode = new ByteCode("0: ireturn");
		var value = 3;

		frame.getStack().push(value);

		var output = byteCode.execute(frame);

		expect(output).toEqual(value);
	});

	it("should process new", function () {
		var byteCode = new ByteCode("6:	new	#4; //class java.lang.Object");

		byteCode.execute(frame);

		var objectRef = frame.getStack().pop();

		expect(objectRef).toBeDefined();
		expect(objectRef).not.toBeNull();
		expect(objectRef.getClass().getName()).toEqual("java.lang.Object");
	});

	it("should process invokespecial", function () {
		var byteCode = new ByteCode("11:	invokespecial	#5; //Method java/lang/Object.\"<init>\":()V");

		var classDef = ClassLoader.loadClass("java.lang.Object");
		var objectRef = new ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokespecial for local constructor", function () {
		var byteCode = new ByteCode("7:	invokespecial	#2; //Method \"<init>\":(Ljava/lang/Object;)V");

		var objectClassDef = ClassLoader.loadClass("java.lang.Object");
		var testClassDef = new ClassDefinition("public", false, false, "InvokeSpecialTest", objectClassDef, []);
		testClassDef.addConstructor(new ConstructorDefinition("public", "InvokeSpecialTest", [objectClassDef], [], function() {
			// a constructor
		}));
		ClassLoader.addClassDefinition(testClassDef);

		var testClassObjectRef = new ObjectReference(testClassDef);
		var constructorArgObjectRef = new ObjectReference(objectClassDef);

		var frame = new Frame(testClassDef, new MethodDefinition());
		frame.getStack().push(testClassObjectRef);
		frame.getStack().push(testClassObjectRef);
		frame.getStack().push(constructorArgObjectRef);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokevirtual", function () {
		var byteCode = new ByteCode("30:	invokevirtual	#8; //Method java/io/PrintStream.println:(J)V");
		var value = "Hello";

		var classDef = ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new ObjectReference(classDef);

		var frame = new Frame(classDef, new MethodDefinition());
		frame.getStack().push(objectRef);
		frame.getStack().push(value);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process local invokevirtual", function () {
		var byteCode = new ByteCode("30:	invokevirtual	#8; //Method println:(J)V");
		var value = "Hello";

		var classDef = ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new ObjectReference(classDef);

		var frame = new Frame(classDef, new MethodDefinition());
		frame.getStack().push(objectRef);
		frame.getStack().push(value);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokeinterface", function () {
		var byteCode = new ByteCode("21:	invokeinterface	#259,  2; //InterfaceMethod java/io/PrintStream.println:(Ljava/lang/String;)V;");
		var value = "Hello";

		var classDef = ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new ObjectReference(classDef);

		frame.getStack().push(objectRef);
		frame.getStack().push(value);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process const", function () {
		var byteCode = new ByteCode("4:	iconst_1");
		
		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1);
	});

	it("should process getstatic", function () {
		var byteCode = new ByteCode("25:	getstatic	#7; //Field java/lang/System.out:Ljava/io/PrintStream;");
		
		byteCode.execute(frame);

		var fieldDef = frame.getStack().pop();
		var classDef = ClassLoader.loadClass("java.io.PrintStream");

		expect(fieldDef.getClass()).toEqual(classDef);
	});

	it("should process local getstatic", function () {
		var byteCode = new ByteCode("25:	getstatic	#7; //Field foo:I;");

		var fieldValue = 5;
		var classDef = new ClassDefinition("public", false, false, "com.example.SimpleExample", "java.lang.Object", []);
		classDef.addField(new FieldDefinition("public", true, false, false, false, "int", "foo"));
		classDef.setStaticField("foo", fieldValue);
		ClassLoader.addClassDefinition(classDef);

		var frame = new Frame(classDef, new MethodDefinition());

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(fieldValue);
	});

	it("should process putstatic", function () {
		var byteCode = new ByteCode("8:	putstatic	#4; //Field SimpleExample$Blah.blah:I");

		var fieldValue = 5;
		var classDef = new ClassDefinition("public", false, false, "SimpleExample$Blah", "java.lang.Object", []);
		classDef.addField(new FieldDefinition("public", true, false, false, false, "int", "blah"));
		classDef.setStaticField("blah", fieldValue);
		ClassLoader.addClassDefinition(classDef);
		
		frame.getStack().push(fieldValue);

		byteCode.execute(frame);

		expect(classDef.getStaticField("blah")).toEqual(fieldValue);
	});

	it("should process local putstatic", function () {
		var byteCode = new ByteCode("2:	putstatic	#3; //Field foo:I");

		var fieldValue = 5;
		var classDef = new ClassDefinition("public", false, false, "com.example.SimpleExample", "java.lang.Object", []);
		classDef.addField(new FieldDefinition("public", true, false, false, false, "int", "foo"));
		classDef.setStaticField("foo", fieldValue);
		ClassLoader.addClassDefinition(classDef);

		var frame = new Frame(classDef, new MethodDefinition());

		byteCode.execute(frame);

		expect(classDef.getStaticField("foo")).toEqual(frame.getStack().pop());
	});

	it("should process i2b", function () {
		var byteCode = new ByteCode("3:	i2b");

		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(true);
	});

	it("should process bipush", function () {
		var byteCode = new ByteCode("3:	bipush	10");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(10);
	});

	it("should process sipush", function () {
		var byteCode = new ByteCode("3:	sipush	10000");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(10000);
	});

	it("should process ldc for int", function () {
		var byteCode = new ByteCode("0:	ldc	#2; //int 1000000");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1000000);
	});

	it("should process ldc for string", function () {
		var byteCode = new ByteCode("0:	ldc	#2; //String foo bar");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo bar");
	});

	it("should process ldc for float", function () {
		var byteCode = new ByteCode("6:	ldc	#3; //float 10.0f");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(10.0);
	});

	it("should process ldc2_w for long", function () {
		var byteCode = new ByteCode("8:	ldc2_w	#6; //long 10000l");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(10000);
	});

	it("should process ldc2_w for double", function () {
		var byteCode = new ByteCode("9:	ldc2_w	#4; //double 1203980.0d");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1203980.0);
	});

	it("should process aconst_null", function () {
		var byteCode = new ByteCode("26:	aconst_null");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeNull();
	});

	it("should process aconst_null", function () {
		var byteCode = new ByteCode("2:	i2l");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeUndefined();
	});

	it("should process imul", function () {
		var byteCode = new ByteCode("0: imul");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 * var2);
	});

	it("should process idiv", function () {
		var byteCode = new ByteCode("0: idiv");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 / var2);
	});

	it("should process isub", function () {
		var byteCode = new ByteCode("0: isub");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 - var2);
	});

	it("should process ineg", function () {
		var byteCode = new ByteCode("0: ineg");
		var value = 3;

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(-3);
	});

	it("should process irem", function () {
		var byteCode = new ByteCode("0: irem");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1);
	});

	it("should process xor", function () {
		var byteCode = new ByteCode("0: ixor");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 ^ var2);
	});

	it("should process swap", function () {
		var byteCode = new ByteCode("0: swap");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		// should have swapped the top two items on the stack
		expect(frame.getStack().pop()).toEqual(var1);
		expect(frame.getStack().pop()).toEqual(var2);
	});

	it("should process goto", function () {
		var location = 18;
		var byteCode = new ByteCode("0: goto " + location);

		try {
			byteCode.execute(frame);

			// the bytecode should throw an exception
			expect(true).toBeFalsy();
		} catch(e) {
			expect(e instanceof Goto).toBeTruthy();
			expect(e.getLocation()).toEqual(location);
		}
	});

	it("should process ret", function () {
		var variableLocation = 2;
		var location = 18;
		var byteCode = new ByteCode("0: ret " + variableLocation);
		
		frame.getLocalVariables().store(variableLocation, location);

		try {
			byteCode.execute(frame);

			// the bytecode should throw an exception
			expect(true).toBeFalsy();
		} catch(e) {
			expect(e instanceof Goto).toBeTruthy();
			expect(e.getLocation()).toEqual(location);
		}
	});

	it("should process jsr", function () {
		var location = 18;
		var byteCode = new ByteCode("0: jsr " + location);

		try {
			byteCode.execute(frame);

			// the bytecode should throw an exception
			expect(true).toBeFalsy();
		} catch(e) {
			expect(e instanceof Goto).toBeTruthy();
			expect(e.getLocation()).toEqual(location);
		}
	});

	it("should process nop", function () {
		var byteCode = new ByteCode("0: nop");

		expect(frame.getStack().getStack().length).toEqual(0);
		expect(frame.getLocalVariables().getLocalVariables().length).toEqual(0);

		byteCode.execute(frame);

		// should not have changed stack or variables
		expect(frame.getStack().getStack().length).toEqual(0);
		expect(frame.getLocalVariables().getLocalVariables().length).toEqual(0);
	});

	it("should process aaload", function () {
		var byteCode = new ByteCode("0: aaload");
		var arr = [3, 4, 5];
		var index = 2;

		frame.getStack().push(index);
		frame.getStack().push(arr);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(arr[index]);
	});

	it("should process anewarray", function () {
		var byteCode = new ByteCode("1:	anewarray	#4; //class java/lang/String");
		var length = 5;

		frame.getStack().push(length);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array).toBeDefined();
		expect(array instanceof Array).toBeTruthy();
		expect(array.length).toEqual(length);
	});

	it("should process newarray", function () {
		var byteCode = new ByteCode("1:	newarray	int");
		var length = 5;

		frame.getStack().push(length);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array).toBeDefined();
		expect(array instanceof Array).toBeTruthy();
		expect(array.length).toEqual(length);
	});

	it("should process arraylength", function () {
		var byteCode = new ByteCode("7:	arraylength");
		var array = [];
		var length = 18;
		array.length = length;

		frame.getStack().push(array);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(length);
	});

	it("should process checkcast", function () {
		var byteCode = new ByteCode("9:	checkcast	#2; //class java/lang/Object");
		var classDef = ClassLoader.loadClass("java.lang.Object");
		var objectRef = new ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame);

		// no exception thrown...
	});

	it("should process checkcast and throw", function () {
		var byteCode = new ByteCode("9:	checkcast	#2; //class java/lang/Integer");
		var classDef = ClassLoader.loadClass("java.lang.Object");
		var objectRef = new ObjectReference(classDef);

		frame.getStack().push(objectRef);

		expect(byteCode.execute, frame).toThrow();
	});

	it("should compare with dcmpg", function () {
		var byteCode = new ByteCode("9:	dcmpg");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});
	
	it("should compare with dcmpl", function () {
		var byteCode = new ByteCode("9:	dcmpl");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should compare with fcmpg", function () {
		var byteCode = new ByteCode("9:	fcmpg");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should compare with fcmpl", function () {
		var byteCode = new ByteCode("9:	fcmpl");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should compare with lcmp", function () {
		var byteCode = new ByteCode("9:	lcmp");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should process dup", function () {
		var byteCode = new ByteCode("9:	dup");

		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
	});

	it("should process dup2", function () {
		var byteCode = new ByteCode("9:	dup2");

		frame.getStack().push("baz");
		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("baz");
	});

	it("should process dup2_x1", function () {
		var byteCode = new ByteCode("9:	dup2_x1");

		frame.getStack().push("baz");
		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("baz");
		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
	});

	it("should process dup2_x2", function () {
		var byteCode = new ByteCode("9:	dup2_x2");

		frame.getStack().push("qux");
		frame.getStack().push("baz");
		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("baz");
		expect(frame.getStack().pop()).toEqual("qux");
		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
	});

	it("should process dup_x1", function () {
		var byteCode = new ByteCode("9:	dup_x1");

		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("foo");
	});

	it("should process dup_x2", function () {
		var byteCode = new ByteCode("9:	dup_x2");

		frame.getStack().push("baz");
		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("baz");
		expect(frame.getStack().pop()).toEqual("foo");
	});

	it("should process and", function () {
		var byteCode = new ByteCode("9:	iand");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1 & 2);
	});

	it("should process or", function () {
		var byteCode = new ByteCode("9:	ior");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1 | 2);
	});

	it("should process shift left", function () {
		var byteCode = new ByteCode("9:	ishl");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 << value2);
	});

	it("should process shift right", function () {
		var byteCode = new ByteCode("9:	ishr");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 >> value2);
	});

	it("should process long shift right", function () {
		var byteCode = new ByteCode("9:	lushr");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 >> value2);
	});

	it("should create multi-dimensional array", function () {
		var byteCode = new ByteCode("2:	multianewarray	#3,  4; //class \"[[I\"");
		var value1 = 4;
		var value2 = 2;
		var value3 = 3;
		var value4 = 6;

		frame.getStack().push(value1);
		frame.getStack().push(value2);
		frame.getStack().push(value3);
		frame.getStack().push(value4);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array.length).toEqual(value1);
		expect(array[0].length).toEqual(value2);
		expect(array[0][0].length).toEqual(value3);
		expect(array[0][0][0].length).toEqual(value4);
	});

	it("should process pop", function () {
		var byteCode = new ByteCode("2:	pop");
		
		frame.getStack().push("hello");
		
		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process pop2", function () {
		var byteCode = new ByteCode("2:	pop2");
		
		frame.getStack().push("hello");
		frame.getStack().push("hello");
		
		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process if_acmpeq with equal", function () {
		var byteCode = new ByteCode("31:	if_acmpeq	51");
		var value1 = "hello";
		var value2 = "hello";

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_acmpeq with not equal", function () {
		var byteCode = new ByteCode("31:	if_acmpeq	51");
		var value1 = "hello";
		var value2 = "goodbye";

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_icmpeq with equal", function () {
		var byteCode = new ByteCode("31:	if_icmpeq	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmpeq with not equal", function () {
		var byteCode = new ByteCode("31:	if_icmpeq	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_acmpne with not equal", function () {
		var byteCode = new ByteCode("31:	if_acmpne	51");
		var value1 = "hello";
		var value2 = "goodbye";
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_acmpne with equal", function () {
		var byteCode = new ByteCode("31:	if_acmpne	51");
		var value1 = "hello";
		var value2 = "hello";
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_icmpne with not equal", function () {
		var byteCode = new ByteCode("31:	if_icmpne	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmpne with equal", function () {
		var byteCode = new ByteCode("31:	if_icmpne	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_icmplt with less than", function () {
		var byteCode = new ByteCode("31:	if_icmplt	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmplt with greater than", function () {
		var byteCode = new ByteCode("31:	if_icmplt	51");
		var value1 = 10;
		var value2 = 5;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_icmpge with equal", function () {
		var byteCode = new ByteCode("31:	if_icmpge	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmpge with greater than", function () {
		var byteCode = new ByteCode("31:	if_icmpge	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmpge with less than", function () {
		var byteCode = new ByteCode("31:	if_icmpge	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_icmpgt with greater than", function () {
		var byteCode = new ByteCode("31:	if_icmpgt	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmpgt with less than", function () {
		var byteCode = new ByteCode("31:	if_icmpgt	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_icmple with less than", function () {
		var byteCode = new ByteCode("31:	if_icmple	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmple with equal", function () {
		var byteCode = new ByteCode("31:	if_icmple	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_icmple with greater than", function () {
		var byteCode = new ByteCode("31:	if_icmple	51");
		var value1 = 10;
		var value2 = 5;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifeq with equal", function () {
		var byteCode = new ByteCode("31:	ifeq	51");
		var value1 = 5;
		var value2 = 5;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifeq with not equal", function () {
		var byteCode = new ByteCode("31:	ifeq	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifne with not equal", function () {
		var byteCode = new ByteCode("31:	ifne	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifne with equal", function () {
		var byteCode = new ByteCode("31:	ifne	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process iflt with less than", function () {
		var byteCode = new ByteCode("31:	iflt	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process iflt with greater than", function () {
		var byteCode = new ByteCode("31:	iflt	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifge with greater than", function () {
		var byteCode = new ByteCode("31:	ifge	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifge with equal", function () {
		var byteCode = new ByteCode("31:	ifge	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifge with less than", function () {
		var byteCode = new ByteCode("31:	ifge	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifgt with greater than", function () {
		var byteCode = new ByteCode("31:	ifgt	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifgt with less than", function () {
		var byteCode = new ByteCode("31:	ifgt	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifle with less than", function () {
		var byteCode = new ByteCode("31:	ifle	51");
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifle with equal", function () {
		var byteCode = new ByteCode("31:	ifle	51");
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifle with greater than", function () {
		var byteCode = new ByteCode("31:	ifle	51");
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifnonnull with non null", function () {
		var byteCode = new ByteCode("31:	ifnonnull	51");
		
		frame.getStack().push("foo");

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifnonnull with null", function () {
		var byteCode = new ByteCode("31:	ifnonnull	51");
		
		frame.getStack().push(null);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifnull with null", function () {
		var byteCode = new ByteCode("31:	ifnull	51");
		
		frame.getStack().push(null);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifnull with non null", function () {
		var byteCode = new ByteCode("31:	ifnull	51");
		
		frame.getStack().push("foo");

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process iinc", function () {
		var byteCode = new ByteCode("94:	iinc	3, 1");

		frame.getLocalVariables().store(3, 5);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(6);
	});

	it("should process instanceof with instance of", function () {
		var byteCode = new ByteCode("8:	instanceof	#40; //class java/io/PrintStream");
		var classDef = ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should process instanceof with not instance of", function () {
		var byteCode = new ByteCode("8:	instanceof	#40; //class java/lang/Integer");
		var classDef = ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeFalsy();
	});

	it("should process throw", function () {
		var byteCode = new ByteCode("8:	athrow");

		frame.getStack().push("panic!");

		expect(byteCode.execute, frame).toThrow();
	});

	it("should process invokestatic", function () {
		var source = 
			"Compiled from \"Other.java\"\r\n" + 
			"public class Other extends java.lang.Object{\r\n" +
			"public Other();\r\n" +
			"  Code:\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	return\r\n" +
			"\r\n" +
			"public static int staticMethod(int, int);\r\n" +
			"  Code:\r\n" +
			"   0:	iload_0\r\n" +
			"   1:	iload_1\r\n" +
			"   2:	iadd\r\n" +
			"   3:	ireturn\r\n" +
			"\r\n" +
			"}\r\n";

		var classDef = ClassLoader.loadClass("java.lang.Object");

		var compiler = new Compiler();
		compiler.compile(source);

		var methodDef = new MethodDefinition("public", false, false, false, "int", "foo", [], [
			new ByteCode("0:	iconst_5"),
			new ByteCode("1:	bipush	10"),
			new ByteCode("3:	invokestatic	#2; //Method Other.staticMethod:(II)I"),
			new ByteCode("6:	istore_1"),
			new ByteCode("7:	iload_1"),			
			new ByteCode("8:	ireturn")
		]);

		var frame = new Frame(classDef, methodDef, []);
		var thread = new Thread(frame);
		thread.run();

		var output = frame.getOutput();

		expect(output).toEqual(15);
	});

	it("should process getfield local", function () {
		var source = "Compiled from \"SimpleExample.java\"\r\n" +
			"public class SimpleExample extends java.lang.Object{\r\n" +
			"\r\n" +
			"}\r\n";

		var compiler = new Compiler();
		compiler.compile(source);

		var expectedValue = 10;
		var classDef = ClassLoader.loadClass("SimpleExample");
		var objectRef = new ObjectReference(classDef);
		objectRef.setField("foo", expectedValue);

		var methodDef = new MethodDefinition("public", false, false, false, "void", "foo", [], [
			new ByteCode("0:	aload_0"),
			new ByteCode("1:	dup"),
			new ByteCode("2:	getfield	#2; //Field foo:I")
		]);

		var frame = new Frame(classDef, methodDef, [objectRef]);
		var thread = new Thread(frame);
		thread.run();

		var value = frame.getStack().pop();

		expect(value).toEqual(expectedValue);
	});

	it("should process putfield local", function () {
		var source = "Compiled from \"SimpleExample.java\"\r\n" +
			"public class SimpleExample extends java.lang.Object{\r\n" +
			"\r\n" +
			"}\r\n";

		var compiler = new Compiler();
		compiler.compile(source);

		var expectedValue = 5;
		var classDef = ClassLoader.loadClass("SimpleExample");
		var objectRef = new ObjectReference(classDef);
		objectRef.setField("foo", expectedValue);

		var methodDef = new MethodDefinition("public", false, false, false, "void", "foo", [], [
			new ByteCode("0:	aload_0"),
			new ByteCode("0:	iconst_5"),
			new ByteCode("2:	putfield	#2; //Field foo:I")
		]);

		var frame = new Frame(classDef, methodDef, [objectRef]);
		var thread = new Thread(frame);
		thread.run();

		var value = objectRef.getField("foo");

		expect(value).toEqual(expectedValue);
	});

	it("should process getfield", function () {
		var source = "Compiled from \"Other.java\"\r\n" +
			"public class Other extends java.lang.Object{\r\n" +
			"public int foo;\r\n" +
			"\r\n" +
			"public Other();\r\n" +
			"  Code:\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	aload_0\r\n" +
			"   5:	iconst_1\r\n" +
			"   6:	putfield	#2; //Field foo:I\r\n" +
			"   9:	return\r\n" +
			"\r\n" +
			"}\r\n" +
			"\r\n" +
			"Compiled from \"SimpleExample.java\"\r\n" +
			"public class SimpleExample extends java.lang.Object{\r\n" +
			"public SimpleExample();\r\n" +
			"  Code:\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	return\r\n" +
			"\r\n" +
			"}";

		var compiler = new Compiler();
		compiler.compile(source);

		var expectedValue = 1;
		var classDef = ClassLoader.loadClass("SimpleExample");
		var objectRef = new ObjectReference(classDef);

		var methodDef = new MethodDefinition("public", false, false, false, "void", "foo", [], [
			new ByteCode("0:	new	#2; //class Other"),
			new ByteCode("3:	dup"),
			new ByteCode("4:	invokespecial	#3; //Method Other.\"<init>\":()V"),
			new ByteCode("7:	astore_1"),
			new ByteCode("8:	aload_1"),
			new ByteCode("9:	dup"),
			new ByteCode("10:	getfield	#4; //Field Other.foo:I")
		]);

		var frame = new Frame(classDef, methodDef, [objectRef]);
		var thread = new Thread(frame);
		thread.run();

		var value = frame.getStack().pop();

		expect(value).toEqual(expectedValue);
	});

	it("should process putfield", function () {
		var source = "Compiled from \"Other.java\"\r\n" +
			"public class Other extends java.lang.Object{\r\n" +
			"public int foo;\r\n" +
			"\r\n" +
			"public Other();\r\n" +
			"  Code:\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	aload_0\r\n" +
			"   5:	iconst_1\r\n" +
			"   6:	putfield	#2; //Field foo:I\r\n" +
			"   9:	return\r\n" +
			"\r\n" +
			"}\r\n" +
			"\r\n" +
			"Compiled from \"SimpleExample.java\"\r\n" +
			"public class SimpleExample extends java.lang.Object{\r\n" +
			"public SimpleExample();\r\n" +
			"  Code:\r\n" +
			"   0:	aload_0\r\n" +
			"   1:	invokespecial	#1; //Method java/lang/Object.\"<init>\":()V\r\n" +
			"   4:	return\r\n" +
			"\r\n" +
			"}";

		var compiler = new Compiler();
		compiler.compile(source);

		var expectedValue = 10;
		var classDef = ClassLoader.loadClass("SimpleExample");
		var objectRef = new ObjectReference(classDef);
		objectRef.setField("foo", 9);

		var methodDef = new MethodDefinition("public", false, false, false, "void", "foo", [], [
			new ByteCode("8:	aload_0"),
			new ByteCode("9:	dup"),
			new ByteCode("10:	getfield	#4; //Field Other.foo:I"),
			new ByteCode("13:	iconst_1"),
			new ByteCode("14:	iadd"),
			new ByteCode("15:	putfield	#4; //Field Other.foo:I")
		]);

		var frame = new Frame(classDef, methodDef, [objectRef]);
		var thread = new Thread(frame);
		thread.run();

		var value = objectRef.getField("foo");

		expect(value).toEqual(expectedValue);
	});

	it("should process monitorenter", function () {
		var byteCode = new ByteCode("9:	monitorenter");
		var lockObject = {};
		frame.getStack().push(lockObject);

		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process monitorexit", function () {
		var byteCode = new ByteCode("9:	monitorexit");
		var lockObject = {};
		frame.getStack().push(lockObject);

		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});
});
