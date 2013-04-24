jjvm.types.ConstantPoolClassValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolClassValue.type);

	this.getClassDef = function() {
		var className = this.getValue();
		className = className.replace(/\//g, ".");

		return jjvm.core.ClassLoader.loadClass(className);
	};

	this.setClassIndex = function(classIndex) {
		this.getData().classIndex = classIndex;
	};

	this.getClassIndex = function() {
		return this.getData().classIndex;
	};

	this.toString = function() {
		return this.getType() + "\t\t\t#" + this.getClassIndex() + ";\t\t// " + this.getValue();
	};
};

jjvm.types.ConstantPoolClassValue.type = "class";