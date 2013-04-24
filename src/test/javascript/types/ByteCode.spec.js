
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

	it("should process array_store", function () {
		byteCode.setMnemonic("aastore");
		byteCode.setOperation("array_store");
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
		byteCode.setMnemonic("anewarray");
		byteCode.setOperation("array_create");
		byteCode.setArgs([4]);
		var length = 5;

		frame.getStack().push(length);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array).toBeDefined();
		expect(array instanceof Array).toBeTruthy();
		expect(array.length).toEqual(length);
	});

	it("should process array_create with primitive", function () {
		byteCode.setMnemonic("anewarray");
		byteCode.setOperation("array_create");
		byteCode.setArgs([4]);
		var length = 5;

		frame.getStack().push(length);

		byteCode.execute(frame);

		var array = frame.getStack().pop();

		expect(array).toBeDefined();
		expect(array instanceof Array).toBeTruthy();
		expect(array.length).toEqual(length);
	});

	it("should process store", function () {
		byteCode.setMnemonic("istore_3");
		byteCode.setOperation("store");
		byteCode.setArgs([3]);
		var value = 3;

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getLocalVariables().getLocalVariables()[3]).toEqual(value);
	});

	it("should process pop", function () {
		byteCode.setMnemonic("pop");
		byteCode.setOperation("pop");
		
		frame.getStack().push("hello");
		
		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process pop2", function () {
		byteCode.setMnemonic("pop2");
		byteCode.setOperation("pop2");
		
		frame.getStack().push("hello");
		frame.getStack().push("hello");
		
		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process dup", function () {
		byteCode.setMnemonic("dup");
		byteCode.setOperation("dup");

		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
	});

	it("should process dup2", function () {
		byteCode.setMnemonic("dup2");
		byteCode.setOperation("dup2");

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
		byteCode.setMnemonic("dup2_x1");
		byteCode.setOperation("dup2_x1");

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
		byteCode.setMnemonic("dup2_x2");
		byteCode.setOperation("dup2_x2");

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
		byteCode.setMnemonic("dup_x1");
		byteCode.setOperation("dup_x1");

		frame.getStack().push("bar");
		frame.getStack().push("foo");

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual("foo");
		expect(frame.getStack().pop()).toEqual("bar");
		expect(frame.getStack().pop()).toEqual("foo");
	});

	it("should process dup_x2", function () {
		byteCode.setMnemonic("dup_x2");
		byteCode.setOperation("dup_x2");

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
		byteCode.setMnemonic("swap");
		byteCode.setOperation("swap");
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
		byteCode.setMnemonic("iadd");
		byteCode.setOperation("add");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 + var2);
	});

	it("should process sub", function () {
		byteCode.setMnemonic("isub");
		byteCode.setOperation("sub");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 - var2);
	});

	it("should process mul", function () {
		byteCode.setMnemonic("imul");
		byteCode.setOperation("mul");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 * var2);
	});

	it("should process div", function () {
		byteCode.setMnemonic("idiv");
		byteCode.setOperation("div");
		var var1 = 3;
		var var2 = 7;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 / var2);
	});

	it("should process rem", function () {
		byteCode.setMnemonic("irem");
		byteCode.setOperation("rem");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1);
	});

	it("should process neg", function () {
		byteCode.setMnemonic("neg");
		byteCode.setOperation("neg");
		var value = 3;

		frame.getStack().push(value);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(-3);
	});

	it("should process shift left", function () {
		byteCode.setMnemonic("ishl");
		byteCode.setOperation("shift_left");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 << value2);
	});

	it("should process arithmetic shift right", function () {
		byteCode.setMnemonic("ishr");
		byteCode.setOperation("arithmetic_shift_right");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value2);
		frame.getStack().push(value1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value2 >> value1);
	});

	it("should process logical shift right", function () {
		byteCode.setMnemonic("iushr");
		byteCode.setOperation("logical_shift_right");
		var value1 = 1;
		var value2 = 2;

		frame.getStack().push(value1);
		frame.getStack().push(value2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(value1 >>> value2);
	});

	it("should process and", function () {
		byteCode.setMnemonic("iand");
		byteCode.setOperation("and");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1 & 2);
	});

	it("should process or", function () {
		byteCode.setMnemonic("ior");
		byteCode.setOperation("or");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(1 | 2);
	});

	it("should process xor", function () {
		byteCode.setMnemonic("ixor");
		byteCode.setOperation("xor");
		var var1 = 7;
		var var2 = 3;

		frame.getStack().push(var1);
		frame.getStack().push(var2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toEqual(var1 ^ var2);
	});

	it("should process iinc", function () {
		byteCode.setMnemonic("iinc");
		byteCode.setOperation("increment");
		byteCode.setArgs([3, 1]);

		frame.getLocalVariables().store(3, 5);

		byteCode.execute(frame);

		expect(frame.getLocalVariables().load(3)).toEqual(6);
	});

	it("should compare", function () {
		byteCode.setMnemonic("dcmpg");
		byteCode.setOperation("compare");

		frame.getStack().push(1);
		frame.getStack().push(1);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeTruthy();
	});

	it("should compare unequals", function () {
		byteCode.setMnemonic("dcmpg");
		byteCode.setOperation("compare");

		frame.getStack().push(1);
		frame.getStack().push(2);

		byteCode.execute(frame);

		expect(frame.getStack().pop()).toBeFalsy();
	});

	it("should process if_equal with equal", function () {
		byteCode.setMnemonic("ifeq");
		byteCode.setOperation("if_equal");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifeq");
		byteCode.setOperation("if_equal");
		byteCode.setArgs([51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_not_equal with not equal", function () {
		byteCode.setMnemonic("ifne");
		byteCode.setOperation("if_not_equal");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifne");
		byteCode.setOperation("if_not_equal");
		byteCode.setArgs([51]);
		var value1 = 5;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_less_than with less than", function () {
		byteCode.setMnemonic("iflt");
		byteCode.setOperation("if_less_than");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("iflt");
		byteCode.setOperation("if_less_than");
		byteCode.setArgs([51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_greater_than_or_equal with greater than", function () {
		byteCode.setMnemonic("ifge");
		byteCode.setOperation("if_greater_than_or_equal");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifge");
		byteCode.setOperation("if_greater_than_or_equal");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifge");
		byteCode.setOperation("if_greater_than_or_equal");
		byteCode.setArgs([51]);
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_greater_than with greater than", function () {
		byteCode.setMnemonic("ifgt");
		byteCode.setOperation("if_greater_than");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifgt");
		byteCode.setOperation("if_greater_than");
		byteCode.setArgs([51]);
		var value1 = 5;
		var value2 = 10;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process if_less_than_or_equal with less than", function () {
		byteCode.setMnemonic("ifle");
		byteCode.setOperation("if_less_than_or_equal");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifle");
		byteCode.setOperation("if_less_than_or_equal");
		byteCode.setArgs([51]);
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
		byteCode.setMnemonic("ifle");
		byteCode.setOperation("if_less_than_or_equal");
		byteCode.setArgs([51]);
		var value1 = 10;
		var value2 = 5;
		
		frame.getStack().push(value1);
		frame.getStack().push(value2);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process goto", function () {
		var location = 18;

		byteCode.setMnemonic("goto");
		byteCode.setOperation("goto");
		byteCode.setArgs([location]);

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
		byteCode.setMnemonic("jsr");
		byteCode.setOperation("jsr");
		byteCode.setArgs([location]);

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
		byteCode.setMnemonic("ret");
		byteCode.setOperation("ret");
		byteCode.setArgs([variableLocation]);
		
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
		byteCode.setMnemonic("ireturn");
		byteCode.setOperation("return_value");

		var value = 3;

		frame.getStack().push(value);

		var output = byteCode.execute(frame);

		expect(output).toEqual(value);
	});

	it("should process return void", function () {
		byteCode.setMnemonic("return");
		byteCode.setOperation("return_void");

		var output = byteCode.execute(frame);

		expect(output).toEqual(jjvm.runtime.Void);
	});

	it("should process get_static", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/io/PrintStream"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "out"}));
		constantPool.store(3, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 2, nameTypeIndex: 1}));
		constantPool.store(4, new jjvm.types.ConstantPoolClassValue({classIndex: 1}));
		constantPool.store(5, new jjvm.types.ConstantPoolValue({type: "Asciz", value: "java/lang/System"}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 5, value: "java/lang/System"}));
		constantPool.store(7, new jjvm.types.ConstantPoolFieldValue({classIndex: 6, nameAndTypeIndex: 3, className: "java.lang.System", fieldName: "out", fieldType: "java.io.PrintStream"}));

		//var byteCode = new jjvm.types.ByteCode("getstatic", "get_static", [7], 0, constantPool);
		byteCode.setMnemonic("getstatic");
		byteCode.setOperation("get_static");
		byteCode.setArgs([7]);
		
		byteCode.execute(frame, constantPool);

		var fieldDef = frame.getStack().pop();
		var classDef = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");

		expect(fieldDef.getClass().getName()).toEqual(classDef.getName());
	});

	it("should process put_static", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "SimpleExample$Blah"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "blah"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "I"}));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 3, nameTypeIndex: 4}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));
		constantPool.store(7, new jjvm.types.ConstantPoolClassValue({classIndex: 2, value: "SimpleExample$Blah"}));
		constantPool.store(8, new jjvm.types.ConstantPoolFieldValue({classIndex: 7, nameAndTypeIndex: 5, className: "SimpleExample$Blah", fieldName: "blah", fieldType: "I"}));

		var initialFieldValue = 7;
		var expectedFieldValue = 5;

		var classDef = new jjvm.types.ClassDefinition();
		classDef.setName("SimpleExample$Blah");
		classDef.setParent("java.lang.Object");
		classDef.setConstantPool(constantPool);

		var fieldDef = new jjvm.types.FieldDefinition();
		fieldDef.setName("blah");
		fieldDef.setType("int");
		fieldDef.setIsStatic(true);

		classDef.addField(fieldDef);
		classDef.setStaticField("blah", initialFieldValue);

		jjvm.core.ClassLoader.addClassDefinition(classDef);

		frame.getStack().push(expectedFieldValue);

		byteCode.setMnemonic("putstatic");
		byteCode.setOperation("put_static");
		byteCode.setArgs([8]);
		byteCode.execute(frame, constantPool);

		expect(classDef.getStaticField("blah")).toEqual(expectedFieldValue);
	});

	it("should process getfield", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "SimpleExample$Blah"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "blah"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "I"}));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 3, nameTypeIndex: 4}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));
		constantPool.store(7, new jjvm.types.ConstantPoolClassValue({classIndex: 2, value: "SimpleExample$Blah"}));
		constantPool.store(8, new jjvm.types.ConstantPoolFieldValue({classIndex: 7, nameAndTypeIndex: 5, className: "SimpleExample$Blah", fieldName: "blah", fieldType: "I"}));

		var expectedFieldValue = 5;

		var classDef = new jjvm.types.ClassDefinition();
		classDef.setName("SimpleExample$Blah");
		classDef.setParent("java.lang.Object");
		classDef.setConstantPool(constantPool);

		var fieldDef = new jjvm.types.FieldDefinition();
		fieldDef.setName("blah");
		fieldDef.setType("int");
		classDef.addField(fieldDef);

		jjvm.core.ClassLoader.addClassDefinition(classDef);

		var objectRef = new jjvm.runtime.ObjectReference(classDef);
		objectRef.setField("blah", expectedFieldValue);

		frame.getStack().push(objectRef);

		byteCode.setMnemonic("getfield");
		byteCode.setOperation("get_field");
		byteCode.setArgs([8]);

		byteCode.execute(frame, constantPool);

		expect(frame.getStack().pop()).toEqual(expectedFieldValue);
	});

	it("should process putfield", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "SimpleExample$Blah"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "blah"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "I"}));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 3, nameTypeIndex: 4}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));
		constantPool.store(7, new jjvm.types.ConstantPoolClassValue({classIndex: 2, value: "SimpleExample$Blah"}));
		constantPool.store(8, new jjvm.types.ConstantPoolFieldValue({classIndex: 7, nameAndTypeIndex: 5, className: "SimpleExample$Blah", fieldName: "blah", fieldType: "I"}));

		var initialFieldValue = 3;
		var expectedFieldValue = 5;

		var classDef = new jjvm.types.ClassDefinition();
		classDef.setName("SimpleExample$Blah");
		classDef.setParent("java.lang.Object");
		classDef.setConstantPool(constantPool);

		var fieldDef = new jjvm.types.FieldDefinition();
		fieldDef.setName("blah");
		fieldDef.setType("int");
		classDef.addField(fieldDef);

		jjvm.core.ClassLoader.addClassDefinition(classDef);

		var objectRef = new jjvm.runtime.ObjectReference(classDef);
		objectRef.setField("blah", initialFieldValue);

		frame.getStack().push(objectRef);
		frame.getStack().push(expectedFieldValue);

		byteCode.setMnemonic("putfield");
		byteCode.setOperation("put_field");
		byteCode.setArgs([8]);

		byteCode.execute(frame, constantPool);

		expect(objectRef.getField("blah")).toEqual(expectedFieldValue);
	});

	it("should process new", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));

		byteCode.setMnemonic("new");
		byteCode.setOperation("new");
		byteCode.setArgs([2]);

		byteCode.execute(frame, constantPool);

		var objectRef = frame.getStack().pop();

		expect(objectRef).toBeDefined();
		expect(objectRef).not.toBeNull();
		expect(objectRef.getClass().getName()).toEqual("java.lang.Object");
	});

	it("should process checkcast", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));

		byteCode.setMnemonic("checkcast");
		byteCode.setOperation("check_cast");
		byteCode.setArgs([2]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame, constantPool);

		// no exception thrown...
	});

	it("should process checkcast and throw", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Integer"}));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Integer"}));

		byteCode.setMnemonic("checkcast");
		byteCode.setOperation("check_cast");
		byteCode.setArgs([2]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		expect(byteCode.execute, frame, constantPool).toThrow();
	});

	it("should process throw", function () {
		byteCode.setMnemonic("athrow");
		byteCode.setOperation("throw");

		frame.getStack().push("panic!");

		expect(byteCode.execute, frame).toThrow();
	});


	it("should process instanceof with instance of", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/io/PrintStream"}));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/io/PrintStream"}));

		byteCode.setMnemonic("instanceof");
		byteCode.setOperation("instance_of");
		byteCode.setArgs([2]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame, constantPool);

		expect(frame.getStack().pop()).toBeTruthy();
	});


	it("should process instanceof with not instance of", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/System"}));
		constantPool.store(2, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/System"}));

		byteCode.setMnemonic("instanceof");
		byteCode.setOperation("instance_of");
		byteCode.setArgs([2]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		byteCode.execute(frame, constantPool);

		expect(frame.getStack().pop()).toBeFalsy();
	});

	it("should create multi-dimensional array", function () {
		byteCode.setMnemonic("multianewarray");
		byteCode.setOperation("multi_dimensional_array_create");
		byteCode.setArgs([3, 4]);

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
		byteCode.setMnemonic("monitorenter");
		byteCode.setOperation("monitor_enter");

		var lockObject = {};
		frame.getStack().push(lockObject);

		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process monitorexit", function () {
		byteCode.setMnemonic("monitorexit");
		byteCode.setOperation("monitor_exit");

		var lockObject = {};
		frame.getStack().push(lockObject);

		byteCode.execute(frame);

		expect(frame.getStack().getStack().length).toEqual(0);
	});

	it("should process ifnonnull with non null", function () {
		byteCode.setMnemonic("ifnonnull");
		byteCode.setOperation("if_non_null");
		byteCode.setArgs([51]);
		
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
		byteCode.setMnemonic("ifnonnull");
		byteCode.setOperation("if_non_null");
		byteCode.setArgs([51]);
		
		frame.getStack().push(null);

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process ifnull with null", function () {
		byteCode.setMnemonic("ifnull");
		byteCode.setOperation("if_null");
		byteCode.setArgs([51]);

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
		byteCode.setMnemonic("ifnull");
		byteCode.setOperation("if_null");
		byteCode.setArgs([51]);

		frame.getStack().push("foo");

		// will throw a Goto if not working
		byteCode.execute(frame);
	});

	it("should process invokespecial", function () {
		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "<init>"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "()V"}));
		constantPool.store(4, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));
		constantPool.store(5, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 2, typeIndex: 3}));
		constantPool.store(6, new jjvm.types.ConstantPoolMethodValue({classIndex: 4, nameAndTypeIndex: 5, className: "java.lang.Object", methodName: "<init>", methodType: ""}));

		byteCode.setMnemonic("invokespecial");
		byteCode.setOperation("invoke_special");
		byteCode.setArgs([6]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, "executeChild");

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokestatic", function () {
		var testClass = new jjvm.types.ClassDefinition();
		testClass.setName("org.jjvm.InvokeStaticTest");
		testClass.setParent("java.lang.Object");

		var testClassStaticMethod = new jjvm.types.MethodDefinition();
		testClassStaticMethod.setName("staticTestMethod");
		testClassStaticMethod.setArgs([]);
		testClassStaticMethod.setClassDef(testClass);
		testClassStaticMethod.setImplementation(function() {
			
		});
		testClassStaticMethod.setIsStatic(true);
		testClass.addMethod(testClassStaticMethod);

		jjvm.core.ClassLoader.addClassDefinition(testClass);

		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "org/jjvm/InvokeStaticTest"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "staticTestMethod"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "()V"}));
		constantPool.store(5, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java.lang.Object"}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 2, value: "org.jjvm.InvokeStaticTest"}));
		constantPool.store(7, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 3, nameTypeIndex: 4}));
		constantPool.store(8, new jjvm.types.ConstantPoolMethodValue({classIndex: 6, nameAndTypeIndex: 7, className: "org.jjvm.InvokeStaticTest", methodName: "staticTestMethod", methodType: ""}));
		
		byteCode.setMnemonic("invokestatic");
		byteCode.setOperation("invoke_static");
		byteCode.setArgs([8]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, "executeChild");

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokevirtual", function () {
		var testClass = new jjvm.types.ClassDefinition();
		testClass.setName("org.jjvm.InvokeStaticTest");
		testClass.setParent("java.lang.Object");

		var testClassStaticMethod = new jjvm.types.MethodDefinition();
		testClassStaticMethod.setName("testMethod");
		testClassStaticMethod.setArgs([]);
		testClassStaticMethod.setClassDef(testClass);
		testClassStaticMethod.setImplementation(function() {
			
		});
		testClass.addMethod(testClassStaticMethod);
		jjvm.core.ClassLoader.addClassDefinition(testClass);

		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "org/jjvm/InvokeStaticTest"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "testMethod"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "()V"}));
		constantPool.store(5, new jjvm.types.ConstantPoolClassValue({classIndex: 1, name: "java/lang/Object"}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 2, name: "org/jjvm/InvokeStaticTest"}));
		constantPool.store(7, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 3, nameTypeIndex: 4}));
		constantPool.store(8, new jjvm.types.ConstantPoolMethodValue({classIndex: 6, nameAndTypeIndex: 7, className: "org.jjvm.InvokeStaticTest", methodName: "testMethod", methodType: ""}));

		byteCode.setMnemonic("invokevirtual");
		byteCode.setOperation("invoke_virtual");
		byteCode.setArgs([8]);

		var classDef = jjvm.core.ClassLoader.loadClass("java.lang.Object");
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		frame.getStack().push(objectRef);

		spyOn(frame, "executeChild");

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});

	it("should process invokeinterface", function () {
		var testClass = new jjvm.types.ClassDefinition();
		testClass.setName("org.jjvm.InvokeInterfaceTest");
		testClass.setParent("java.lang.Object");

		var testMethod = new jjvm.types.MethodDefinition();
		testMethod.setName("testMethod");
		testMethod.setArgs([]);
		testMethod.setClassDef(testClass);
		testMethod.setImplementation(function() {
			
		});
		testClass.addMethod(testMethod);

		jjvm.core.ClassLoader.addClassDefinition(testClass);

		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "java/lang/Object"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "org/jjvm/InvokeInterfaceTest"}));
		constantPool.store(3, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "testMethod"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Utf8", value: "()V"}));
		constantPool.store(5, new jjvm.types.ConstantPoolClassValue({classIndex: 1, value: "java/lang/Object"}));
		constantPool.store(6, new jjvm.types.ConstantPoolClassValue({classIndex: 2, value: "org/jjvm/InvokeInterfaceTest"}));
		constantPool.store(7, new jjvm.types.ConstantPoolNameAndTypeValue({nameIndex: 3, nameTypeIndex: 4}));
		constantPool.store(8, new jjvm.types.ConstantPoolMethodValue({classIndex: 6, nameAndTypeIndex: 7, className: "org.jjvm.InvokeInterfaceTest", methodName: "testMethod", methodType: ""}));
		
		byteCode.setMnemonic("invokeinterface");
		byteCode.setOperation("invoke_interface");
		byteCode.setArgs([8]);

		var objectRef = new jjvm.runtime.ObjectReference(testClass);

		frame.getStack().push(objectRef);

		spyOn(frame, "executeChild");

		byteCode.execute(frame, constantPool);

		expect(frame.executeChild).toHaveBeenCalled();
	});
});
