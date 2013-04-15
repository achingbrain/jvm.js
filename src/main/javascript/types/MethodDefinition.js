jjvm.types.MethodDefinition = function(data) {
	// will be serialized to JSON so don't put any functions in here...
	var _data = data ? data : {};

	// holds a function
	var _implementation = null;

	// holds a list of bytecode instructions
	var _instructions = [];
	
	if(_data.instructions) {

	}

	var _lineNumberTable = null;
	var _localVariableTable = null;
	var _stackMapTable = null;
	var _classDef = null;

	this.getVisibility = function() {
		return _data.visibility ? _data.visibility : "package";
	};

	this.setVisibility = function(visibility) {
		_data.visibility = visibility;
	};

	this.isStatic = function() {
		return _data.isStatic ? true : false;
	};

	this.setIsStatic = function(isStatic) {
		_data.isStatic = isStatic ? true : false;
	};

	this.isFinal = function() {
		return _data.isFinal ? true : false;
	};

	this.setIsFinal = function(isFinal) {
		_data.isFinal = isFinal ? true : false;
	};

	this.isSynchronized = function() {
		return _data.isSynchronized ? true : false;
	};

	this.setIsSynchronized = function(isSynchronized) {
		_data.isSynchronized = isSynchronized ? true : false;
	};

	this.isNative = function() {
		return _data.isNative ? true : false;
	};

	this.setIsNative = function(isNative) {
		_data.isNative = isNative ? true : false;
	};

	this.isAbstract = function() {
		return _data.isAbstract ? true : false;
	};

	this.setIsAbstract = function(isAbstract) {
		_data.isAbstract = isAbstract ? true : false;
	};

	this.getIsStrict = function() {
		return _data.isStrict ? true : false;
	};

	this.setIsStrict = function(isStrict) {
		_data.isStrict = isStrict ? true : false;
	};

	this.setName = function(name) {
		_data.name = _.string.trim(name);
	};

	this.getName = function() {
		return _data.name;
	};

	this.setArgs = function(args) {
		return _data.args = args;
	};

	this.getArgs = function() {
		return _data.args;
	};

	this.setReturns = function(returns) {
		_data.returns = _.str.trim(returns);
	};

	this.getReturns = function() {
		return _data.returns ? _data.returns : "void";
	};

	this.getInstructions = function() {
		return _instructions;
	};

	this.setInstructions = function(instructions) {
		_instructions = instructions;

		_data.instructions = [];

		_.each(instructions, function(instruction) {
			_data.instructions.push(instruction.getData());
		});
	};

	this.setDeprecated = function(deprecated) {
		_data.isDeprecated = deprecated ? true : false;
	};

	this.isDeprecated = function() {
		return _data.isDeprecated;
	};

	this.setSynthetic = function(synthetic) {
		_data.synthetic = synthetic ? true : false;
	};

	this.isSynthetic = function() {
		return _data.isSynthetic;
	};

	this.setThrows = function(list) {
		_data.throws = list;
	};

	this.getThrows = function() {
		return _data.throws;
	};

	this.setMaxStackSize = function(maxStackSize) {
		_data.maxStackSize = maxStackSize;
	};

	this.getMaxStackSize = function() {
		return _data.maxStackSize;
	};

	this.setMaxLocalVariables = function(maxLocalVariables) {
		_data.maxLocalVariables = maxLocalVariables;
	};

	this.getMaxLocalVariables = function() {
		return _data.maxLocalVariables;
	};

	this.getImplementation = function() {
		return _implementation;
	};

	this.setImplementation = function(implementation) {
		_implementation = implementation;
	};

	this.setExceptionTable = function(exceptionTable) {
		_exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
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

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.getClassDef = function() {
		return _classDef;
	};

	this.getData = function() {
		return _data;
	};

	this.toJavaP = function() {
		var output = this.getVisibility();
		output += this.isStatic() ? " static" : "";
		output += this.isFinal() ? " final" : "";
		output += this.isAbstract() ? " abstract" : "";
		output += this.isSynchronized() ? " synchronized" : "";
		output += " " + this.getReturns() + " " + this.getName() + "(" + this.getArgs().join(", ") + ");\r\n";
		output += "\tCode:\r\n";
		output += "\t\tStack=" + this.getMaxStackSize() + ", Locals="+ this.getMaxLocalVariables() + ", Args_size=" + this.getArgs().length + "\r\n";

		if(this.getImplementation()) {
			output += "\t\tNative code\r\n";
		} else {
			for(var i = 0; i < this.getInstructions().length; i++) {
				output += "\t\t" + this.getInstructions()[i].getLocation() + ":\t" + this.getInstructions()[i] + "\r\n";
			}
		}

		if(this.getLineNumberTable()) {
			output += this.getLineNumberTable().toJavaP();
		}

		if(this.getExceptionTable()) {
			output += this.getExceptionTable().toJavaP();
		}

		return output;
	};

	this.toString = function() {
		return "Method#" + this.getName();
	};
};

jjvm.types.MethodDefinition.CLASS_INITIALISER = "<clinit>";
jjvm.types.MethodDefinition.OBJECT_INITIALISER = "<init>";