jjvm.types.ConstantPoolValue = function(type, value, constantPool) {

	this.getValue = function() {
		return value;
	};

	this.toString = function() {
		return type + "	" + value + ";";
	};
};
