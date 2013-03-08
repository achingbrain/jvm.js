jjvm.types.ConstantPoolValue = function(type, value, constantPool) {

	this.getValue = function() {
		return value;
	};

	this.getType = function() {
		return type;
	};

	this.getTypeName = function() {
		if(value.length > 1) {
			// returns an object type, remove the L and ;
			return value.substring(1, value.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives.jvmTypesToPrimitive[value]) {
			// convert I to int, Z to boolean, etc
			return jjvm.types.Primitives.jvmTypesToPrimitive[value];
		}

		return value;
	};

	this.toString = function() {
		return type + "\t\t" + value + ";";
	};
};
