jjvm.compiler.LineNumberTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table[iterator.readU16()] = iterator.readU16();
		}

		return new jjvm.types.LineNumberTable(table);
	};

	this.toString = function() {
		return "LineNumberTableParser";
	};
};
