jjvm.core.ClassLoader = {
	_classes: [],

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.ClassLoader._classes[i] = classDef;

				return;
			}
		}

		// haven't seen this class before
		jjvm.core.ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.ClassLoader._classes;
	},

	loadClass: function(className) {
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == className) {
				return jjvm.core.ClassLoader._classes[i];
			}
		}

		return jjvm.core.SystemClassLoader.loadClass(className);
	}
};