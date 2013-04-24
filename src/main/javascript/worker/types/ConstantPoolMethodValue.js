jjvm.types.ConstantPoolMethodValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolMethodValue.type);

	this.setClassIndex = function(classIndex) {
		this.getData().classIndex = classIndex;
	};

	this.getClassIndex = function() {
		return this.getData().classIndex;
	};

	this.setNameAndTypeIndex = function(nameAndTypeIndex) {
		this.getData().nameAndTypeIndex = nameAndTypeIndex;
	};

	this.getNameAndTypeIndex = function() {
		return this.getData().nameAndTypeIndex;
	};

	this.setClassName = function(className) {
		this.getData().className = className;
	};

	this.getClassName = function() {
		return this.getData().className;
	};

	this.setMethodName = function(methodName) {
		this.getData().methodName = methodName;
	};

	this.getMethodName = function() {
		return this.getData().methodName;
	};

	this.setMethodType = function(methodType) {
		this.getData().methodType = methodType;
	};

	this.getMethodType = function() {
		return this.getData().methodType;
	};

	this.getMethodDef = function() {
		var classDef = jjvm.core.ClassLoader.loadClass(this.getClassName());
		var methodName = this.getMethodName();
		var type = this.getMethodType();
		var args = jjvm.Util.parseArgs(type);

		return classDef.getMethod(methodName, args);
	};

	this.toString = function() {
		return this.getType() + "\t\t#" + this.getClassIndex() + ".#" + this.getNameAndTypeIndex() + ";\t\t// " + this.getClassName() + "." + this.getMethodName() + this.getMethodType();
	};
};

jjvm.types.ConstantPoolMethodValue.type = "Method";
