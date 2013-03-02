jjvm.compiler.bytecode.LocalVariableTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		var table = {};

		while(iterator.hasNext()) {
			table[iterator.readU16()] ={
				length: iterator.readU16(),
				name: iterator.readU16(),
				descriptor: iterator.readU16(),
				index: iterator.readU16()
			};
		}

		return new jjvm.types.LocalVariableTable(table);
	};

	this.toString = function() {
		return "LocalVariableTableParser";
	};
};
