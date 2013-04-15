jjvm.compiler.Parser = function() {

	this._loadClassName = function(iterator, constantPool) {
		var string = this._loadString(iterator, constantPool);

		if(jjvm.types.Primitives.jvmTypesToPrimitive[string]) {
			return jjvm.types.Primitives.jvmTypesToPrimitive[string];
		}

		if(string) {
			return string.replace(/\//g, ".");
		}

		return undefined;
	};

	this._loadString = function(iterator, constantPool) {
		var index = iterator.readU16();

		if(index > 0) {
			return constantPool.load(index).getValue();
		}

		return undefined;
	};
};
