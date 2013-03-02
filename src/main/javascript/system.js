
(function() {
	// These are built in classes bundled with the JVM.  Declared here for compatibility..

	var object = new jjvm.types.ClassDefinition("public", false, false, "java.lang.Object", null, []);
	object.addMethod(new jjvm.types.MethodDefinition("public", false, false, false, null, "<init>", [], [], function() {
		// default initialiser
	}));
	jjvm.core.SystemClassLoader.addClassDefinition(object);

	var printStream = new jjvm.types.ClassDefinition("public", false, false, "java.io.PrintStream", "java.lang.Object", null, []);
	printStream.addMethod(new jjvm.types.MethodDefinition("public", false, false, false, "void", "println", ["java.lang.String"], [], function(line) {
		jjvm._console.info(line);
	}));
	jjvm.core.SystemClassLoader.addClassDefinition(printStream);

	var system = new jjvm.types.ClassDefinition("public", false, false, "java.lang.System", "java.lang.Object", []);
	system.addField(new jjvm.types.FieldDefinition("public", true, false, false, false, "java.io.PrintStream", "out"));
	system.setStaticField("out", new jjvm.runtime.ObjectReference(printStream));
	jjvm.core.SystemClassLoader.addClassDefinition(system);
})();
