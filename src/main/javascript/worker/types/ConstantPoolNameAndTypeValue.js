jjvm.types.ConstantPoolNameAndTypeValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolNameAndTypeValue.type);

	this.getValue = function() {
		return this.getName() + ":" + this.getNameType();
	};

	this.setName = function(name) {
		this.getData().name = name;
	};

	this.getName = function() {
		return this.getData().name;
	};

	this.setNameIndex = function(nameIndex) {
		this.getData().nameIndex = nameIndex;
	};

	this.getNameIndex = function() {
		return this.getData().nameIndex;
	};

	this.setNameType = function(nameType) {
		this.getData().nameType = nameType;
	};

	this.getNameType = function() {
		return this.getData().nameType;
	};

	this.setNameTypeIndex = function(nameTypeIndex) {
		this.getData().nameTypeIndex = nameTypeIndex;
	};

	this.getNameTypeIndex = function() {
		return this.getData().nameTypeIndex;
	};

	this.toString = function() {
		return this.getType() + "\t#" + this.getNameIndex() + ":#" + this.getNameTypeIndex() + ";\t\t// " + this.getValue();
	};
};

jjvm.types.ConstantPoolNameAndTypeValue.type = "NameAndType";
