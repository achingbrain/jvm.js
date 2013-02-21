SystemClassLoader = {
	_classes: [],

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < SystemClassLoader._classes.length; i++) {
			if(SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		// haven't seen this class before
		SystemClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return SystemClassLoader._classes;
	},

	loadClass: function(className) {
		for(var i = 0; i < SystemClassLoader._classes.length; i++) {
			if(SystemClassLoader._classes[i].getName() == className) {
				return SystemClassLoader._classes[i];
			}
		}

		throw "NoClassDefFound: " + className;
	}
};

(function() {
	// These are built in classes bundled with the JVM.  Declared here for compatibility..

	var object = new ClassDefinition("public", false, false, "java.lang.Object", null, []);
	object.addConstructor(new ConstructorDefinition("public", "Object", [], [], function() {
		// default initialiser
	}));
	SystemClassLoader.addClassDefinition(object);

	var printStream = new ClassDefinition("public", false, false, "java.io.PrintStream", "java.lang.Object", null, []);
	printStream.addMethod(new MethodDefinition("public", false, false, false, "void", "println", ["java.lang.String"], [], function(line) {
		jjvm._console.info(line);
	}));
	SystemClassLoader.addClassDefinition(printStream);

	var system = new ClassDefinition("public", false, false, "java.lang.System", "java.lang.Object", []);
	system.addField(new FieldDefinition("public", true, false, false, false, "java.io.PrintStream", "out"));
	system.setStaticField("out", new ObjectReference(printStream));
	SystemClassLoader.addClassDefinition(system);
})();