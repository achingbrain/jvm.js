jjvm.types.ConstantPoolClassValue = function(index, constantPool) {

	this.getValue = function() {
		return constantPool.load(index).getValue();
	};

	this.getClassDef = function() {
		var className = this.getValue();
		className = className.replace(/\//g, ".");

		return jjvm.core.ClassLoader.loadClass(className);
	};

	this.toString = function() {
		return "class	#" + index + ";	// " + this.getValue();
	};
};
