jjvm.types.ConstantPool = function() {
	var _classDef;
	var pool = [];

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.store = function(index, value) {
		pool[index] = value;
	};

	this.load = function(index) {
		return pool[index];
	};

	this.getPool = function() {
		return pool;
	};

	this.toString = function() {
		return "ConstantPool" + (_classDef ? "#" + _classDef.getName() : "");
	};

	this.toJavaP = function() {
		var output = "\tConstant pool:\r\n";

		for(var i = 0; i < pool.length; i++) {
			if(!pool[i]) {
				continue;
			}

			output += "\tconst #" + i + "\t= " + pool[i] + "\r\n";
		}

		return output;
	};
};
