jjvm.compiler.ClassDefinitionParser = function() {
	var constantPoolParser = new jjvm.compiler.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.MethodDefinitionParser();
	var innerClassesParser = new jjvm.compiler.InnerClassesParser();
	var enclosingMethodParser = new jjvm.compiler.EnclosingMethodParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator) {
		var minorVersion = iterator.readU16();
		var majorVersion = iterator.readU16();

		var constantPool = constantPoolParser.parse(iterator);

		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16());
		var parent = constantPool.load(iterator.readU16());

		var classDef = new jjvm.types.ClassDefinition(name, parent);
		classDef.setMinorVersion(minorVersion);
		classDef.setMajorVersion(majorVersion);
		classDef.setConstantPool(constantPool);

		var interfaceCount = iterator.readU16();

		for(var i = 0; i < interfaceCount; i++) {
			classDef.addInterface(constantPool.load(iterator.readU16()));
		}

		if(accessFlags & 0x0001) {
			classDef.setVisibility("public");
		}

		if(accessFlags & 0x0010) {
			classDef.setIsFinal(true);
		}

		if(accessFlags & 0x0020) {
			classDef.setIsSuper(true);
		}

		if(accessFlags & 0x0200) {
			classDef.setIsInterface(true);
		}

		if(accessFlags & 0x0400) {
			classDef.setIsAbstract(true);
		}

		this.parseFields(iterator, classDef, constantPool);

		this.parseMethods(iterator, classDef, constantPool);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("class " + name + " has " + attributeCount + " attribtues");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Class " + name + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onSourceFile = function(iterator, constantPool) {
			var sourceFileName = constantPool.load(iterator.readU16()).getValue();
			classDef.setSourceFile(sourceFileName);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Deprecated", iterator);
			classDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Synthetic", iterator);
			classDef.setSynthetic(true);
		};
		attributesParser.onInnerClasses = function(iterator, constantPool) {
			blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, innerClassesParser);
		};
		attributesParser.onEnclosingMethod = function(iterator, constantPool) {
			var enclosingMethod = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), enclosingMethodParser);
			classDef.setEnclosingMethod(enclosingMethod);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return classDef;
	};

	this.parseFields = function(iterator, classDef, constantPool) {
		var fieldCount = iterator.readU16();

		for(var i = 0; i < fieldCount; i++) {
			classDef.addField(fieldDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.parseMethods = function(iterator, classDef, constantPool) {
		var methodCount = iterator.readU16();

		for(var i = 0; i < methodCount; i++) {
			classDef.addMethod(methodDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.toString = function() {
		return "ClassDefinitionParser";
	};
};
