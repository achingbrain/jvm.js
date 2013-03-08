jjvm.types.EnclosingMethod = function(className, methodName) {

	this.toJavaP = function() {
		var output = "\t\tEnclosingMethod:\r\n";
		output += "\t\t\t" + className + methodName;

		return output;
	};

	this.toString = function() {
		return "EnclosingMethod";
	};
};
