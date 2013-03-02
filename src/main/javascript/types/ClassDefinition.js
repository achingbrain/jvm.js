jjvm.types.ClassDefinition = function(visibility, isAbstract, isFinal, name, parent, interfaces) {
	var _name = _.str.trim(name);
	var _parent = parent;
	var _interfaces = interfaces ? interfaces : [];
	var _methods = [];
	var _fields = [];
	var _exceptionTable;
	var _constantPool;
	var _sourceFile;
	var _minorVersion;
	var _majorVersion;
	var _deprecated = false;
	var _synthetic = false;

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
		_exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
	};

	this.setConstantPool = function(constantPool) {
		_constantPool = constantPool;
	};

	this.getConstantPool = function() {
		return _constantPool;
	};

	this.setSourceFile = function(sourceFile) {
		_sourceFile = sourceFile;
	};

	this.getSourceFile = function() {
		return _sourceFile;
	};

	this.setMinorVersion = function(minorVersion) {
		_minorVersion = minorVersion;
	};

	this.getMinorVersion = function() {
		return _minorVersion;
	};

	this.setMajorVersion = function(majorVersion) {
		_majorVersion = majorVersion;
	};

	this.getMajorVersion = function() {
		return _majorVersion;
	};

	this.setDeprecated = function(deprecated) {
		_deprecated = deprecated;
	};

	this.getDeprecated = function() {
		return _deprecated;
	};

	this.setSynthetic = function(synthetic) {
		_synthetic = synthetic;
	};

	this.getSynthetic = function() {
		return _synthetic;
	};

	this.getVersion = function() {
		var versions = {
			0x2D: "Java 1.1",
			0x2E: "Java 1.2",
			0x2F: "Java 1.3",
			0x30: "Java 1.4",
			0x31: "Java 5",
			0x32: "Java 6",
			0x33: "Java 7",
			0x34: "Java 8"
		};

		return versions[_majorVersion];
	};

	this.toString = function() {
		return "ClassDef#" + this.getName();
	};
};
