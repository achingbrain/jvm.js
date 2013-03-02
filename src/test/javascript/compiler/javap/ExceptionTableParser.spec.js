
describe("jjvm.compiler.javap.ExceptionTableParser test", function () {
	var parser = new jjvm.compiler.javap.ExceptionTableParser();

	it("should parse exception table", function () {
		var iterator = new jjvm.core.Iterator([
			"  Exception table:",
			"from   to  target type",
			"4     6     9   any",
			"9    10     9   any",
			""
		]);

		var exceptionTable = parser.parse(iterator);

		// should have parsed exception table correctly
		expect(exceptionTable.resolve(4)).toEqual(9);
		expect(exceptionTable.resolve(10)).toEqual(9);
		expect(exceptionTable.resolve(15)).toBeNull();
	});
});

