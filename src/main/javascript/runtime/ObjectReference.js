jjvm.runtime.ObjectReference = function(classDef) {
	var _fields = {};
	var _values = {};

	this.getClass = function() {
		return classDef;
	};

	this.invoke = function(methodName, args) {

	};

	this.getField = function(name) {
		//this._hasField(name);

		return _fields[name];
	};

	this.setField = function(name, value) {
		//this._hasField(name);

		_fields[name] = value;
	};

	this._hasField = function(name) {
		var foundField = false;

		for(var i = 0; i < this.getClass().getFields().length; i++) {
			var field = this.getClass().getFields()[i];

			if(field.getName() == name && !field.isStatic()) {
				foundField = true;
			}
		}

		if(!foundField) {
			throw "field " + name + " does not exist on class " + this.getClass().getName();
		}
	};

	this.toString = function() {
		return "ObjectReference#" + classDef.getName();
	};
};
