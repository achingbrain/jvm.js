jjvm.types.ConstantPoolNameAndTypeValue = function(nameIndex, typeIndex, constantPool) {

	this.getValue = function() {
		return this.getName() + ":" + typeIndex;
	};

	this.getName = function() {
		return constantPool.load(nameIndex).getValue();
	};

	this.getType = function() {
		return constantPool.load(typeIndex).getValue();
	};

	this.toString = function() {
		return "NameAndType	#" + nameIndex + ":#" + typeIndex + ";	// " + this.getValue();
	};
};
