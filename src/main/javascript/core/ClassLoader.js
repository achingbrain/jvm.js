ClassLoader = {
	_classes: [],

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < ClassLoader._classes.length; i++) {
			if(ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				ClassLoader._classes[i] = classDef;

				return;
			}
		}

		// haven't seen this class before
		ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return ClassLoader._classes;
	},

	loadClass: function(className) {
		for(var i = 0; i < ClassLoader._classes.length; i++) {
			if(ClassLoader._classes[i].getName() == className) {
				return ClassLoader._classes[i];
			}
		}

		return SystemClassLoader.loadClass(className);
	}
};