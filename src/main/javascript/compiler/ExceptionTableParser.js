jjvm.compiler.ExceptionTableParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table.push({
				from: iterator.readU16(),
				to: iterator.readU16(),
				target: iterator.readU16(),
				type: constantsPool.load(iterator.readU16())
			});
		}

		if(table.length === 0) {
			return null;
		}

		return new jjvm.types.ExceptionTable(table);
	};

	this.toString = function() {
		return "ExceptionTableParser";
	};
};
