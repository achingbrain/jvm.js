jjvm.types.ExceptionTable = function(table) {

	this.resolve = function(line) {
		for(var i = 0; i < table.length; i++) {
			if(table[i].from <= line && table[i].to >= line) {
				return table[i].target;
			}
		}

		return null;
	};
};
