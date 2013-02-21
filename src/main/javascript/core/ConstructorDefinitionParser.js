function ConstructorDefinitionParser() {
	var regex = /^(public|protected|private)\s([a-zA-Z0-9_]*)\((.*)\);/;
	var byteCodeParser = new ByteCodeParser();

	this.canParse = function(line) {
		if(line.match(regex)) {
			return true;
		}

		return false;
	};

	this.parse = function(iterator) {
		var line = iterator.next();
		var match = line.match(regex);
		var instructions = byteCodeParser.parse(iterator);

		var args = match[3].split(", ");

		for(var i = 0; i < args.length; i++) {
			args[i] = _.str.trim(args[i]);

			if(!args[i]) {
				args.splice(i, 1);
				i--;
			}
		}

		return new ConstructorDefinition(match[1], match[2], args, instructions);
	};
}
