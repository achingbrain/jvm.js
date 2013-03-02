jjvm.core.SystemClassLoader = {
	_classes: [],

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		// haven't seen this class before
		jjvm.core.SystemClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.SystemClassLoader._classes;
	},

	loadClass: function(className) {
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[i];
			}
		}

		throw "NoClassDefFound: " + className;
	}
};
