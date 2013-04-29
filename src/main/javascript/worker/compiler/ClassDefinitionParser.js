jjvm.compiler.ClassDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var constantPoolParser = new jjvm.compiler.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.MethodDefinitionParser();
	var innerClassesParser = new jjvm.compiler.InnerClassesParser();
	var enclosingMethodParser = new jjvm.compiler.EnclosingMethodParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator) {
		var classDef = new jjvm.types.ClassDefinition();
		classDef.setMinorVersion(iterator.readU16());
		classDef.setMajorVersion(iterator.readU16());

		var constantPool = constantPoolParser.parse(iterator);
		classDef.setConstantPool(constantPool);

		var accessFlags = iterator.readU16();

		if(accessFlags & 0x0001) {
			classDef.setVisibility("public");
		}

		classDef.setIsFinal(accessFlags & 0x0010);
		classDef.setIsSuper(accessFlags & 0x0020);
		classDef.setIsInterface(accessFlags & 0x0200);
		classDef.setIsAbstract(accessFlags & 0x0400);
		classDef.setName(this._loadClassName(iterator, constantPool));
		classDef.setParent(this._loadClassName(iterator, constantPool));

		var interfaceCount = iterator.readU16();

		for(var i = 0; i < interfaceCount; i++) {
			classDef.addInterface(this._loadClassName(iterator, constantPool));
		}

		this.parseFields(iterator, classDef, constantPool);
		this.parseMethods(iterator, classDef, constantPool);

		attributesParser.onAttributeCount = function(attributeCount) {
			//jjvm.console.info("class " + name + " has " + attributeCount + " attribtues");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Class " + classDef.getName() + " has unrecognised attribute " + attributeName]);
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
