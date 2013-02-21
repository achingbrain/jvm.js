LocalVariables = function(args) {

	this.store = function(index, value) {
		args[index] = value;
	};

	this.load = function(index) {
		return args[index];
	};

	this.getLocalVariables = function(index) {
		return args;
	};
};
