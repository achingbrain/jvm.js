
(function() {
	// These are built in classes bundled with the JVM.  Declared here for compatibility..

	var object = new jjvm.types.ClassDefinition(
		new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object"), 
		null
	);
	object.setVisibility("public");

	var objectInit = new jjvm.types.MethodDefinition("<init>", [], null, object);
	objectInit.setImplementation(function() {
		// default initialiser
	});
	object.addMethod(objectInit);
	jjvm.core.SystemClassLoader.addClassDefinition(object);

	var printStream = new jjvm.types.ClassDefinition(
		new jjvm.types.ConstantPoolValue("Asciz", "java.io.PrintStream"),
		new jjvm.types.ConstantPoolValue("Asciz", "java.lang.Object")
	);
	printStream.setVisibility("public");
	var printStreamPrintLn = new jjvm.types.MethodDefinition("println", ["java.lang.String"], "void", printStream);
	printStreamPrintLn.setImplementation(function(line) {
		jjvm.ui.JJVM.console.info(line);
	});
	printStream.addMethod(printStreamPrintLn);
	jjvm.core.SystemClassLoader.addClassDefinition(printStream);

	var system = new jjvm.types.ClassDefinition(
		new jjvm.types.ConstantPoolValue("Asciz", "java.lang.System"),
		new jjvm.types.ConstantPoolValue("Asciz", "java.lang.Object")
	);
	system.setVisibility("public");
	
	var systemOut = new jjvm.types.FieldDefinition("out", "java.io.PrintStream", system);
	systemOut.setIsStatic(true);
	system.addField(systemOut);

	system.setStaticField("out", new jjvm.runtime.ObjectReference(printStream));
	jjvm.core.SystemClassLoader.addClassDefinition(system);
})();
