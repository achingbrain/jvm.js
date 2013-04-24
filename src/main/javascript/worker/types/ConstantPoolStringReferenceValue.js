jjvm.types.ConstantPoolStringReferenceValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolStringReferenceValue.type);

	// holds the string reference
	var _objectRef = null;

	this.setStringIndex = function(stringIndex) {
		this.getData().stringIndex = stringIndex;
	};

	this.getStringIndex = function() {
		return this.getData().stringIndex;
	};

	this.getStringReference = function() {
		if(!_objectRef) {
			_objectRef = jjvm.Util.createStringRef(this.getValue());
		}

		return _objectRef;
	};

	this.toString = function() {
		return this.getType() + "\t\t#" + this.getStringIndex() + ";\t\t// " + this.getValue();
	};
};

jjvm.types.ConstantPoolStringReferenceValue.type = "String";
