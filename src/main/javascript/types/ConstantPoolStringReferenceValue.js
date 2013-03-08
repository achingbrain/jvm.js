jjvm.types.ConstantPoolStringReferenceValue = function(index, constantPool) {
	var _objectRef = null;

	this.getValue = function() {
		if(!_objectRef) {
			var value = constantPool.load(index).getValue();

			_objectRef = jjvm.Util.createStringRef(value);
		}

		return _objectRef;
	};

	this.toString = function() {
		return "String			#" + index + ";	// " + constantPool.load(index).getValue();
	};
};
