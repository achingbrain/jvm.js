jjvm.compiler.ConstantPoolParser = function() {

	this.parse = function(iterator) {
		var poolSize = iterator.readU16();

		var pool = new jjvm.types.ConstantPool();
		var table = new jjvm.core.ByteIterator(iterator.getIterable().subarray(10));

		for(var i = 1; i < poolSize; i++) {
			var tag = iterator.next();

			if(tag == 0x01) {
				var length = iterator.readU16();
				var value = "";

				for(var n = 0; n < length; n++) {
					value += String.fromCharCode(parseInt(iterator.next(), 10));
				}

				pool.store(i, new jjvm.types.ConstantPoolValue("Asciz", value, pool));
			} else if(tag == 0x03) {
				pool.store(i, new jjvm.types.ConstantPoolValue("int", iterator.readU32(), pool));
			} else if(tag == 0x04) {
				pool.store(i, new jjvm.types.ConstantPoolValue("float", iterator.readFloat(), pool));
			} else if(tag == 0x05) {
				pool.store(i, new jjvm.types.ConstantPoolValue("long", iterator.readU64(), pool));
			} else if(tag == 0x06) {
				pool.store(i, new jjvm.types.ConstantPoolValue("double", iterator.readDouble(), pool));
			} else if(tag == 0x07) {
				pool.store(i, new jjvm.types.ConstantPoolClassValue(iterator.readU16(), pool));
			} else if(tag == 0x08) {
				pool.store(i, new jjvm.types.ConstantPoolStringReferenceValue(iterator.readU16(), pool));
			} else if(tag == 0x09) {
				pool.store(i, new jjvm.types.ConstantPoolFieldValue(iterator.readU16(), iterator.readU16(), pool));
			} else if(tag == 0x0A) {
				pool.store(i, new jjvm.types.ConstantPoolMethodValue(iterator.readU16(), iterator.readU16(), pool));
			} else if(tag == 0x0B) {
				pool.store(i, new jjvm.types.ConstantPoolMethodValue(iterator.readU16(), iterator.readU16(), pool));
			} else if(tag == 0x0C) {
				pool.store(i, new jjvm.types.ConstantPoolNameAndTypeValue(iterator.readU16(), iterator.readU16(), pool));
			} else {
				throw "ConstantPoolParser cannot parse " + tag;
			}

			if(tag == 0x05 || tag == 0x06) {
				// longs and doubles take two slots in the table
				i++;
			}
		}

		return pool;
	};

	this.toString = function() {
		return "ConstantPoolParser";
	};
};
