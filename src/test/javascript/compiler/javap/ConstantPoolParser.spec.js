
describe("jjvm.compiler.javap.ConstantPoolParser test", function () {
	var parser = new jjvm.compiler.javap.ConstantPoolParser();

	it("should accept constant pool line", function () {
		var line = "	Constant pool:";

		expect(parser.canParse(line)).toBeTruthy();
	});

	it("should decline to parse line without constant pool", function () {
		var line = "Compiled from MyClass.java";

		expect(parser.canParse(line)).toBeFalsy();
	});


	it("Should parse constant pool", function () {
		var iterator = new jjvm.core.Iterator([
			"const #1 = Method	#6.#34;	//  java/lang/Object.\"<init>\":()V",
			"const #2 = Field	#5.#35;	//  Other.s:Ljava/lang/CharSequence;",
			"const #3 = InterfaceMethod	#36.#37;	//  java/lang/CharSequence.length:()I",
			"const #4 = String	#38;	//  ",
			"const #5 = class	#39;	//  Other",
			"const #6 = class	#40;	//  java/lang/Object",
			"const #7 = Asciz	ifoo;",
			"const #8 = Asciz	I;",
			"const #9 = Asciz	ConstantValue;",
			"const #10 = int	12398;",
			"const #11 = Asciz	ffoo;",
			"const #12 = Asciz	F;",
			"const #13 = float	132098.23f;",
			"const #14 = Asciz	lfoo;",
			"const #15 = Asciz	J;",
			"const #16 = long	1320938l;",
			"const #18 = Asciz	dfoo;",
			"const #19 = Asciz	D;",
			"const #20 = double	1320938.2d;",
			"const #22 = Asciz	s;",
			"const #23 = Asciz	Ljava/lang/CharSequence;;",
			"const #24 = Asciz	<init>;",
			"const #25 = Asciz	()V;",
			"const #26 = Asciz	Code;",
			"const #27 = Asciz	LineNumberTable;",
			"const #28 = Asciz	doSomething;",
			"const #29 = Asciz	Exceptions;",
			"const #30 = class	#41;	//  java/lang/Throwable",
			"const #31 = Asciz	<clinit>;",
			"const #32 = Asciz	SourceFile;",
			"const #33 = Asciz	Other.java;",
			"const #34 = NameAndType	#24:#25;//  \"<init>\":()V",
			"const #35 = NameAndType	#22:#23;//  s:Ljava/lang/CharSequence;",
			"const #36 = class	#42;	//  java/lang/CharSequence",
			"const #37 = NameAndType	#43:#44;//  length:()I",
			"const #38 = Asciz	;",
			"const #39 = Asciz	Other;",
			"const #40 = Asciz	java/lang/Object;",
			"const #41 = Asciz	java/lang/Throwable;",
			"const #42 = Asciz	java/lang/CharSequence;",
			"const #43 = Asciz	length;",
			"const #44 = Asciz	()I;",
			""
		]);
		var constantPool = parser.parse(iterator);

		// should have parsed class definition correctly
		expect(constantPool.load(4).getValue()).toEqual("");
		expect(constantPool.load(25).getValue()).toEqual("()V");
	});
});
