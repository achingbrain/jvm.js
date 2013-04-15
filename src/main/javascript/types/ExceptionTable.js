jjvm.types.ExceptionTable = function(table) {

	this.resolve = function(line, type) {
		for(var i = 0; i < table.length; i++) {
			if(table[i].from <= line && table[i].to >= line && type.getClass().isChildOf(table[i].type.getClassDef())) {
				return table[i].target;
			}
		}

		return null;
	};

	this.toJavaP = function() {
		var output = "\t\tExceptionTable:\r\n";
		output += "\t\t\tfrom\tto\ttarget\ttype\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			output += "\t\t\t" + table[i].from + "\t\t" + table[i].to + "\t\t" + table[i].target + "\t" + table[i].type.getClassDef().getName() + "\r\n";
		}

		return output;
	};

	this.getData = function() {
		return table;
	};

	this.toString = function() {
		return "ExceptionTable";
	};
};
