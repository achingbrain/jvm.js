function FieldDefinitionParser() {
	// static final transient volatile
	var regex = /^(public|protected)\s(static)?\s?(final)?\s?(volatile)?\s?(transient)?\s?([a-zA-Z0-9_\.]*)\s([a-zA-Z0-9_]*);/;

	this.canParse = function(line) {
		if(line.match(regex)) {
			return true;
		}

		return false;
	};

	this.parse = function(iterator) {
		var line = iterator.next();
		var match = line.match(regex);

		return new FieldDefinition(match[1], match[2], match[3], match[4], match[5], match[6], match[7]);
	};
}
