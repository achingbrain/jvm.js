jjvm.compiler.bytecode.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.bytecode.ClassDefinitionParser();

	// takes a File object
	this.compile = function(file) {
		var reader = new FileReader();
 
		// init the reader event handlers
		reader.onload = _.bind(this._onLoad, this, file);

		jjvm.core.NotificationCentre.dispatch(this, "onCompileStart");

		// begin the read operation
		reader.readAsArrayBuffer(file);
	};

	this._onLoad = function(file, event) {
		try {
			var buffer = event.target.result;
			var bytes = new Uint8Array(buffer);
			var iterator = new jjvm.core.ByteIterator(bytes);

			if(!this._isClassFile(iterator)) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileFailed", file.name + " does not contain bytecode");

				return;
			}

			var classDef = classDefinitionParser.parse(iterator);

			jjvm.core.ClassLoader.addClassDefinition(classDef);

			jjvm.core.NotificationCentre.dispatch(this, "onDefined", classDef);
			jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};

	this._isClassFile = function(iterator) {
		var value = iterator.readU32();

		return value == 0xCAFEBABE;
	};
};
