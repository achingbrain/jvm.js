jjvm.compiler.BlockParser = function() {

	this.parseBlock = function(iterator, constantsPool, length, parser) {
		//jjvm.console.info("parsing block of length " + length + " with " + parser);
		var block = iterator.getIterable().subarray(iterator.getLocation(), iterator.getLocation() + length);
		var blockIterator = new jjvm.core.ByteIterator(block);

		// skip to end of block
		iterator.jump(iterator.getLocation() + length);

		// parse block
		return parser.parse(blockIterator, constantsPool);
	};

	this.readEmptyBlock = function(attributeName, iterator, expectedLength) {
		if(expectedLength === undefined) {
			expectedLength = 0;
		}

		var attributeLength = iterator.readU32();

		if(attributeLength !== expectedLength) {
			throw attributeName + " attribute should have length " + expectedLength + "! found " + attributeLength;
		}
	};

	this.toString = function() {
		return "BlockParser";
	};
};