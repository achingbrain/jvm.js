jjvm.compiler.bytecode.FieldDefinitionParser = function() {
	var blockParser = new jjvm.compiler.bytecode.BlockParser();
	var attributesParser = new jjvm.compiler.bytecode.AttributesParser();

	this.parse = function(iterator, constantsPool) {
		var accessFlags = constantsPool.load(iterator.readU16());
		
		var index = iterator.readU16();
		var namefield = constantsPool.load(index);
		var name = namefield.getValue();
		var type = constantsPool.load(iterator.readU16()).getValue().replace(/\//g, ".");
		
		if(jjvm.types.Primitives[type]) {
			type = jjvm.types.Primitives[type];
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			console.info("field " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on field " + name);
		};
		console.onConstantValue = function(iterator, constantsPool) {
			var value = constantsPool.load(iterator.readU16());
		};
		console.onSynthetic = function(iterator, constantsPool) {
			blockParser.readEmptyBlock(attributeName, iterator);
			//classDef.setDeprecated(true);
		};
		console.onDeprecated = function(iterator, constantsPool) {
			blockParser.readEmptyBlock(attributeName, iterator);
			//classDef.setDeprecated(true);
		};
		attributesParser.parse(iterator, constantsPool);

		var visbility = "public";

		if(accessFlags & 0x0001 == 0x0001) {
			visbility = "public";
		} else if(accessFlags & 0x0002 == 0x0002) {
			visbility = "private";
		} else if(accessFlags & 0x0004 == 0x0004) {
			visbility = "protected";
		}

		var isStatic = (accessFlags & 0x0008 == 0x0008);
		var isFinal = (accessFlags & 0x0010 == 0x0010);
		var isVolatile = (accessFlags & 0x0040 == 0x0040);
		var isTransient = (accessFlags & 0x0080 == 0x0080);

		return new jjvm.types.FieldDefinition(visbility, isStatic, isFinal, isVolatile, isTransient, type, name);
	};

	this.toString = function() {
		return "FieldDefinitionParser";
	};
};