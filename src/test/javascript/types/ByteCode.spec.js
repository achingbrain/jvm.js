
describe("ByteCode test", function () {
	var classDef;
	var methodDef;
	var frame;
	var byteCode;

	beforeEach(function() {
		classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		methodDef = new jjvm.types.MethodDefinition("public", false, false, false, "void", "foo", [], []);
		frame = new jjvm.runtime.Frame(classDef, methodDef);
		byteCode = new jjvm.types.ByteCode();
	});

	it("should process nop", function () {
		byteCode.setMnemonic("nop");
		byteCode.setOperation("nop");

		expect(frame.getStack().getStack().length).toEqual(0);
		expect(frame.getLocalVariables().getLocalVariables().length).toEqual(0);

		byteCode.execute(frame);

		// should not have changed stack or variables
		expect(frame.getStack().getStack().length).toEqual(0);
		expect(frame.getLocalVariables().getLocalVariables().length).toEqual(0);
	});

	it("should process push", function () {
		byteCode.setMnemonic("bipush");
		byteCode.setOperation("push");
		byteCode.setArgs([10]);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(10);
	});

	it("should process load", function () {
		byteCode.setMnemonic("aload_0");
		byteCode.setOperation("load");
		byteCode.setArgs([0]);
		var value = "foo";

		frame.getLocalVariables().getLocalVariables()[0] = value;

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value);
	});

	it("should process array_load", function () {
		byteCode.setMnemonic("aaload");
		byteCode.setOperation("array_load");
		var arr = [3, 4, 5];
		var index = 2;

		frame.getStack().push(arr);
		frame.getStack().push(index);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(arr[index]);
	});

	it("should process arraylength", function () {
		byteCode.setMnemonic("arraylength");
		byteCode.setOperation("array_length");
		var array = [];
		var length = 18;
		array.length = length;

		frame.getStack().push(array);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(length);
	});
/*
	it("should process array_store", function () {
		var byteCode = new jjvm.types.ByteCode("aastore", "array_store");
		var value = 3;
		var index = 7;
		var array = [];

		frame.getStack().push(array);
		frame.getStack().push(index);
		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(array[index]).toEqual(value);
	});

	it("should process array_create with object", function () {
		var byteCode = new jjvm.types.ByteCode("anewarray", "array_create", [4], 0);
		var length = 5;

		frame.getStack().push(length);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array).toBeDefined();
		expect(array instanceof Array).toBeTruthy();
		expect(array.length).toEqual(length);
	});

	it("should process array_create with primitive", function () {
		var byteCode = new jjvm.types.ByteCode("newarray", "array_create", [4], 0);
		var length = 5;

		frame.getStack().push(length);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array).toBeDefined();
		expect(array instanceof Array).toBeTruthy();
		expect(array.length).toEqual(length);
	});

	it("should process store", function () {
		var byteCode = new jjvm.types.ByteCode("istore_3", "store", [3]);
		var value = 3;

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getLocalVariables().getLocalVariables()[3]).toEqual(value);
	});

	it("should process pop", function () {
		var byteCode = new jjvm.types.ByteCode("pop", "pop");
		
		frame.getStack().push("hello");
		
		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process pop2", function () {
		var byteCode = new jjvm.types.ByteCode("pop2", "pop2");
		
		frame.getStack().push("hello");
		frame.getStack().push("hello");
		
		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process dup", function () {
		var byteCode = new jjvm.types.ByteCode("dup", "dup");

		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
	});

	it("should process dup2", function () {
		var byteCode = new jjvm.types.ByteCode("dup2", "dup2");

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
		var byteCode = new jjvm.types.ByteCode("dup2_x1", "dup2_x1");

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
		var byteCode = new jjvm.types.ByteCode("dup2_x2", "dup2_x2");

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
		var byteCode = new jjvm.types.ByteCode("dup_x1", "dup_x1");

		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("foo");
	});

	it("should process dup_x2", function () {
		var byteCode = new jjvm.types.ByteCode("dup_x2", "dup_x2");

		frame.getStack().push("baz");
		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("baz");
		expect(frame.getStack().pop()).toEqual("foo");
	});

	it("should process swap", function () {
		var byteCode = new jjvm.types.ByteCode("swap", "swap");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		// should have swapped the top two items on the stack
		expect(frame.getStack().pop()).toEqual(var1);
		expect(frame.getStack().pop()).toEqual(var2);
	});

	it("should process add", function () {
		var byteCode = new jjvm.types.ByteCode("iadd", "add");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 + var2);
	});

	it("should process sub", function () {
		var byteCode = new jjvm.types.ByteCode("isub", "sub");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 - var2);
	});

	it("should process mul", function () {
		var byteCode = new jjvm.types.ByteCode("imul", "mul");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 * var2);
	});

	it("should process div", function () {
		var byteCode = new jjvm.types.ByteCode("idiv", "div");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 / var2);
	});

	it("should process rem", function () {
		var byteCode = new jjvm.types.ByteCode("irem", "rem");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1);
	});

	it("should process neg", function () {
		var byteCode = new jjvm.types.ByteCode("neg", "neg");
		var value = 3;

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(-3);
	});

	it("should process shift left", function () {
		var byteCode = new jjvm.types.ByteCode("ishl", "shift_left");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 << value2);
	});

	it("should process arithmetic shift right", function () {
		var byteCode = new jjvm.types.ByteCode("ishl", "arithmetic_shift_right");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 >> value2);
	});

	it("should process logical shift right", function () {
		var byteCode = new jjvm.types.ByteCode("ishl", "logical_shift_right");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 >>> value2);
	});

	it("should process and", function () {
		var byteCode = new jjvm.types.ByteCode("iand", "and");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1 & 2);
	});

	it("should process or", function () {
		var byteCode = new jjvm.types.ByteCode("ior", "or");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1 | 2);
	});

	it("should process xor", function () {
		var byteCode = new jjvm.types.ByteCode("ixor", "xor");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 ^ var2);
	});

	it("should process iinc", function () {
		var byteCode = new jjvm.types.ByteCode("iinc", "increment", [3, 1]);

		frame.getLocalVariables().store(3, 5);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(6);
	});

	it("should compare", function () {
		var byteCode = new jjvm.types.ByteCode("dcmpg", "compare");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should compare unequals", function () {
		var byteCode = new jjvm.types.ByteCode("dcmpg", "compare");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeFalsy();
	});

	it("should process if_equal with equal", function () {
		var byteCode = new jjvm.types.ByteCode("ifeq", "if_equal", [51]);
		var value1 = 5;
		var value2 = 5;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_equal with not equal", function () {
		var byteCode = new jjvm.types.ByteCode("ifeq", "if_equal", [51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_not_equal with not equal", function () {
		var byteCode = new jjvm.types.ByteCode("ifne", "if_not_equal", [51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_not_equal with equal", function () {
		var byteCode = new jjvm.types.ByteCode("ifne", "if_not_equal", [51]);
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_less_than with less than", function () {
		var byteCode = new jjvm.types.ByteCode("iflt", "if_less_than", [51]);
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_less_than with greater than", function () {
		var byteCode = new jjvm.types.ByteCode("iflt", "if_less_than", [51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_greater_than_or_equal with greater than", function () {
		var byteCode = new jjvm.types.ByteCode("ifge", "if_greater_than_or_equal", [51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_greater_than_or_equal with equal", function () {
		var byteCode = new jjvm.types.ByteCode("ifge", "if_greater_than_or_equal", [51]);
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_greater_than_or_equal with less than", function () {
		var byteCode = new jjvm.types.ByteCode("ifge", "if_greater_than_or_equal", [51]);
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_greater_than with greater than", function () {
		var byteCode = new jjvm.types.ByteCode("ifgt", "if_greater_than", [51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_greater_than with less than", function () {
		var byteCode = new jjvm.types.ByteCode("ifgt", "if_greater_than", [51]);
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_less_than_or_equal with less than", function () {
		var byteCode = new jjvm.types.ByteCode("ifle", "if_less_than_or_equal", [51]);
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_less_than_or_equal with equal", function () {
		var byteCode = new jjvm.types.ByteCode("ifle", "if_less_than_or_equal", [51]);
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process if_less_than_or_equal with greater than", function () {
		var byteCode = new jjvm.types.ByteCode("ifle", "if_less_than_or_equal", [51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process goto", function () {
		var location = 18;
		var byteCode = new jjvm.types.ByteCode("goto", "goto", [location]);

		try {
			byteCode.execute(frame);

			// the bytecode should throw an exception
			expect(true).toBeFalsy();
		} catch(e) {
			expect(e instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(e.getLocation()).toEqual(location);
		}
	});

	it("should process jsr", function () {
		var location = 18;
		var byteCode = new jjvm.types.ByteCode("jsr", "jsr", [location]);

		try {
			byteCode.execute(frame);

			// the bytecode should throw an exception
			expect(true).toBeFalsy();
		} catch(e) {
			expect(e instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(e.getLocation()).toEqual(location);
		}
	});

	it("should process ret", function () {
		var variableLocation = 2;
		var location = 18;
		var byteCode = new jjvm.types.ByteCode("ret", "ret", [variableLocation]);
		
		frame.getLocalVariables().store(variableLocation, location);

		try {
			byteCode.execute(frame);

			// the bytecode should throw an exception
			expect(true).toBeFalsy();
		} catch(e) {
			expect(e instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(e.getLocation()).toEqual(location);
		}
	});

	it("should process return", function () {
		var byteCode = new jjvm.types.ByteCode("ireturn", "return");
		var value = 3;

		frame.getStack().push(value);

		var output = byteCode.execute(frame);

		expect(output).toEqual(value);
	});

	it("should process get_static", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/io/PrintStream", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolValue("Asciz", "out", constantPool));
		constantPool.store(3, new jjvm.types.ConstantPoolNameAndTypeValue(2, 1, constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/System", constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(5, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolFieldValue(6, 3, constantPool));

		var byteCode = new jjvm.types.ByteCode("getstatic", "get_static", [7], 0, constantPool);
		
		byteCode.execute(frame, constantPool);

		var fieldDef = frame.getStack().pop();
		var classDef = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");

		expect(fieldDef.getClass()).toEqual(classDef);
	});

	it("should process put_static", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolValue("Asciz", "SimpleExample$Blah", constantPool));
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "blah", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolValue("Asciz", "I", constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue(3, 4, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolClassValue(2, constantPool));
		constantPool.store(8, new jjvm.types.ConstantPoolFieldValue(7, 5, constantPool));

		var initialFieldValue = 7;
		var expectedFieldValue = 5;

		var classDef = new jjvm.types.ClassDefinition(
			constantPool.load(2),
			constantPool.load(1)
		);
		classDef.setConstantPool(constantPool);

		var fieldDef = new jjvm.types.FieldDefinition("blah", "int", classDef);
		fieldDef.setIsStatic(true);

		classDef.addField(fieldDef);
		classDef.setStaticField("blah", initialFieldValue);

		jjvm.core.ClassLoader.addClassDefinition(classDef);

		frame.getStack().push(expectedFieldValue);

		var byteCode = new jjvm.types.ByteCode("putstatic", "put_static", [8], 0, constantPool);
		byteCode.execute(frame, constantPool);

		expect(classDef.getStaticField("blah")).toEqual(expectedFieldValue);
	});

	it("should process getfield", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolValue("Asciz", "SimpleExample$Blah", constantPool));
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "blah", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolValue("Asciz", "I", constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue(3, 4, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolClassValue(2, constantPool));
		constantPool.store(8, new jjvm.types.ConstantPoolFieldValue(7, 5, constantPool));

		var expectedFieldValue = 5;

		var classDef = new jjvm.types.ClassDefinition(
			constantPool.load(2),
			constantPool.load(1)
		);
		classDef.setConstantPool(constantPool);
		classDef.addField(new jjvm.types.FieldDefinition("blah", "int", classDef));

		jjvm.core.ClassLoader.addClassDefinition(classDef);

		var objectRef = new jjvm.runtime.ObjectReference(classDef);
		objectRef.setField("blah", expectedFieldValue);

		frame.getStack().push(objectRef);

		var byteCode = new jjvm.types.ByteCode("getfield", "get_field", [8], 0, constantPool);
		byteCode.execute(frame, constantPool);

		expect(frame.getStack().pop()).toEqual(expectedFieldValue);
	});

	it("should process putfield", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolValue("Asciz", "SimpleExample$Blah", constantPool));
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "blah", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolValue("Asciz", "I", constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue(3, 4, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolClassValue(2, constantPool));
		constantPool.store(8, new jjvm.types.ConstantPoolFieldValue(7, 5, constantPool));

		var initialFieldValue = 7;
		var expectedFieldValue = 5;

		var classDef = new jjvm.types.ClassDefinition(
			constantPool.load(2),
			constantPool.load(1)
		);
		classDef.setConstantPool(constantPool);
		classDef.addField(new jjvm.types.FieldDefinition("blah", "int", classDef));

		jjvm.core.ClassLoader.addClassDefinition(classDef);

		var objectRef = new jjvm.runtime.ObjectReference(classDef);
		objectRef.setField("blah", initialFieldValue);

		frame.getStack().push(objectRef);
		frame.getStack().push(expectedFieldValue);

		var byteCode = new jjvm.types.ByteCode("putfield", "put_field", [8], 0, constantPool);
		byteCode.execute(frame, constantPool);

		expect(objectRef.getField("blah")).toEqual(expectedFieldValue);
	});

	it("should process new", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue(1, constantPool));

		var byteCode = new jjvm.types.ByteCode("new", "new", [2], 0, constantPool);

		byteCode.execute(frame, constantPool);

		var objectRef = frame.getStack().pop();

		expect(objectRef).toBeDefined();
		expect(objectRef).not.toBeNull();
		expect(objectRef.getClass().getName()).toEqual("java.lang.Object");
	});

	it("should process checkcast", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue(1, constantPool));

		var byteCode = new jjvm.types.ByteCode("checkcast", "check_cast", [2], 0);
		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame, constantPool);

		// no exception thrown...
	});

	it("should process checkcast and throw", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Integer", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue(1, constantPool));

		var byteCode = new jjvm.types.ByteCode("checkcast", "check_cast", [2], 0);
		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		expect(byteCode.execute, frame, constantPool).toThrow();
	});

	it("should process throw", function () {
		var byteCode = new jjvm.types.ByteCode("athrow", "throw");

		frame.getStack().push("panic!");

		expect(byteCode.execute, frame).toThrow();
	});

	it("should process instanceof with instance of", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/io/PrintStream", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue(1, constantPool));

		var byteCode = new jjvm.types.ByteCode("instanceof", "instance_of", [2], 0, constantPool);
		var classDef = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame, constantPool);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should process instanceof with not instance of", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/System", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue(1, constantPool));

		var byteCode = new jjvm.types.ByteCode("instanceof", "instance_of", [2], 0, constantPool);
		var classDef = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame, constantPool);

		expect(frame.getStack().pop()).toBeFalsy();
	});

	it("should create multi-dimensional array", function () {
		var byteCode = new jjvm.types.ByteCode("multianewarray", "multi_dimensional_array_create", [3, 4], 0);
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

	it("should process monitorenter", function () {
		var byteCode = new jjvm.types.ByteCode("monitorenter", "monitor_enter");
		var lockObject = {};
		frame.getStack().push(lockObject);

		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process monitorexit", function () {
		var byteCode = new jjvm.types.ByteCode("monitorexit", "monitor_exit");
		var lockObject = {};
		frame.getStack().push(lockObject);

		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process ifnonnull with non null", function () {
		var byteCode = new jjvm.types.ByteCode("ifnonnull", "if_non_null", [51]);
		
		frame.getStack().push("foo");

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifnonnull with null", function () {
		var byteCode = new jjvm.types.ByteCode("ifnonnull", "if_non_null", [51]);
		
		frame.getStack().push(null);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifnull with null", function () {
		var byteCode = new jjvm.types.ByteCode("ifnull", "if_null", [51]);

		frame.getStack().push(null);

		try {
			byteCode.execute(frame);

			// should have thrown an exception
			expect(false).toEqual(true);
		} catch(error) {
			expect(error instanceof jjvm.runtime.Goto).toBeTruthy();
			expect(error.getLocation()).toEqual(51);
		}
	});

	it("should process ifnull with non null", function () {
		var byteCode = new jjvm.types.ByteCode("ifnull", "if_null", [51]);

		frame.getStack().push("foo");

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process invokespecial", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool));
		constantPool.store(2, new jjvm.types.ConstantPoolValue("Asciz", "<init>", constantPool));
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "()V", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue(2, 3, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolMethodValue(4, 5, constantPool));
		
		var byteCode = new jjvm.types.ByteCode("invokespecial", "invoke_special", [6], 0, constantPool);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokestatic", function () {
		var constantPool = new jjvm.types.ConstantPool();

		var objectClassName = new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool);
		var testClassName = new jjvm.types.ConstantPoolValue("Asciz", "org/jjvm/InvokeStaticTest", constantPool);

		var testClass = new jjvm.types.ClassDefinition(
			testClassName, 
			objectClassName
		);

		var testClassStaticMethod = new jjvm.types.MethodDefinition("staticTestMethod", [], null, testClass);
		testClassStaticMethod.setImplementation(function() {
			
		});
		testClassStaticMethod.setIsStatic(true);
		testClass.addMethod(testClassStaticMethod);
		jjvm.core.ClassLoader.addClassDefinition(testClass);

		constantPool.store(1, objectClassName);
		constantPool.store(2, testClassName);
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "staticTestMethod", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolValue("Asciz", "()V", constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(2, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolNameAndTypeValue(3, 4, constantPool));
		constantPool.store(8, new jjvm.types.ConstantPoolMethodValue(6, 7, constantPool));
		
		var byteCode = new jjvm.types.ByteCode("invokestatic", "invoke_static", [8], 0, constantPool);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokevirtual", function () {
		var constantPool = new jjvm.types.ConstantPool();

		var objectClassName = new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool);
		var testClassName = new jjvm.types.ConstantPoolValue("Asciz", "org/jjvm/InvokeStaticTest", constantPool);

		var testClass = new jjvm.types.ClassDefinition(
			testClassName, 
			objectClassName
		);

		var testClassStaticMethod = new jjvm.types.MethodDefinition("testMethod", [], null, testClass);
		testClassStaticMethod.setImplementation(function() {
			
		});
		testClass.addMethod(testClassStaticMethod);
		jjvm.core.ClassLoader.addClassDefinition(testClass);

		constantPool.store(1, objectClassName);
		constantPool.store(2, testClassName);
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "testMethod", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolValue("Asciz", "()V", constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(2, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolNameAndTypeValue(3, 4, constantPool));
		constantPool.store(8, new jjvm.types.ConstantPoolMethodValue(6, 7, constantPool));
		
		var byteCode = new jjvm.types.ByteCode("invokevirtual", "invoke_virtual", [8], 0, constantPool);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokeinterface", function () {
		var constantPool = new jjvm.types.ConstantPool();

		var objectClassName = new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object", constantPool);
		var testClassName = new jjvm.types.ConstantPoolValue("Asciz", "org/jjvm/InvokeStaticTest", constantPool);

		var testClass = new jjvm.types.ClassDefinition(
			testClassName, 
			objectClassName
		);

		var testClassStaticMethod = new jjvm.types.MethodDefinition("testMethod", [], null, testClass);
		testClassStaticMethod.setImplementation(function() {
			
		});
		testClass.addMethod(testClassStaticMethod);
		jjvm.core.ClassLoader.addClassDefinition(testClass);

		constantPool.store(1, objectClassName);
		constantPool.store(2, testClassName);
		constantPool.store(3, new jjvm.types.ConstantPoolValue("Asciz", "testMethod", constantPool));
		constantPool.store(4, new jjvm.types.ConstantPoolValue("Asciz", "()V", constantPool));
		constantPool.store(5, new jjvm.types.ConstantPoolClassValue(1, constantPool));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue(2, constantPool));
		constantPool.store(7, new jjvm.types.ConstantPoolNameAndTypeValue(3, 4, constantPool));
		constantPool.store(8, new jjvm.types.ConstantPoolMethodValue(6, 7, constantPool));
		
		var byteCode = new jjvm.types.ByteCode("invokeinterface", "invoke_interface", [8], 0, constantPool);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, 'executeChild');

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});*/
});
