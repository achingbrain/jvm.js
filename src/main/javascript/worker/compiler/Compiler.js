jjvm.compiler.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.ClassDefinitionParser();

	this.compileSystemBytes = function(buffer) {
		this._compileBytes(buffer, true);
	};

	this.compileBytes = function(buffer) {
		this._compileBytes(buffer);
	};

	this._compileBytes = function(buffer, isSystemClass) {
		try {
			if(!(buffer instanceof Uint8Array)) {
				buffer = new Uint8Array(buffer);				
			}

			var iterator = new jjvm.core.ByteIterator(buffer);

			if(!this._isClassFile(iterator)) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["No bytecode found"]);

				return;
			}

			var classDef = classDefinitionParser.parse(iterator);

			if(isSystemClass) {
				jjvm.core.SystemClassLoader.addClassDefinition(classDef);

				// jjvm.core.ClassCache.store(classDef);
			} else {
				jjvm.core.ClassLoader.addClassDefinition(classDef);
			}

			jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef.getData(), isSystemClass]);
			jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			console.error(error);

			jjvm.core.NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};

	this._isClassFile = function(iterator) {
		var value = iterator.readU32();

		return value == 0xCAFEBABE;
	};
};
