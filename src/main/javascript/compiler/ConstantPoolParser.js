jjvm.compiler.ConstantPoolParser = function() {

	this.parse = function(iterator) {
		var poolSize = iterator.readU16();
		var pool = new jjvm.types.ConstantPool();
		var table = new jjvm.core.ByteIterator(iterator.getIterable().subarray(10));

		var nameAndTypeValues = [];
		var classValues = [];
		var methodValues = [];
		var fieldValues = [];
		var stringReferenceValues = [];

		// pass 1, populate all primitive values
		for(var i = 1; i < poolSize; i++) {
			var tag = iterator.next();
			var value;

			if(tag == 0x01) {
				value = this._createStringValue(iterator, pool);
			} else if(tag == 0x03) {
				value = this._createIntValue(iterator, pool);
			} else if(tag == 0x04) {
				value =this._createFloatValue(iterator, pool);
			} else if(tag == 0x05) {
				value = this._createLongValue(iterator, pool);
			} else if(tag == 0x06) {
				value = this._createDoubleValue(iterator, pool);
			} else if(tag == 0x07) {
				value = this._createClassValue(iterator, pool);

				classValues.push(value);
			} else if(tag == 0x08) {
				value = this._createStringReferenceValue(iterator, pool);

				stringReferenceValues.push(value);
			} else if(tag == 0x09) {
				value = this._createFieldValue(iterator, pool);

				fieldValues.push(value);
			} else if(tag == 0x0A || tag == 0x0B) {
				value = this._createMethodValue(iterator, pool);

				methodValues.push(value);
			} else if(tag == 0x0C) {
				value = this._createNameAndTypeValue(iterator, pool);

				nameAndTypeValues.push(value);
			} else {
				throw "ConstantPoolParser cannot parse " + tag;
			}

			value.setIndex(i);

			pool.store(i, value);

			if(tag == 0x05 || tag == 0x06) {
				// longs and doubles take two slots in the table
				i++;
			}
		}

		// pass 2, populate all complex values
		_.each(nameAndTypeValues, _.bind(function(nameAndTypeValue) {
			this._populateNameAndTypeValue(nameAndTypeValue, pool);
		}, this));

		_.each(classValues, _.bind(function(classValue) {
			this._populateClassValue(classValue, pool);
		}, this));

		_.each(methodValues, _.bind(function(methodValue) {
			this._populateMethodValue(methodValue, pool);
		}, this));

		_.each(fieldValues, _.bind(function(fieldValue) {
			this._populateFieldValue(fieldValue, pool);
		}, this));

		_.each(stringReferenceValues, _.bind(function(stringReferenceValue) {
			this._populateStringReferenceValue(stringReferenceValue, pool);
		}, this));

		return pool;
	};

	this._createStringValue = function(iterator) {
		var length = iterator.readU16();
		var stringValue = "";

		for(var n = 0; n < length; n++) {
			stringValue += String.fromCharCode(parseInt(iterator.next(), 10));
		}

		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.S);
		value.setValue(stringValue);

		return value;
	};

	this._createIntValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.I);
		value.setValue(iterator.read32());

		return value;
	};

	this._createFloatValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.F);
		value.setValue(iterator.readFloat());

		return value;
	};

	this._createLongValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.J);
		value.setValue(iterator.read64());

		return value;
	};

	this._createDoubleValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.D);
		value.setValue(iterator.readDouble());

		return value;
	};

	this._createClassValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolClassValue();
		value.setClassIndex(iterator.readU16());

		return value;
	};

	this._populateClassValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();

		value.setValue(className);
	};

	this._createStringReferenceValue = function(iterator) {
		var stringIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolStringReferenceValue();
		value.setStringIndex(stringIndex);

		return value;
	};

	this._populateStringReferenceValue = function(value, constantPool) {
		var string = constantPool.load(value.getStringIndex()).getValue();

		value.setValue(string);
	};

	this._createFieldValue = function(iterator) {
		var classIndex = iterator.readU16();
		var nameAndTypeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolFieldValue();
		value.setClassIndex(classIndex);
		value.setNameAndTypeIndex(nameAndTypeIndex);

		return value;
	};

	this._populateFieldValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();
		var nameAndType = constantPool.load(value.getNameAndTypeIndex());

		value.setClassName(className);
		value.setFieldName(nameAndType.getName());
		value.setFieldType(nameAndType.getNameType());
	};

	this._createMethodValue = function(iterator) {
		var classIndex = iterator.readU16();
		var nameAndTypeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolMethodValue();
		value.setClassIndex(classIndex);
		value.setNameAndTypeIndex(nameAndTypeIndex);

		return value;
	};

	this._populateMethodValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();
		var nameAndType = constantPool.load(value.getNameAndTypeIndex());

		value.setClassName(className);
		value.setMethodName(nameAndType.getName());
		value.setMethodType(nameAndType.getNameType());
	};

	this._createNameAndTypeValue = function(iterator) {
		var nameIndex = iterator.readU16();
		var typeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolNameAndTypeValue();
		value.setNameIndex(nameIndex);
		value.setNameTypeIndex(typeIndex);

		return value;
	};

	this._populateNameAndTypeValue = function(value, constantPool) {
		var name = constantPool.load(value.getNameIndex()).getValue();
		var type = constantPool.load(value.getNameTypeIndex()).getValue();

		value.setName(name);
		value.setNameType(type);
	};

	this.toString = function() {
		return "ConstantPoolParser";
	};
};
