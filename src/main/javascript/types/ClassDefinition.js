jjvm.types.ClassDefinition = function(name, parent) {
	var _name = name.getValue().replace(/\//g, ".");
	var _parent = parent ? jjvm.core.ClassLoader.loadClass(parent.getValue().replace(/\//g, ".")) : null;
	var _isAbstract = false;
	var _isFinal = false;
	var _isInterface = false;
	var _isSuper = false;
	var _visibility = "package";
	var _interfaces = [];
	var _methods = [];
	var _fields = [];
	var _exceptionTable = null;
	var _sourceFile;
	var _minorVersion;
	var _majorVersion;
	var _deprecated = false;
	var _synthetic = false;
	var _constantPool = null;
	var _enclosingMethod = null;
	var _objectRef = null;
	var _initialized = false;

	// holds values of static fields
	var _staticFields = {};

	this.getName = function() {
		return _name;
	};

	this.getParent = function() {
		return _parent;
	};

	this.getVisibility = function() {
		return _visibility;
	};

	this.setVisibility = function(visibility) {
		_visibility = visibility;
	};

	this.isAbstract = function() {
		return _isAbstract;
	};

	this.setIsAbstract = function(isAbstract) {
		_isAbstract = isAbstract;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.setIsFinal = function(isFinal) {
		_isFinal = isFinal;
	};

	this.isInterface = function() {
		return _isInterface;
	};

	this.setIsInterface = function(isInterface) {
		_isInterface = isInterface;
	};

	this.isSuper = function() {
		return _isSuper;
	};

	this.setIsSuper = function(isSuper) {
		_isSuper = isSuper;
	};

	this.getInterfaces = function() {
		return _interfaces;
	};

	this.addInterface = function(anInterface) {
		_interfaces.push(anInterface);
	};

	this.getMethods = function() {
		return _methods;
	};

	this.hasMethod = function(name) {
		for(var i = 0; i < _methods.length; i++) {
			if(_methods[i].getName() == name) {
				return true;
			}
		}

		if(_parent !== null) {
			return _parent.hasMethod(name);
		}

		return false;
	};

	this.getMethod = function(name, args) {
		if(!args) {
			args = [];
		}

		for(var i = 0; i < _methods.length; i++) {
			if(_methods[i].getName() == name && this._argsMatch(_methods[i].getArgs(), args)) {
				return _methods[i];
			}
		}

		if(_parent !== null) {
			return _parent.getMethod(name);
		}

		throw "Method " + name + " with args " + args + " does not exist on class " + this.getName();
	};

	this._argsMatch = function(arr1, arr2) {
		if(arr1.length != arr2.length) {
			return false;
		}

		for(var i = 0; i < arr1.length; i++) {
			if(arr1[i] != arr2[i]) {
				return false;
			}
		}

		return true;
	};

	this.addMethod = function(methodDef) {
		_methods.push(methodDef);
	};

	this.getFields = function() {
		return _fields;
	};

	this.getField = function(name) {
		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name) {
				return _fields[i];
			}
		}

		if(_parent !== null) {
			return _parent.getField(name);
		}
	};

	this.addField = function(fieldDef) {
		_fields.push(fieldDef);
	};

	this.hasField = function(name) {
		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name && !_fields[i].isStatic()) {
				return true;
			}
		}

		if(_parent !== null) {
			return _parent.hasField(name);
		}

		return false;
	};

	this.invokeStaticMethod = function(name, args) {
		
	};

	this.getStaticField = function(name) {
		this.hasStaticField(name);

		return _staticFields[name];
	};

	this.setStaticField = function(name, value) {
		this.hasStaticField(name);

		_staticFields[name] = value;
	};

	this.hasStaticField = function(name) {
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
		constantPool.setClassDef(this);
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

	this.setEnclosingMethod = function(enclosingMethod) {
		_enclosingMethod = enclosingMethod;
	};

	this.getEnclosingMethod = function() {
		return _enclosingMethod;
	};

	this.getObjectRef = function() {
		if(!_objectRef) {
			_objectRef = jjvm.Util.createObjectRef("java.lang.Class");
		}

		return _objectRef;
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

	this.isChildOf = function(classDef) {
		if(this.getName() == classDef.getName()) {
			return true;
		}

		for(var i = 0; i < this.getInterfaces().length; i++) {
			if(this.getInterfaces()[i].isChildOf(classDef)) {
				return true;
			}
		}

		if(this.getParent()) {
			return this.getParent().isChildOf(classDef);
		}

		return false;
	};

	this.getInitialized = function() {
		return this._initialized;
	};

	this.setInitialized = function(initialized) {
		this._initialized = initialized;
	};

	this.toString = function() {
		return "ClassDef#" + this.getName();
	};

	this.toJavaP = function() {
		var output = _visibility;
		output += _isAbstract ? " abstract" : "";
		output += _isFinal ? " final" : "";
		output += _isInterface ? " interface" : " class";
		output += " " + _name;
		output += _parent ? " extends " + _parent : "";
		output += "\r\n";
		output += "\tSourceFile: \"" + _sourceFile + "\"\r\n";
		output += "\tMinor version: " + _minorVersion + "\r\n";
		output += "\tMajor version: " + _majorVersion + "\r\n";
		output += "\r\n";
		output += _constantPool.toJavaP();
		output += "\r\n";

		if(_fields.length > 0) {
			for(var f = 0; f < _fields.length; f++) {
				output += _fields[f].toJavaP();
			}

			output += "\r\n";
		}

		for(var m = 0; m < _methods.length; m++) {
			output += _methods[m].toJavaP();
			output += "\r\n";
		}

		return output;
	};
};
