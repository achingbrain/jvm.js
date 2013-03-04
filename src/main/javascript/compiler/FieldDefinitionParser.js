jjvm.compiler.FieldDefinitionParser = function() {
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantsPool, classDef) {
		var accessFlags = iterator.readU16();
		var name = constantsPool.load(iterator.readU16()).getValue();
		var type = constantsPool.load(iterator.readU16()).getTypeName();

		var fieldDef = new jjvm.types.FieldDefinition(name, type, classDef);

		if(accessFlags & 0x0001) {
			fieldDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			fieldDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			fieldDef.setVisibility("protected");
		}

		if(accessFlags & 0x0008) {
			fieldDef.setIsStatic(true);
		}

		if(accessFlags & 0x0010) {
			fieldDef.setIsFinal(true);
		}

		if(accessFlags & 0x0040) {
			fieldDef.setIsVolatile(true);
		}

		if(accessFlags & 0x0080) {
			fieldDef.setIsTransient(true);
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("field " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on field " + name);
		};
		console.onConstantValue = function(iterator, constantsPool) {
			var value = constantsPool.load(iterator.readU16());
			fieldDef.setConstantValue(value);
		};
		console.onSynthetic = function(iterator, constantsPool) {
			blockParser.readEmptyBlock(attributeName, iterator);
			fieldDef.setSynthetic(true);
		};
		console.onDeprecated = function(iterator, constantsPool) {
			blockParser.readEmptyBlock(attributeName, iterator);
			fieldDef.setDeprecated(true);
		};
		attributesParser.parse(iterator, constantsPool);

		return fieldDef;
	};

	this.toString = function() {
		return "FieldDefinitionParser";
	};
};