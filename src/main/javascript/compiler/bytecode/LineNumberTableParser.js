jjvm.compiler.bytecode.LineNumberTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table[iterator.readU8()] = iterator.readU8();
		}

		return new jjvm.types.LineNumberTable(table);
	};

	this.toString = function() {
		return "LineNumberTableParser";
	};
};
