jjvm.types.ConstantPoolFieldValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolFieldValue.type);

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

	this.setFieldName = function(fieldName) {
		this.getData().fieldName = fieldName;
	};

	this.getFieldName = function() {
		return this.getData().fieldName;
	};

	this.setFieldType = function(fieldType) {
		this.getData().fieldType = fieldType;
	};

	this.getFieldType = function() {
		return this.getData().fieldType;
	};

	this.getFieldDef = function() {
		var classDef = this.getClassDef();

		return classDef.getField(this.getFieldName());
	};

	this.getClassDef = function() {
		return jjvm.core.ClassLoader.loadClass(this.getClassName());
	};

	this.toString = function() {
		return this.getType() + "\t\t\t#" + this.getClassIndex() + ".#" + this.getNameAndTypeIndex() + ";\t// " + this.getClassName() + "." + this.getFieldName() + ":" + this.getFieldType();
	};
};

jjvm.types.ConstantPoolFieldValue.type = "Field";
