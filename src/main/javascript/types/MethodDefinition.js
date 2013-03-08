jjvm.types.MethodDefinition = function(name, args, returns, classDef) {
	var _visibility = "package";
	var _isStatic = false;
	var _isFinal = false;
	var _isSynchronized = false;
	var _isNative = false;
	var _isAbstract = false;
	var _isStrict = false;
	var _name = _.str.trim(name);
	var _args = args ? args : [];
	var _returns = _.str.trim(returns ? returns : "void");
	var _instructions = null;
	var _implementation = null;
	var _deprecated = false;
	var _synthetic = false;
	var _exceptionTable = null;
	var _throws = [];
	var _lineNumberTable = null;
	var _localVariableTable = null;
	var _stackMapTable = null;
	var _maxStackSize = 0;
	var _maxLocalVariables = 0;
	var _classDef = classDef;

	this.getVisibility = function() {
		return _visibility;
	};

	this.setVisibility = function(visibility) {
		_visibility = visibility;
	};

	this.isStatic = function() {
		return _isStatic;
	};

	this.setIsStatic = function(isStatic) {
		_isStatic = isStatic;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.setIsFinal = function(isFinal) {
		_isFinal = isFinal;
	};

	this.isSynchronized = function() {
		return _isSynchronized;
	};

	this.setIsSynchronized = function(isSynchronized) {
		_isSynchronized = isSynchronized;
	};

	this.isNative = function() {
		return _isNative;
	};

	this.setIsNative = function(isNative) {
		_isNative = isNative;
	};

	this.isAbstract = function() {
		return _isAbstract;
	};

	this.setIsAbstract = function(isAbstract) {
		_isAbstract = isAbstract;
	};

	this.getIsStrict = function() {
		return _isStrict;
	};

	this.setIsStrict = function(isStrict) {
		_isStrict = isStrict;
	};

	this.getName = function() {
		return _name;
	};

	this.getArgs = function() {
		return _args;
	};

	this.getReturns = function() {
		return _returns;
	};

	this.getInstructions = function() {
		return _instructions;
	};

	this.setInstructions = function(instructions) {
		_instructions = instructions;
	};

	this.getImplementation = function() {
		return _implementation;
	};

	this.setImplementation = function(implementation) {
		_implementation = implementation;
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

	this.setExceptionTable = function(exceptionTable) {
		_exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
	};

	this.setThrows = function(list) {
		_throws = list;
	};

	this.getThrows = function() {
		return _throws;
	};

	this.setLineNumberTable = function(lineNumberTable) {
		_lineNumberTable = lineNumberTable;
	};

	this.getLineNumberTable = function() {
		return _lineNumberTable;
	};

	this.setLocalVariableTable = function(localVariableTable) {
		_localVariableTable = localVariableTable;
	};

	this.getLocalVariableTable = function() {
		return _localVariableTable;
	};

	this.setStackMapTable = function(stackMapTable) {
		_stackMapTable = stackMapTable;
	};

	this.getStackMapTable = function() {
		return _stackMapTable;
	};

	this.setMaxStackSize = function(maxStackSize) {
		_maxStackSize = maxStackSize;
	};

	this.getMaxStackSize = function() {
		return _maxStackSize;
	};

	this.setMaxLocalVariables = function(maxLocalVariables) {
		_maxLocalVariables = maxLocalVariables;
	};

	this.getMaxLocalVariables = function() {
		return _maxLocalVariables;
	};

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.getClassDef = function() {
		return _classDef;
	};

	this.toJavaP = function() {
		var output = _visibility;
		output += _isStatic ? " static" : "";
		output += _isFinal ? " final" : "";
		output += _isAbstract ? " abstract" : "";
		output += _isSynchronized ? " synchronized" : "";
		output += " " + _returns + " " + _name + "(" + _args.join(", ") + ");\r\n";
		output += "\tCode:\r\n";
		output += "\t\tStack=" + _maxStackSize + ", Locals="+ _maxLocalVariables + ", Args_size=" + _args.length + "\r\n";
		
		if(_implementation) {
			output += "\t\tNative code\r\n";
		} else {
			for(var i = 0; i < _instructions.length; i++) {
				output += "\t\t" + _instructions[i].getLocation() + ":\t" + _instructions[i] + "\r\n";
			}
		}

		if(_lineNumberTable) {
			output += _lineNumberTable.toJavaP();
		}

		if(_exceptionTable) {
			output += _exceptionTable.toJavaP();
		}

		return output;
	};

	this.toString = function() {
		return "Method#" + this.getName();
	};
};

jjvm.types.MethodDefinition.CLASS_INITIALISER = "<clinit>";