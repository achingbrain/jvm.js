jjvm.compiler.MethodDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var byteCodeParser = new jjvm.compiler.ByteCodeParser();
	var exceptionTableParser = new jjvm.compiler.ExceptionTableParser();
	var lineNumberTableParser = new jjvm.compiler.LineNumberTableParser();
	var stackMapTableParser = new jjvm.compiler.StackMapTableParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();
	var codeAttributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var methodDef = new jjvm.types.MethodDefinition();

		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16()).getValue();
		var descriptor = constantPool.load(iterator.readU16());
		var type = descriptor.getValue();

		var typeRegex = /\((.*)?\)(\[+)?(L[a-zA-Z\/$]+;|Z|B|C|S|I|J|F|D|V)/;
		var match = type.match(typeRegex);

		var returnsArray = match[2] ? true : false;
		var returns = match[3];

		if(returns.length > 1) {
			// returns an object type, remove the L and ;
			returns = returns.substring(1, returns.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives.jvmTypesToPrimitive[returns]) {
			// convert I to int, Z to boolean, etc
			returns = jjvm.types.Primitives.jvmTypesToPrimitive[returns];
		}

		if(returnsArray) {
			returns += "[]";
		}

		var args = [];

		if(match[1]) {
			args = jjvm.Util.parseArgs(match[1]);
		}

		
		methodDef.setName(name);
		methodDef.setArgs(args);
		methodDef.setReturns(returns);
		methodDef.setSignature(methodDef.getName() + type);
		methodDef.setClassDef(classDef);

		if(accessFlags & 0x0001) {
			methodDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			methodDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			methodDef.setVisibility("protected");
		}

		if(accessFlags & 0x0008) {
			methodDef.setIsStatic(true);
		}
		
		if(accessFlags & 0x0010) {
			methodDef.setIsFinal(true);
		}
		
		if(accessFlags & 0x0020) {
			methodDef.setIsSynchronized(true);
		}

		if(jjvm.nativeMethods[classDef.getName()] && jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]) {
			// we've overriden the method implementation
			methodDef.setImplementation(jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]);
		}

		if(accessFlags & 0x0100) {
			methodDef.setIsNative(true);

			if(!methodDef.getImplementation()) {
				// method marked as native but no implementation supplied - make a fuss
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]"]);
				//throw "Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]";
			}
		}

		if(accessFlags & 0x0400) {
			methodDef.setIsAbstract(true);
		}

		if(accessFlags & 0x0800) {
			methodDef.setIsStrict(true);
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			//jjvm.console.info("method " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onCode = function(iterator, constantPool) {
			methodDef.setMaxStackSize(iterator.readU16());
			methodDef.setMaxLocalVariables(iterator.readU16());

			// read bytecode instructions
			methodDef.setInstructions(blockParser.parseBlock(iterator, constantPool, iterator.readU32(), byteCodeParser));

			// read exception table
			methodDef.setExceptionTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, exceptionTableParser));

			codeAttributesParser.onAttributeCount = function(attributeCount) {
				//jjvm.console.info("Code block has " + attributeCount + " attributes");
			};
			codeAttributesParser.onUnrecognisedAttribute = function(attributeName) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " has unrecognised attribute " + attributeName + " on code block"]);
			};
			codeAttributesParser.onLineNumberTable = function() {
				methodDef.setLineNumberTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 4, lineNumberTableParser));
			};
			codeAttributesParser.onStackMapTable = function(iterator, constantPool) {
				// can be variable length
				//var statckMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), stackMapTableParser);
				//methodDef.setStackMapTable(statckMapTable);
			};
			codeAttributesParser.onLocalVariableTable = function(iterator, constantPool) {
				// can be variable length
				//var statckMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), stackMapTableParser);
				//methodDef.setStackMapTable(statckMapTable);
			};
			codeAttributesParser.parse(iterator, constantPool);
		};
		attributesParser.onExceptions = function(iterator, constantPool) {
			var numExceptions = iterator.readU16();
			var exceptions = [];

			for(var m = 0; m < numExceptions; m++) {
				exceptions.push(constantPool.load(iterator.readU16()));
			}

			methodDef.setThrows(exceptions);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			methodDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			methodDef.setSynthetic(true);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return methodDef;
	};

	this.toString = function() {
		return "MethodDefinitionParser";
	};
};
