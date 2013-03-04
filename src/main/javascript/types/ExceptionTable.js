jjvm.types.ExceptionTable = function(table) {

	this.resolve = function(line) {
		for(var i = 0; i < table.length; i++) {
			if(table[i].from <= line && table[i].to >= line) {
				return table[i].target;
			}
		}

		return null;
	};

	this.toJavaP = function() {
		var output = "\t\tExceptionTable:\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			//output += "\t\t\tline " + i + ":\t" + table[i] + "\r\n";
		}

		return output;
	};

	this.toString = function() {
		return "ExceptionTable";
	};
};
