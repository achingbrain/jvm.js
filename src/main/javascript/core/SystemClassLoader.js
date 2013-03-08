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
		if(jjvm.types.Primitives.primitiveToClass[className]) {
			// convert int to java.lang.Integer
			var className2 = jjvm.types.Primitives.primitiveToClass[className];
		}

		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[i];
			}
		}

		// Have to use synchronous request here and as such can't use html5
		// response types.  Thanks for nothing W3C.
		jjvm.ui.JJVM.console.info("Downloading " + className);
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "/rt/" + className.replace(/\./g, "/") + ".json", false);
		xhr.send();

		if(xhr.status == 200) {
			var bytes = JSON.parse(xhr.responseText);

			var compiler = new jjvm.compiler.Compiler();
			compiler.compileSystemBytes(bytes);
		}

		for(var n = 0; n < jjvm.core.SystemClassLoader._classes.length; n++) {
			if(jjvm.core.SystemClassLoader._classes[n].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[n];
			}
		}

		throw "NoClassDefFound: " + className;
	}
};
