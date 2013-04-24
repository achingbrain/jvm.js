jjvm.types.FieldDefinition = function(data) {
	// will be serialized to JSON so don't put any functions in here...
	var _data = data ? data : {};

	this.getVisibility = function() {
		return _data.visibility ? _data.visibility : "package";
	};

	this.setVisibility = function(visibility) {
		_data.visibility = _.string.trim(visibility);
	};

	this.isStatic = function() {
		return _data.isStatic ? true : false;
	};

	this.setIsStatic = function(isStatic) {
		_data.isStatic = isStatic ? true : false;
	};

	this.isFinal = function() {
		return _data.isFinal ? true : false;
	};

	this.setIsFinal = function(isFinal) {
		_data.isFinal = isFinal ? true : false;
	};

	this.isVolatile = function() {
		return _data.isVolatile ? true : false;
	};

	this.setIsVolatile = function(isVolatile) {
		_data.isVolatile = isVolatile ? true : false;
	};

	this.isTransient = function() {
		return _data.isTransient ? true : false;
	};

	this.setIsTransient = function(isTransient) {
		_data.isTransient = isTransient ? true : false;
	};

	this.setType = function(type) {
		_data.type = _.str.trim(type);
	};

	this.getType = function() {
		return _data.type;
	};

	this.setName = function(name) {
		_data.name = _.str.trim(name);
	};

	this.getName = function() {
		return _data.name;
	};

	this.setDeprecated = function(isDeprecated) {
		_data.isDeprecated = isDeprecated ? true : false;
	};

	this.isDeprecated = function() {
		return _data.isDeprecated ? true : false;
	};

	this.setSynthetic = function(isSynthetic) {
		_data.isSynthetic = isSynthetic ? true : false;
	};

	this.isSynthetic = function() {
		return _data.isSynthetic ? true : false;
	};

	this.setConstantValue = function(constantValue) {
		_data.constantValue = constantValue;
	};

	this.getConstantValue = function() {
		return _data.constantValue;
	};

	this.getData = function() {
		return _data;
	};

	this.toJavaP = function() {
		var output = this.getVisibility();
		output += this.isStatic() ? " static" : "";
		output += this.isFinal() ? " final" : "";
		output += this.isVolatile() ? " volatile" : "";
		output += this.isTransient() ? " transient" : "";
		output += " " + this.getType() + " " + this.getName() + ");\r\n";

		return output;
	};

	this.toString = function() {
		return "Field#" + this.getName();
	};
};
