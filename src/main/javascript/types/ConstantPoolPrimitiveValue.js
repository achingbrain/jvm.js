jjvm.types.ConstantPoolPrimitiveValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.getType = function() {
		var type = this.getData().type;

		if(jjvm.types.Primitives.jvmTypesToPrimitive[type]) {
			// convert I to int, Z to boolean, etc
			return jjvm.types.Primitives.jvmTypesToPrimitive[type];
		}

		return type;
	};

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
