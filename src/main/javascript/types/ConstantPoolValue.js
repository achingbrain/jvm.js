jjvm.types.ConstantPoolValue = function(data) {
	var _data = data ? data : {};

	this.setValue = function(value) {
		_data.value = value;
	};

	this.getValue = function() {
		return _data.value;
	};

	this.setType = function(type) {
		_data.type = type;
	};

	this.getType = function() {
		return _data.type;
	};

	this.setIndex = function(index) {
		_data.index = index;
	};

	this.getIndex = function() {
		return _data.index;
	};

	this.getData = function() {
		return _data;
	};
};
