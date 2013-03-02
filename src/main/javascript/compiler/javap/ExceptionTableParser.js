jjvm.compiler.javap.ExceptionTableParser = function() {
	var regex = /^Exception table:/;

	this.canParse = function(line) {
		if(line.match(regex)) {
			return true;
		}

		return false;
	};

	this.parse = function(iterator) {
		var line = iterator.next();
		var table = [];

		while(iterator.hasNext()) {
			line = iterator.next();
			line = _.str.trim(line);

			if(!line) {
				break;
			}

			var match = line.match(/^from\s+to\s+target\s+type$/);

			if(match) {
				// table header
				continue;
			}

			match = line.match(/^([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+/);

			table.push({
				from: parseInt(match[1], 10),
				to: parseInt(match[2], 10),
				target: parseInt(match[3], 10)
			});
		}

		return new jjvm.types.ExceptionTable(table);
	};
};
