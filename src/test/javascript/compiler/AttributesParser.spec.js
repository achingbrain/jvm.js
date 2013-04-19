describe("jjvm.compiler.AttributesParser test", function () {
	it("should parse attributes block", function () {
		var buffer = [
			// the number of attributes
			0x00, 0x04, 

			// attribute 1 - name
			0x00, 0x01,

			// attribute 1 - length - one byte
			0x00, 0x00, 0x00, 0x01,

			// attribute 1 - value
			0x01,

			// attribute 2 - name
			0x00, 0x02,

			// attribute 2 - length - two bytes
			0x00, 0x00, 0x00, 0x02,

			// attribute 2 - value
			0x00, 0x10,

			// attribute 3 - name
			0x00, 0x04,

			// attribute 3 - length - two bytes
			0x00, 0x00, 0x00, 0x02,

			// attribute 3 - value
			0x00, 0x20,

			// attribute 4 - name
			0x00, 0x05,

			// attribute 4 - length - zero bytes
			0x00, 0x00, 0x00, 0x00
		];
		var bytes = new Uint8Array(buffer);
		var iterable = new jjvm.core.ByteIterator(bytes);

		var constantPool = new jjvm.types.ConstantPool();
		constantPool.store(1, new jjvm.types.ConstantPoolValue({type: "Asciz", value: "Attribute1Name"}));
		constantPool.store(2, new jjvm.types.ConstantPoolValue({type: "Asciz", value: "Attribute2Name"}));
		constantPool.store(4, new jjvm.types.ConstantPoolValue({type: "Asciz", value: "Attribute3Name"}));
		constantPool.store(5, new jjvm.types.ConstantPoolValue({type: "Asciz", value: "WillBeUnrecognised"}));

		var parser = new jjvm.compiler.AttributesParser(iterable, constantPool);

		var invocations = 0;

		parser.onAttributeCount = function(attributeCount) {
			expect(attributeCount).toEqual(4);

			invocations++;
		};
		parser.onAttribute1Name = function(iterator, constantPool) {
			var attribute1Value = iterator.readU8();
			expect(attribute1Value).toEqual(0x01);

			invocations++;
		};
		parser.onAttribute2Name = function(iterator, constantPool) {
			var attribute2Value = iterator.readU16();
			expect(attribute2Value).toEqual(0x0010);

			invocations++;
		};
		parser.onAttribute3Name = function(iterator, constantPool) {
			var attribute3Value = iterator.readU16();
			expect(attribute3Value).toEqual(0x0020);

			invocations++;
		};
		parser.onUnrecognisedAttribute = function(attributeName) {
			expect(attributeName).toEqual("WillBeUnrecognised");

			invocations++;
		};

		parser.parse(iterable, constantPool);

		expect(invocations).toEqual(5);
	});
});
