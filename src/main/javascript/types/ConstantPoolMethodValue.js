jjvm.types.ConstantPoolMethodValue = function(classIndex, nameAndTypeIndex, constantPool) {

	this.getValue = function() {
		return this.toString();
	};

	this.getMethodDef = function() {
		var classDef = constantPool.load(classIndex).getClassDef();
		var nameAndType = constantPool.load(nameAndTypeIndex);
		var methodName = nameAndType.getName();
		var type = nameAndType.getType();
		var args = jjvm.Util.parseArgs(type);

		return classDef.getMethod(methodName, args);
	};

	this.toString = function() {
		var className = constantPool.load(classIndex).getValue();
		var nameAndType = constantPool.load(nameAndTypeIndex);

		return "Method\t#" + classIndex + ".#" + nameAndTypeIndex + ";\t\t//\t" + className + "." + nameAndType.getName() + nameAndType.getType();
	};
};
