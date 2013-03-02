jjvm.compiler.javap.ClassDefinitionParser = function() {
	// final
	var regex = /^(public|protected|private)?\s?(abstract)?\s?(final)?\s?(class|interface)\s([a-zA-Z0-9_$\.\/]+)(\sextends\s([a-zA-Z0-9_$\.\/]+))?\s?(implements\s+([a-zA-Z0-9_$\.,]+))?\s?\{/;
	var constantPoolParser = new jjvm.compiler.javap.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.javap.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.javap.MethodDefinitionParser();
	var exceptionTableParser = new jjvm.compiler.javap.ExceptionTableParser();

	this.canParse = function(line) {
		if(line.match(regex)) {
			return true;
		}

		return false;
	};

	this.parse = function(iterator) {
		var line = iterator.next();
		var match = line.match(regex);

		if(!match || match.length != 10) {
			throw "ClassDefinitionParser could not parse " + line;
		}

		// ensure we have compiled interfaces
		var interfaces = [];

		if(match[9]) {
			interfaces = match[9].split(",");

			for(var i = 0; i < interfaces.length; i++) {
				interfaces[i] = jjvm.core.ClassLoader.loadClass(_.str.trim(interfaces[i]));
			}
		}

		var parent = null;

		if(match[7]) {
			parent = jjvm.core.ClassLoader.loadClass(match[7]);
		}

		var classDef = new jjvm.types.ClassDefinition(match[1], match[2] ? true : false, match[3] ? true : false, match[5], parent, interfaces);

		while(iterator.hasNext()) {
			line = iterator.peek();
			line = _.str.trim(line);

			if(line == "}") {
				break;
			}

			if(constantPoolParser.canParse(line)) {
				classDef.setConstantPool(constantPoolParser.parse(iterator));
			}else if(exceptionTableParser.canParse(line)) {
				classDef.setExceptionTable(exceptionTableParser.parse(iterator));
			}else if(methodDefinitionParser.canParse(line)) {
				classDef.addMethod(methodDefinitionParser.parse(iterator));
			} else if(fieldDefinitionParser.canParse(line)) {
				classDef.addField(fieldDefinitionParser.parse(iterator));
			} else {
				iterator.skip();
			}
		}

		return classDef;
	};
};
