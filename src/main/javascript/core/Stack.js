Stack = function() {
	var _stack = [];

	this.push = function(value) {
		_stack.push(value);
	};

	this.pop = function() {
		return _stack.pop();
	};

	this.getStack = function() {
		return _stack;
	};
};
