function ByteCodeParser() {

	this.parse = function(iterator) {
		var instructions = [];

		while(iterator.hasNext()) {
			line = iterator.peek();
			line = _.str.trim(line);

			if(line == "Exception table:") {
				break;
			} else {
				line = iterator.next();
				line = _.str.trim(line);
			}

			if(!line) {
				break;
			}

			if(!line.match(/^([0-9])/)) {
				// bytecode lines start with a number..
				continue;
			}

			instructions.push(new ByteCode(line));
		}

		return instructions;
	};
}
