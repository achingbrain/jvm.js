jjvm.types.ClassDefinition = function(data) {
	var _data = data ? data : {
		interfaces: [],
		methods: {},
		fields: {}
	};

	var _parent;
	var _methods = [];
	var _fields = [];
	var _exceptionTable = null;
	var _constantPool = new jjvm.types.ConstantPool(_data.constantPool);
	var _enclosingMethod = null;
	var _objectRef = null;
	var _initialized = false;
	var _classLoader = null;

	// holds values of static fields
	var _staticFields = {};

	if(data) {
		_parent = jjvm.core.ClassLoader.loadClass(data.parent);
	}

	this.getName = function() {
		return _data.name;
	};

	this.setName = function(name) {
		_data.name = _.string.trim(name);
	};

	this.getParent = function() {
		return _parent;
	};

	this.setParent = function(parent) {
		delete _data.parent;

		if(parent) {
			_parent = jjvm.core.ClassLoader.loadClass(parent);
			_data.parent = parent;
		}
	};

	this.getVisibility = function() {
		return _data.visibility;
	};

	this.setVisibility = function(visibility) {
		_data.visibility = visibility;
	};

	this.isAbstract = function() {
		return _data.isAbstract ? true : false;
	};

	this.setIsAbstract = function(isAbstract) {
		_data.isAbstract = isAbstract ? true : false;
	};

	this.isFinal = function() {
		return _data.isFinal ? true : false;
	};

	this.setIsFinal = function(isFinal) {
		_data.isFinal = isFinal ? true : false;
	};

	this.isInterface = function() {
		return _data.isInterface ? true : false;
	};

	this.setIsInterface = function(isInterface) {
		_data.isInterface = isInterface ? true : false;
	};

	this.isSuper = function() {
		return _data.isSuper ? true : false;
	};

	this.setIsSuper = function(isSuper) {
		_data.isSuper = isSuper ? true : false;
	};

	this.getInterfaces = function() {
		return _data.interfaces;
	};

	this.addInterface = function(anInterface) {
		_data.interfaces.push(anInterface);
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

		if(_parent) {
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

		if(_parent) {
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

		if(!_data.methods) {
			_data.methods = {};
		}

		_data.methods[methodDef.getName()] = methodDef.getData();
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

		if(_parent) {
			return _parent.getField(name);
		}
	};

	this.addField = function(fieldDef) {
		_fields.push(fieldDef);

		if(!_data.fields) {
			_data.fields = {};
		}

		_data.fields[fieldDef.getName()] = fieldDef.getData();
	};

	this.hasField = function(name) {
		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name && !_fields[i].isStatic()) {
				return true;
			}
		}

		if(_parent) {
			return _parent.hasField(name);
		}

		return false;
	};

	this.invokeStaticMethod = function(name, args) {
		
	};

	this.getStaticField = function(name) {
		this.hasStaticField(name);

		if(_staticFields[name] === undefined) {
			// we have the field but it's not been used yet so initialise it.

			var fieldDef = this.getField(name);

			if(fieldDef.getType() == "boolean" || fieldDef.getType() == "byte" || fieldDef.getType() == "short" || fieldDef.getType() == "int" || fieldDef.getType() == "long" || fieldDef.getType() == "char") {
				_staticFields[name] = 0;
			} else if(fieldDef.getType() == "float" || fieldDef.getType() == "double") {
				_staticFields[name] = 0.0;
			} else {
				_staticFields[name] = null;				
			}
		}

		return _staticFields[name];
	};

	this.getStaticFields = function() {
		return _staticFields;
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
		_constantPool = constantPool;

		_data.constantPool = constantPool.getData();
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
			var interfaceDef = jjvm.core.ClassLoader.loadClass(this.getInterfaces()[i]);

			if(interfaceDef.isChildOf(classDef)) {
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

	this.getClassLoader = function() {
		return this._classLoader;
	};

	this.setClassLoader = function(classLoader) {
		this._classLoader = classLoader;
	};

	this.getData = function() {
		return _data;
	};

	this.toString = function() {
		return "ClassDef#" + this.getName();
	};

	this.toJavaP = function() {
		var output = this.getVisibility();
		output += this.isAbstract() ? " abstract" : "";
		output += this.isFinal() ? " final" : "";
		output += this.isInterface() ? " interface" : " class";
		output += " " + this.getName();
		output += this.getParent() ? " extends " + this.getParent() : "";
		output += "\r\n";
		output += "\tSourceFile: \"" + this.getSourceFile() + "\"\r\n";
		output += "\tMinor version: " + this.getMinorVersion() + "\r\n";
		output += "\tMajor version: " + this.getMajorVersion() + "\r\n";
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
