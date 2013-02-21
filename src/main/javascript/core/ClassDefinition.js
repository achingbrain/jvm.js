function ClassDefinition(visibility, isAbstract, isFinal, name, parent, interfaces) {
	var _name = _.str.trim(name);
	var _parent = parent;
	var _interfaces = interfaces ? interfaces : [];
	var _constructors = [];
	var _methods = [];
	var _fields = [];
	var _exceptionTable;

	// holds values of static fields
	var _staticFields = {};

	this.getName = function() {
		return _name;
	};

	this.getParent = function() {
		return _parent;
	};

	this.isAbstract = function() {
		return isAbstract;
	};

	this.isFinal = function() {
		return isFinal;
	};

	this.getInterfaces = function() {
		return _interfaces;
	};

	this.getConstructors = function() {
		return _constructors;
	};

	this.getConstructor = function(args) {
		var array_match = function(arr1, arr2) {
			if(arr1.length != arr2.length) {
				return false;
			}

			for(var i = 0; i < arr1.length; i++) {
				if(arr1[i] !== arr2[i]) {
					return false;
				}
			}

			return true;
		};

		for(var n = 0; n < _constructors.length; n++) {
			if(array_match(_constructors[n].getArgs(), args)) {
				return _constructors[n];
			}
		}

		if(_parent !== null) {
			return _parent.getConstructor(args);
		}

		throw "Constructor with args " + args + " does not exist on class " + this.getName();
	};

	this.addConstructor = function(constructorDef) {
		_constructors.push(constructorDef);
	};

	this.getMethods = function() {
		return _methods;
	};

	this.getMethod = function(name) {
		for(var i = 0; i < _methods.length; i++) {
			if(_methods[i].getName() == name) {
				return _methods[i];
			}
		}

		if(_parent !== null) {
			return _parent.getMethod(name);
		}

		throw "Method " + name + " does not exist on class " + this.getName();
	};

	this.addMethod = function(methodDef) {
		_methods.push(methodDef);
	};

	this.getFields = function() {
		return _fields;
	};

	this.addField = function(fieldDef) {
		_fields.push(fieldDef);
	};

	this.invokeStaticMethod = function(name, args) {
		
	};

	this.getStaticField = function(name) {
		this._hasStaticField(name);

		return _staticFields[name];
	};

	this.setStaticField = function(name, value) {
		this._hasStaticField(name);

		_staticFields[name] = value;
	};

	this._hasStaticField = function(name) {
		var foundField = false;

		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name && _fields[i].isStatic()) {
				foundField = true;
			}
		}

		if(!foundField) {
			throw "field " + name + " does not exist on class " + this.getName();
		}
	};

	this.setExceptionTable = function(exceptionTable) {
		this._exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return this._exceptionTable;
	};

	this.toString = function() {
		return "ClassDef#" + this.getName();
	};
}
