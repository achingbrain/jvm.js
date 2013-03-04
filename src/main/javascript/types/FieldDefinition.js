jjvm.types.FieldDefinition = function(name, type, classDef) {
	var _visibility = "package";
	var _isStatic = false;
	var _isFinal = false;
	var _isVolatile = false;
	var _isTransient = false;
	var _type = _.str.trim(type);
	var _name = _.str.trim(name);
	var _deprecated = false;
	var _synthetic = false;
	var _constantValue = null;
	var _classDef = classDef;

	this.getVisibility = function() {
		return _visibility;
	};

	this.setVisibility = function(visibility) {
		_visibility = visibility;
	};

	this.isStatic = function() {
		return _isStatic;
	};

	this.setIsStatic = function(isStatic) {
		_isStatic = isStatic;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.setIsFinal = function(isFinal) {
		_isFinal = isFinal;
	};

	this.isVolatile = function() {
		return _isVolatile;
	};

	this.setIsVolatile = function(isVolatile) {
		_isVolatile = isVolatile;
	};

	this.isTransient = function() {
		return _isTransient;
	};

	this.setIsTransient = function(isTransient) {
		_isTransient = isTransient;
	};

	this.getType = function() {
		return _type;
	};

	this.getName = function() {
		return _name;
	};

	this.setDeprecated = function(deprecated) {
		_deprecated = deprecated;
	};

	this.getDeprecated = function() {
		return _deprecated;
	};

	this.setSynthetic = function(synthetic) {
		_synthetic = synthetic;
	};

	this.getSynthetic = function() {
		return _synthetic;
	};

	this.setConstantValue = function(constantValue) {
		_constantValue = constantValue;
	};

	this.getConstantValue = function() {
		return _constantValue;
	};

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.getClassDef = function() {
		return _classDef;
	};


	this.toJavaP = function() {
		var output = _visibility;
		output += _isStatic ? " static" : "";
		output += _isFinal ? " final" : "";
		output += _isVolatile ? " volatile" : "";
		output += _isTransient ? " transient" : "";
		output += " " + _type + " " + _name + ");\r\n";

		return output;
	};

	this.toString = function() {
		return "Field#" + this.getName();
	};
};
