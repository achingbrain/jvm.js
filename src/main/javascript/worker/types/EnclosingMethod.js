jjvm.types.EnclosingMethod = function(data) {
	var _data = data ? data : {};

	this.setClassName = function(className) {
		_data.className = className;
	};

	this.getClassName = function() {
		return _data.className;
	};

	this.setMethodName = function() {
		return _data.methodName;
	};

	this.getMethodName = function(methodName) {
		_data.methodName = methodName;
	};

	this.getData = function() {
		return _data;	
	};

	this.toJavaP = function() {
		var output = "\t\tEnclosingMethod:\r\n";
		output += "\t\t\t" + this.getClassName() + "." + this.getMethodName();

		return output;
	};

	this.toString = function() {
		return "EnclosingMethod";
	};
};
