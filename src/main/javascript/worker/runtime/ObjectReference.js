jjvm.runtime.ObjectReference = function(classDef) {
	var _fields = {};
	var _index = jjvm.runtime.ObjectReference.index++;

	this.getClass = function() {
		return classDef;
	};

	this.invoke = function(methodName, args) {

	};

	this.getField = function(name) {
		this._hasField(name);

		if(_fields[name] === undefined) {
			// we have the field but it's not been used yet so initialise it.

			var fieldDef = this.getClass().getField(name);

			if(fieldDef.getType() == "boolean" || fieldDef.getType() == "byte" || fieldDef.getType() == "short" || fieldDef.getType() == "int" || fieldDef.getType() == "long" || fieldDef.getType() == "char") {
				_fields[name] = 0;
			} else if(fieldDef.getType() == "float" || fieldDef.getType() == "double") {
				_fields[name] = 0.0;
			} else if(fieldDef.getType() == "boolean") {
				_fields[name] = false;
			} else {
				_fields[name] = null;				
			}
		}

		return _fields[name];
	};

	this.getFields = function() {
		return _fields;
	};

	this.setField = function(name, value) {
		this._hasField(name);

		_fields[name] = value;
	};

	this._hasField = function(name) {
		if(!this.getClass().hasField(name)) {
			throw "field " + name + " does not exist on class " + this.getClass().getName();
		}
	};

	this.isInstanceOf = function(classDef) {
		return this.getClass().isChildOf(classDef);
	};

	this.getIndex = function() {
		return _index;
	};

	this.toString = function() {
		return "ObjectReference #" + this.getIndex() + " " + classDef.getName();
	};
};

jjvm.runtime.ObjectReference.index = 0;
