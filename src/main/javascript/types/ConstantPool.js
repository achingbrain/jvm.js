jjvm.types.ConstantPool = function(data) {
	var _data = data ? data : {};
	var pool = [];

	if(_data.constants) {
		for(var i = 0; i < _data.constants.length; i++) {
			var value;

			if(_data.constants[i].type == jjvm.types.ConstantPoolClassValue.type) {
				value = new jjvm.types.ConstantPoolClassValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolFieldValue.type) {
				value = new jjvm.types.ConstantPoolFieldValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolMethodValue.type) {
				value = new jjvm.types.ConstantPoolMethodValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolNameAndTypeValue.type) {
				value = new jjvm.types.ConstantPoolNameAndTypeValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.S || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.I || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.F || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.J || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.D) {
				value = new jjvm.types.ConstantPoolPrimitiveValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolStringReferenceValue.type) {
				value = new jjvm.types.ConstantPoolStringReferenceValue(_data.constants[i]);
			}

			pool[value.getIndex()] = value;
		}
	} else {
		_data.constants = [];
	}

	this.store = function(index, value) {
		pool[index] = value;

		for(var i = 0; i < _data.constants.length; i++) {
			if(_data.constants[i].index == index) {
				// we've defined this constant before, overwrite it
				_data.constants[i] = value.getData();

				return;
			}
		}

		// this is a new constant, store it
		_data.constants.push(value.getData());
	};

	this.load = function(index) {
		return pool[index];
	};

	this.getPool = function() {
		return pool;
	};

	this.toString = function() {
		return "ConstantPool";
	};

	this.getData = function() {
		return _data;
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
