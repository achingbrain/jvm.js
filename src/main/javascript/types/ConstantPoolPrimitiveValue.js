jjvm.types.ConstantPoolPrimitiveValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	if(data) {
		this.setType(jjvm.types.Primitives.jvmTypesToPrimitive[data.type]);
	}

	this.toString = function() {
		return this.getType() + "\t\t\t// " + this.getValue() + ";";
	};
};

jjvm.types.ConstantPoolPrimitiveValue.types = {
	S: "Utf8",
	I: "int",
	F: "float",
	J: "long",
	D: "double"
};
