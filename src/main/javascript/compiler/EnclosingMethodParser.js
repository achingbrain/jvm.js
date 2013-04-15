jjvm.compiler.EnclosingMethodParser = function() {

	this.parse = function(iterator, constantsPool) {
		var classEntry = this._loadEntry(iterator, constantsPool);
		var methodEntry = this._loadEntry(iterator, constantsPool);

		var enclosingMethod = new jjvm.types.EnclosingMethod(classEntry, methodEntry);
		enclosingMethod.setClassName(classEntry);
		enclosingMethod.setMethodName(methodEntry);

		return enclosingMethod;
	};

	this._loadEntry = function(iterator, constantsPool) {
		var index = iterator.readU16();

		if(index !== 0) {
			return constantsPool.load(index);
		}
	};

	this.toString = function() {
		return "EnclosingMethodParser";
	};
};
