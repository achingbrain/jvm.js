jjvm.core.SystemClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.SystemClassLoader);

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

		if(_.string.startsWith(className, "[")) {
			var clazz = new jjvm.types.ClassDefinition({
				getValue: function() {
					return className;
				}
			}, {
				getValue: function() {
					return "java.lang.Object";
				}
			});

			jjvm.core.SystemClassLoader.addClassDefinition(clazz);

			return clazz;
		}

		/*var cached = jjvm.core.ClassCache.load(className);

		if(cached) {
			jjvm.core.SystemClassLoader._classes.push(cached);

			return cached;
		}*/

		console.info("Downloading " + className);

		// Have to use synchronous request here and as such can't use html5
		// response types as they make the UI unresponsive even though
		// we're in a non-UI thread.  Thanks for nothing W3C.
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
	},

	getObjectRef: function() {
		if(!jjvm.core.SystemClassLoader._objectRef) {
			jjvm.core.SystemClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.SystemClassLoader._objectRef.getClass(), 
				jjvm.core.SystemClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, [])
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return jjvm.core.SystemClassLoader._objectRef;
	}
};
