jjvm.compiler.bytecode.MethodDefinitionParser = function() {
	var byteCodeParser = new jjvm.compiler.bytecode.ByteCodeParser();
	var exceptionTableParser = new jjvm.compiler.bytecode.ExceptionTableParser();
	var lineNumberTableParser = new jjvm.compiler.bytecode.LineNumberTableParser();
	var localVariableTableParser = new jjvm.compiler.bytecode.LocalVariableTableParser();
	var stackMapTableParser = new jjvm.compiler.bytecode.StackMapTableParser();
	var blockParser = new jjvm.compiler.bytecode.BlockParser();
	var attributesParser = new jjvm.compiler.bytecode.AttributesParser();
	var codeAttributesParser = new jjvm.compiler.bytecode.AttributesParser();

	this.parse = function(iterator, constantPool) {
		var accessFlags = constantPool.load(iterator.readU16());
		var name = constantPool.load(iterator.readU16()).getValue();
		var descriptor = constantPool.load(iterator.readU16());
		var type = descriptor.getValue();

		var instructions = [];
		var exceptionTable;
		var lineNumberTable;
		var localVariableTable;
		var stackMapTable;

		attributesParser.onAttributeCount = function(attributeCount) {
			console.info("method " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on method " + name);
		};
		attributesParser.onCode = function(iterator, constantPool) {
			var maxStack = iterator.readU16();
			var maxLocals = iterator.readU16();

			// read bytecode instructions
			instructions = blockParser.parseBlock(iterator, constantPool, iterator.readU32(), byteCodeParser);

			console.dir(instructions);

			// read exception table
			exceptionTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, exceptionTableParser);

			codeAttributesParser.onAttributeCount = function(attributeCount) {
				console.info("code block has " + attributeCount + " attributes");
			};
			codeAttributesParser.onUnrecognisedAttribute = function(attributeName) {
				console.warn("Unrecognised attribute " + attributeName + " on code block");
			};
			codeAttributesParser.onLineNumberTable = function() {
				lineNumberTable = blockParser.parseBlock(iterator, constantPool, iterator.readU32(), lineNumberTableParser);
			};
			codeAttributesParser.onLocalVariableTable = function() {
				localVariableTable = blockParser.parseBlock(iterator, constantPool, iterator.readU32(), localVariableTableParser);
			};
			codeAttributesParser.onStackMapTable = function() {
				stackMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU32(), localVariableTableParser);
			};
			codeAttributesParser.parse(iterator, constantPool);
/*
			var attributesCount = iterator.readU16();

			console.info("Code has " + attributesCount + " attributes");

			for(var l = 0; l < attributesCount; l++) {
				var codeAttributeName = constantPool.load(iterator.readU16()).getValue();

				console.info("Code attribute " + i + " " + codeAttributeName);

				if(codeAttributeName == "LineNumberTable") {
					lineNumberTable = this._readLineNumberTable(iterator, constantPool);
				} else if(codeAttributeName == "LocalVariableTable") {
					localVariableTable = this._readLocalVariableTable(iterator, constantPool);
				} else if(codeAttributeName == "StackMapTable") {
					stackMapTable = this._readStackMapTable(iterator, constantPool);
				} else {
					console.warn("Unrecognised attribute for code block: " + codeAttributeName);
				}
			}*/
		};
		attributesParser.onExceptions = function(iterator, constantPool) {
			var length = iterator.readU32();
			var numExceptions = iterator.readU16();

			for(var m = 0; m < numExceptions; m++) {
				iterator.readU16();
			}
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			iterator.readU32();
		};
		attributesParser.onDeprecated= function(iterator, constantPool) {
			iterator.readU32();
		};
		attributesParser.parse(iterator, constantPool);

		
/*
		for(var i = 0; i < attributeCount; i++) {
			var attributeName = constantPool.load(iterator.readU16()).getValue();

			console.info("found " + attributeName + " attribute on method " + name);

			if(attributeName == "Code") {
				var codeLength = iterator.readU32();
				var attributeStart = iterator.getLocation();

				console.info("Code length " + codeLength);

				var maxStack = iterator.readU16();
				var maxLocals = iterator.readU16();

				// read bytecode instructions
				instructions = this._readByteCode(iterator, constantPool);

				console.dir(instructions);

				// read exception table
				exceptionTable = this._readExceptionTable(iterator, constantPool);

				var attributesCount = iterator.readU16();

				console.info("Code has " + attributesCount + " attributes");

				for(var l = 0; l < attributesCount; l++) {
					var codeAttributeName = constantPool.load(iterator.readU16()).getValue();

					console.info("Code attribute " + i + " " + codeAttributeName);

					if(codeAttributeName == "LineNumberTable") {
						lineNumberTable = this._readLineNumberTable(iterator, constantPool);
					} else if(codeAttributeName == "LocalVariableTable") {
						localVariableTable = this._readLocalVariableTable(iterator, constantPool);
					} else if(codeAttributeName == "StackMapTable") {
						stackMapTable = this._readStackMapTable(iterator, constantPool);
					} else {
						console.warn("Unrecognised attribute for code block: " + codeAttributeName);
					}
				}

				var read = iterator.getLocation() - attributeStart;
				console.info("Code read " + (iterator.getLocation() - attributeStart));

				if(read != codeLength) {
					throw "Short read of Code attribute read " + read + " of " + codeLength + " bytes";
				}
			} else if(attributeName == "Exceptions") {
				var length = iterator.readU32();
				var numExceptions = iterator.readU16();

				for(var m = 0; m < numExceptions; m++) {
					iterator.readU16();
				}
			} else if(attributeName == "Synthetic") {
				iterator.readU32();
				
			} else if(attributeName == "Deprecated") {
				iterator.readU32();
			} else {
				console.warn("Unrecognised attribute " + attributeName + " on method " + name);
			}
		}
*/
		var visibility;

		if(accessFlags & 0x0001 == 0x0001) {
			visbility = "public";
		} else if(accessFlags & 0x0002 == 0x0002) {
			visbility = "private";
		} else if(accessFlags & 0x0004 == 0x0004) {
			visbility = "protected";
		}

		var isStatic = (accessFlags & 0x0008 == 0x0008);
		var isFinal = (accessFlags & 0x0010 == 0x0010);
		var isSynchronized = (accessFlags & 0x0020 == 0x0020);
		var isNative = (accessFlags & 0x0100 == 0x0100);
		var isAbstract = (accessFlags & 0x0400 == 0x0400);
		var isStrict = (accessFlags & 0x0800 == 0x0800);

		var returns;
		var args;

		return new jjvm.types.MethodDefinition(visibility, isStatic, isFinal, isSynchronized, returns, name, args, instructions);
	};
/*
	this._readLineNumberTable = function(iterator, constantPool) {
		return blockParser.parseBlock(iterator, constantPool, iterator.readU32(), lineNumberTableParser);
	};

	this._readLocalVariableTable = function(iterator, constantPool) {
		return blockParser.parseBlock(iterator, constantPool, iterator.readU32(), localVariableTableParser);
	};

	this._readStackMapTable = function(iterator, constantPool) {
		return blockParser.parseBlock(iterator, constantPool, iterator.readU32(), localVariableTableParser);
	};*/

	this.toString = function() {
		return "MethodDefinitionParser";
	};
};
