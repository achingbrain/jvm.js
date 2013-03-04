jjvm.compiler.MethodDefinitionParser = function() {
	var byteCodeParser = new jjvm.compiler.ByteCodeParser();
	var exceptionTableParser = new jjvm.compiler.ExceptionTableParser();
	var lineNumberTableParser = new jjvm.compiler.LineNumberTableParser();
	var stackMapTableParser = new jjvm.compiler.StackMapTableParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();
	var codeAttributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16()).getValue();
		var descriptor = constantPool.load(iterator.readU16());
		var type = descriptor.getValue();

		var typeRegex = /\((.*)?\)(L[a-zA-Z\/]+;|Z|B|C|S|I|J|F|D|V)/;
		var match = type.match(typeRegex);

		var returns = match[2];

		if(returns.length > 1) {
			// returns an object type, remove the L and ;
			returns = returns.substring(1, returns.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives[returns]) {
			// convert I to int, Z to boolean, etc
			returns = jjvm.types.Primitives[returns];
		}

		var args = [];

		if(match[1]) {
			var argsIterator = new jjvm.core.Iterator(match[1].split(""));

			while(argsIterator.hasNext()) {
				var character = argsIterator.next();

				if(jjvm.types.Primitives[character]) {
					// convert I to int, Z to boolean, etc
					args.push(jjvm.types.Primitives[character]);
				} else if(character == "L") {
					// start of object type definition, read until ";"
					var className = "";

					while(true) {
						var classNameCharacter = argsIterator.next();

						if(classNameCharacter == ";") {
							className = className.replace(/\//g, ".");

							break;
						} else {
							className += classNameCharacter;
						}
					}

					args.push(className);
				}
			}
		}

		var methodDef = new jjvm.types.MethodDefinition(name, args, returns, classDef);

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

		if(accessFlags & 0x0100) {
			methodDef.setIsNative(true);

			if(jjvm.nativeMethods[classDef.getName()] && jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]) {
				methodDef.setImplementation(jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]);
			} else {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]"]);
			}
		}

		if(accessFlags & 0x0400) {
			methodDef.setIsAbstract(true);
		}

		if(accessFlags & 0x0800) {
			methodDef.setIsStrict(true);
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("method " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on method " + name);
		};
		attributesParser.onCode = function(iterator, constantPool) {
			methodDef.setMaxStackSize(iterator.readU16());
			methodDef.setMaxLocalVariables(iterator.readU16());

			// read bytecode instructions
			methodDef.setInstructions(blockParser.parseBlock(iterator, constantPool, iterator.readU32(), byteCodeParser));

			// read exception table
			methodDef.setExceptionTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, exceptionTableParser));

			codeAttributesParser.onAttributeCount = function(attributeCount) {
				//console.info("Code block has " + attributeCount + " attributes");
			};
			codeAttributesParser.onUnrecognisedAttribute = function(attributeName) {
				console.warn("Unrecognised attribute " + attributeName + " on code block");
			};
			codeAttributesParser.onLineNumberTable = function() {
				methodDef.setLineNumberTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 4, lineNumberTableParser));
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
			blockParser.readEmptyBlock("Deprecated", iterator);
			methodDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Synthetic", iterator);
			methodDef.setSynthetic(true);
		};
		attributesParser.parse(iterator, constantPool);

		return methodDef;
	};

	this.toString = function() {
		return "MethodDefinitionParser";
	};
};
