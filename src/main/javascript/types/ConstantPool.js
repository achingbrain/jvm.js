jjvm.types.ConstantPool = function() {
	var pool = [];

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
		var output = "";

		for(var i = 0; i < pool.length; i++) {
			if(!pool[i]) {
				continue;
			}

			try {
			output += "const #" + i + " = " + pool[i] + "\r\n";
		} catch(e) {
console.error(e);
		}
		}

		return output;
	};
};
