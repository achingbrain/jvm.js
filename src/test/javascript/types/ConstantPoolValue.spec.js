describe("jjvm.types.ConstantPoolValue test", function () {
	
	it("should have value", function () {
		var value = new jjvm.types.ConstantPoolValue("foo", "bar");

		expect(value.getValue()).toEqual("bar");
	});

	it("should have type", function () {
		var value = new jjvm.types.ConstantPoolValue("foo", "bar");

		expect(value.getType()).toEqual("foo");
	});
});
