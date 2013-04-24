describe("jjvm.types.ConstantPoolPrimitiveValue test", function () {
	
	it("should have value", function () {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType("Utf8");
		value.setValue("bar");

		expect(value.getValue()).toEqual("bar");
	});

	it("should have type", function () {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType("Utf8");
		value.setValue("bar");

		expect(value.getType()).toEqual("Utf8");
	});

	it("should have type and value via data", function () {
		var value = new jjvm.types.ConstantPoolPrimitiveValue({type: "Utf8", value: "bar"});

		expect(value.getType()).toEqual("Utf8");
		expect(value.getValue()).toEqual("bar");
	});
});
