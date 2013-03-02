jjvm.types.ConstantPoolMethodValue = function(classIndex, nameAndTypeIndex, constantPool) {

	this.getValue = function() {
		return this.toString();
	};

	this.getMethodDef = function() {
		var classDef = constantPool.load(classIndex).getClassDef();
		var nameAndType = constantPool.load(nameAndTypeIndex);
		var methodName = nameAndType.getName();
		var methods = classDef.getMethods();

		for(var i = 0; i < methods.length; i++) {
			if(methods[i].getName() == methodName) {
				return methods[i];
			}
		}

		throw "Method " + methodName + " not found on class " + classDef.getName();
	};

	this.toString = function() {
		var className = constantPool.load(classIndex).getValue();
		var nameAndType = constantPool.load(nameAndTypeIndex);

		return "Method	#" + classIndex + ".#" + nameAndTypeIndex + ";	//	" + className + "." + nameAndType.getName() + nameAndType.getType();
	};
};
