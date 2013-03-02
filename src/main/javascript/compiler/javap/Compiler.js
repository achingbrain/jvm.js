jjvm.compiler.javap.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.javap.ClassDefinitionParser();

	this.compile = function(source) {
		jjvm.core.NotificationCentre.dispatch(this, "onCompileStart");

		try {
			var iterator = new jjvm.core.Iterator(source.split("\n"));

			while(iterator.hasNext()) {
				var line = iterator.peek();

				if(classDefinitionParser.canParse(line)) {
					var classDef = classDefinitionParser.parse(iterator);

					jjvm.core.ClassLoader.addClassDefinition(classDef);

					jjvm.core.NotificationCentre.dispatch(this, "onDefined", classDef);
				} else {
					iterator.skip();
				}
			}

			jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};
};
