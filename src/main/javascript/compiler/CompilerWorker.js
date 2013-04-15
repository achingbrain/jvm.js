
self.addEventListener("message", function(event) {
	new jjvm.compiler.CompilerWorker(event.data.bytes, event.data.isSystemClass);
}, false);

jjvm.core.NotificationCentre.register("onCompileWarning", function(event, message) {
	/*self.postMessage({
		notification: "onCompileWarning", 
		args: message
	});*/
});

jjvm.compiler.CompilerWorker = function(buffer, isSystemClass) {
	this._isClassFile = function(iterator) {
		var value = iterator.readU32();

		return value == 0xCAFEBABE;
	};

	var classDefinitionParser = new jjvm.compiler.ClassDefinitionParser();
	var bytes = new Uint8Array(buffer);
	var iterator = new jjvm.core.ByteIterator(bytes);

	if(!this._isClassFile(iterator)) {
		self.postMessage({
			notification: "onCompileFailed", 
			args: [file.name + " does not contain bytecode"]
		});

		return;
	}

	try {
		var classDef = classDefinitionParser.parse(iterator);

		self.postMessage({
			notification: "onDefined", 
			args: [classDef.getData()]
		});
		self.postMessage({
			notification: "onCompileSuccess", 
			args: [classDef.getData()]
		});
	} catch(error) {
		self.postMessage({
			notification: "onCompileError", 
			args: [error]
		});
	}
};
