jjvm.types.LineNumberTable = function(table) {

	this.getTable = function() {
		return table;
	};

	this.toJavaP = function() {
		var output = "\t\tLineNumberTable:\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			output += "\t\t\tline " + table[i] + ":\t" + i + "\r\n";
		}

		return output;
	};

	this.toString = function() {
		return "LineNumberTable";
	};
};
