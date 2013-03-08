jjvm.runtime.LocalVariables = function(args) {
	var _args = [].concat(args);

	this.store = function(index, value) {
		_args[index] = value;
	};

	this.load = function(index) {
		return _args[index];
	};

	this.getLocalVariables = function(index) {
		return _args;
	};
};
