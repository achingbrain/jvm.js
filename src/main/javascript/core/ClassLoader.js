jjvm.core.ClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.ClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.ClassLoader);

		// haven't seen this class before
		jjvm.core.ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.ClassLoader._classes;
	},

	loadClass: function(className) {
		className = className.replace(/\//g, ".");

		var output;

		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == className) {
				output = jjvm.core.ClassLoader._classes[i];
				break;
			}
		}

		if(!output) {
			output = jjvm.core.SystemClassLoader.loadClass(className);
		}

		if(output.hasMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER) && !output.getInitialized()) {
			// has class initializer so execute it
			output.setInitialized(true);
			var frame = new jjvm.runtime.Frame(output, output.getMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER));
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return output;
	},

	getObjectRef: function() {
		if(!jjvm.core.ClassLoader._objectRef) {
			jjvm.core.ClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.ClassLoader._objectRef.getClass(), 
				jjvm.core.ClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, ["java.lang.ClassLoader"]), 
				[jjvm.core.SystemClassLoader.getObjectRef()]
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return jjvm.core.ClassLoader._objectRef;
	}
};