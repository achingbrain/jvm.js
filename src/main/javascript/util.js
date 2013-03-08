
jjvm.Util = {
	createStringRef: function(string) {
		var chars = string.split("");

		return jjvm.Util.createObjectRef("java.lang.String", ["char[]"], [chars]);
	},

	createObjectRef: function(className, constructorSignature, constructorArgs) {
		var classDef = jjvm.core.ClassLoader.loadClass(className);
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		if(constructorArgs) {
			constructorArgs.unshift(objectRef);
		} else {
			constructorArgs = [objectRef];
		}

		var frame = new jjvm.runtime.Frame(classDef, classDef.getMethod("<init>", constructorSignature), constructorArgs);
		frame.setIsSystemFrame(true);
		var thread = new jjvm.runtime.Thread(frame);
		thread.run();
		jjvm.runtime.ThreadPool.reap();

		return objectRef;
	},

	parseArgs: function(string) {
		var args = [];
		var iterator = new jjvm.core.Iterator(string.split(""));

		while(iterator.hasNext()) {
			var character = iterator.peek();

			if(character == "(") {
				// discard (
				iterator.next();
				continue;
			}

			if(character == ")") {
				break;
			}

			if(character == "L") {
				args.push(jjvm.Util._readObjectArgument(iterator));
			} else if(character == "[") {
				args.push(jjvm.Util._readArrayArgument(iterator));
			} else {
				var primitive = jjvm.Util._readPrimitiveArgument(iterator);

				if(primitive) {
					args.push(primitive);
				}
			}
		}

		return args;
	},

	_readPrimitiveArgument: function(iterator) {
		var character = iterator.next();

		return jjvm.types.Primitives.jvmTypesToPrimitive[character];
	},

	_readObjectArgument: function(iterator) {
		// discard L
		iterator.next();
		var className = "";

		while(true) {
			var classNameCharacter = iterator.next();

			if(classNameCharacter == ";") {
				className = className.replace(/\//g, ".");

				return className;
			} else {
				className += classNameCharacter;
			}
		}
	},

	_readArrayArgument: function(iterator) {
		// discard [
		iterator.next();

		var character = iterator.peek();

		if(character == "L") {
			return jjvm.Util._readObjectArgument(iterator) + "[]";
		} else {
			return jjvm.Util._readPrimitiveArgument(iterator) + "[]";
		}
	}
};
