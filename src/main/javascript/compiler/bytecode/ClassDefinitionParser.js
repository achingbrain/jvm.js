jjvm.compiler.bytecode.ClassDefinitionParser = function() {
	var constantPoolParser = new jjvm.compiler.bytecode.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.bytecode.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.bytecode.MethodDefinitionParser();
	var innerClassesParser = new jjvm.compiler.bytecode.InnerClassesParser();
	var blockParser = new jjvm.compiler.bytecode.BlockParser();
	var attributesParser = new jjvm.compiler.bytecode.AttributesParser();

	this.parse = function(iterator) {
		var minorVersion = iterator.readU16();
		var majorVersion = iterator.readU16();

		var constantPool = constantPoolParser.parse(iterator);

		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16()).getValue();
		name = name.replace(/\//g, ".");
		var parent = constantPool.load(iterator.readU16()).getValue().replace(/\//g, ".");
		var interfaceCount = iterator.readU16();

		var interfaces = [];

		for(var i = 0; i < interfaceCount; i++) {
			var index = iterator.readU16();
			interfaces.push(constantPool.load(index).getValue().replace(/\//g, "."));
		}

		var visibility;

		if(accessFlags & 0x0001 == 0x0001) {
			visibility = "public";
		}

		var isFinal = accessFlags & 0x0010 == 0x0010;
		var isSuper = accessFlags & 0x0020 == 0x0020;
		var isInterface = accessFlags & 0x0200 == 0x0200;
		var isAbstract = accessFlags & 0x0400 == 0x0400;

		var classDef = new jjvm.types.ClassDefinition(visibility, isAbstract, isFinal, name, parent, interfaces);
		classDef.setMinorVersion(minorVersion);
		classDef.setMajorVersion(majorVersion);
		classDef.setConstantPool(constantPool);

		var fieldCount = iterator.readU16();

		console.info("class " + name + " has " + fieldCount + " fields");

		for(var k = 0; k < fieldCount; k++) {
			classDef.addField(fieldDefinitionParser.parse(iterator, constantPool));
		}

		var methodCount = iterator.readU16();

		console.info("class " + name + " has " + methodCount + " methods");

		for(var j = 0; j < methodCount; j++) {
			classDef.addMethod(methodDefinitionParser.parse(iterator, constantPool));
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			console.info("class " + name + " has " + attributeCount + " attribtues");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on class " + name);
		};
		attributesParser.onSourceFile = function(iterator, constantPool) {
			var sourceFileName = constantPool.load(iterator.readU16()).getValue();
			classDef.setSourceFile(sourceFileName);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			blockParser.readEmptyBlock(attributeName, iterator);
			classDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock(attributeName, iterator);
			classDef.setSynthetic(true);
		};
		attributesParser.onInnerClasses = function(iterator, constantPool) {
			blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, innerClassesParser);
		};
		attributesParser.parse(iterator, constantPool);

		return classDef;
	};

	this.toString = function() {
		return "ClassDefinitionParser";
	};
};
