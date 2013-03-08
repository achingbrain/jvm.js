describe("jjvm.compiler.BlockParser test", function () {
	var parser = new jjvm.compiler.BlockParser();

	it("should parse block", function () {
		// contains hex numbers 1-32
		var buffer = [
			0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 
			0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, 
			0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 
			0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
		];
		var bytes = new Uint8Array(buffer);
		var blockIterator = new jjvm.core.ByteIterator(bytes);
		var constantPool = {};
		var parserInvoked = false;
		var length = 10;

		parser.parseBlock(blockIterator, constantPool, length, {
			parse: function(iterator, pool) {
				expect(iterator.getLocation()).toEqual(0);

				for(var i = 0; i < length; i++) {
					var value = iterator.next();
					expect(value).toEqual(buffer[i]);
				}

				// should have consumed slice of iterator
				expect(iterator.hasNext()).toBeFalsy();

				// should have had correct pool passed to us
				expect(pool).toEqual(constantPool);

				parserInvoked = true;
			}
		});

		// should have been invoked
		expect(parserInvoked).toBeTruthy();
	});

	it("should parse empty block", function () {
		var buffer = [
			0x00, 0x00, 0x00, 0x02
		];
		var bytes = new Uint8Array(buffer);
		var blockIterator = new jjvm.core.ByteIterator(bytes);

		parser.readEmptyBlock("foo", blockIterator, 2);
	});

	it("should object if asked parse empty block with wrong length", function () {
		var buffer = [
			0x00, 0x00, 0x00, 0x04
		];
		var bytes = new Uint8Array(buffer);
		var blockIterator = new jjvm.core.ByteIterator(bytes);

		try {
			parser.readEmptyBlock("foo", blockIterator, 2);

			// should have thrown an exception already
			expect(true).toEqual(false);
		} catch(e) {
			expect(e).toEqual("foo attribute should have length 2! found 4");
		}
	});
});
