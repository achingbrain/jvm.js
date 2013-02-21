function ConstructorDefinition(visibility, name, args, instructions, implementation) {
	var _visibility = _.str.trim(visibility);
	var _name = _.str.trim(name);
	var _args = args;
	var _instructions = instructions;
	var _implementation = implementation;

	this.getVisibility = function() {
		return _visibility;
	};

	this.getName = function() {
		return _name;
	};

	this.getArgs = function() {
		return _args;
	};

	this.getInstructions = function() {
		return _instructions;
	};

	this.getImplementation = function() {
		return _implementation;
	};
}
