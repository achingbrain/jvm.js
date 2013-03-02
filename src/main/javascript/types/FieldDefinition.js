jjvm.types.FieldDefinition = function(visibility, isStatic, isFinal, isVolatile, isTransient, type, name) {
	var _visibility = _.str.trim(visibility);
	var _isStatic = isStatic;
	var _isFinal = isFinal;
	var _isVolatile = isVolatile;
	var _isTransient = isTransient;
	var _type = _.str.trim(type);
	var _name = _.str.trim(name);
	var _deprecated = false;
	var _synthetic = false;

	this.getVisibility = function() {
		return _visibility;
	};

	this.isStatic = function() {
		return _isStatic;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.isVolatile = function() {
		return _isVolatile;
	};

	this.isTransient = function() {
		return _isTransient;
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
};
