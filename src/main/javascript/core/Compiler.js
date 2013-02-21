
Compiler = function() {
	var classDefinitionParser = new ClassDefinitionParser();

	this.compile = function(source) {
		NotificationCentre.dispatch(this, "onCompileStart");

		try {
			var iterator = new Iterator(source.split("\n"));

			while(iterator.hasNext()) {
				var line = iterator.peek();

				if(classDefinitionParser.canParse(line)) {
					var classDef = classDefinitionParser.parse(iterator);

					ClassLoader.addClassDefinition(classDef);

					NotificationCentre.dispatch(this, "onDefined", classDef);
				} else {
					iterator.skip();
				}
			}

			NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};
};
