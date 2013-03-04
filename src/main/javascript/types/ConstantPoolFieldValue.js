jjvm.types.ConstantPoolFieldValue = function(classIndex, nameAndTypeIndex, constantPool) {

	this.getValue = function() {
		return this.toString();
	};

	this.getFieldDef = function() {
		var classDef = constantPool.load(classIndex).getClassDef();
		var nameAndType = constantPool.load(nameAndTypeIndex);
		var fieldName = nameAndType.getName();
		var fields = classDef.getFields();

		for(var i = 0; i < fields.length; i++) {
			if(fields[i].getName() == fieldName) {
				return fields[i];
			}
		}

		throw "Field " + fieldName + " not found on class " + classDef.getName();
	};

	this.toString = function() {
		var className = constantPool.load(classIndex).getValue();
		var nameAndType = constantPool.load(nameAndTypeIndex);

		return "Field\t\t#" + classIndex + ".#" + nameAndTypeIndex + ";\t//\t" + className + "." + nameAndType.getName() + ":" + nameAndType.getType();
	};
};
