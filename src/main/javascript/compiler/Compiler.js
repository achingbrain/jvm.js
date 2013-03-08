jjvm.compiler.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.ClassDefinitionParser();

	// takes a File or Blob object
	this.compile = function(file, synchronous) {
		var reader = new FileReader();
	
		// init the reader event handlers
		reader.onload = _.bind(this._onLoad, this, file);

		// begin the read operation
		reader.readAsArrayBuffer(file);
	};

	this._onLoad = function(file, event) {
		this.compileBytes(event.target.result);
	};

	this.compileSystemBytes = function(buffer) {
		this._compileBytes(buffer, true);
	};

	this.compileBytes = function(buffer) {
		this._compileBytes(buffer);
	};

	this._compileBytes = function(buffer, isSystemClass) {
		/*var worker = new Worker("/js/jjvm_compiler_worker.js");
		worker.onmessage = function(event) {
			console.log("Worker said : " + event.data);
		};
		worker.postMessage({
			bytes: buffer,
			isSystemClass: isSystemClass
		});*/

		try {
			var bytes = new Uint8Array(buffer);
			var iterator = new jjvm.core.ByteIterator(bytes);

			if(!this._isClassFile(iterator)) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["No bytecode found"]);

				return;
			}

			var classDef = classDefinitionParser.parse(iterator);

			if(isSystemClass) {
				jjvm.core.SystemClassLoader.addClassDefinition(classDef);
			} else {
				jjvm.core.ClassLoader.addClassDefinition(classDef);
			}

			jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef, isSystemClass]);
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
