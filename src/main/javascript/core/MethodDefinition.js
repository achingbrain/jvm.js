function MethodDefinition(visibility, isStatic, isFinal, isSynchronized, returns, name, args, instructions, implementation) {
	var _visibility = _.str.trim(visibility ? visibility : "public");
	var _isStatic = isStatic ? true : false;
	var _isFinal = isFinal ? true : false;
	var _isSynchronized = isSynchronized ? true : false;
	var _name = _.str.trim(name);
	var _args = args ? args : [];
	var _returns = _.str.trim(returns ? returns : "void");
	var _instructions = instructions ? instructions : [];
	var _implementation = implementation;

	this.getVisibility = function() {
		return _visibility;
	};

	this.isStatic = function() {
		return _isStatic;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.isSynchronized = function() {
		return _isSynchronized;
	};

	this.getName = function() {
		return _name;
	};

	this.getArgs = function() {
		return _args;
	};

	this.getReturns = function() {
		return _returns;
	};

	this.getInstructions = function() {
		return _instructions;
	};

	this.getImplementation = function() {
		return _implementation;
	};
}
