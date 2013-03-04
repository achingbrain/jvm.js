jjvm.types.ConstantPoolStringReferenceValue = function(index, constantPool) {

	this.getValue = function() {
		return constantPool.load(index).getValue();
	};

	this.toString = function() {
		return "String			#" + index + ";	// " + this.getValue();
	};
};
