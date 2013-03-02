jjvm.compiler.javap.MethodDefinitionParser = function() {
	var regex = /^(public|protected|private)?\s?(static)?\s?(final)?\s?(synchronized)?\s?([a-zA-Z0-9_\.]*)\s([a-zA-Z0-9_]*)\((.*)\);/;
	var byteCodeParser = new jjvm.compiler.javap.ByteCodeParser();

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

		var args = match[7].split(", ");

		for(var i = 0; i < args.length; i++) {
			args[i] = _.str.trim(args[i]);

			if(!args[i]) {
				args.splice(i, 1);
				i--;
			}
		}

		return new jjvm.types.MethodDefinition(match[1], match[2], match[3], match[4], match[5], match[6], args, instructions);
	};
};
