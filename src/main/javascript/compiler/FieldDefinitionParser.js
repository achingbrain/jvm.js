jjvm.compiler.FieldDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var accessFlags = iterator.readU16();
		
		var fieldDef = new jjvm.types.FieldDefinition();
		fieldDef.setName(this._loadString(iterator, constantPool));
		fieldDef.setType(this._loadClassName(iterator, constantPool));

		if(accessFlags & 0x0001) {
			fieldDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			fieldDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			fieldDef.setVisibility("protected");
		}

		fieldDef.setIsStatic(accessFlags & 0x0008);
		fieldDef.setIsFinal(accessFlags & 0x0010);
		fieldDef.setIsVolatile(accessFlags & 0x0040);
		fieldDef.setIsTransient(accessFlags & 0x0080);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("field " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Field " + name + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onConstantValue = function(iterator, constantPool) {
			var value = constantPool.load(iterator.readU16());
			fieldDef.setConstantValue(value);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			//blockParser.readEmptyBlock("onSynthetic", iterator);
			fieldDef.setSynthetic(true);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			//blockParser.readEmptyBlock("onDeprecated", iterator);
			fieldDef.setDeprecated(true);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return fieldDef;
	};

	this.toString = function() {
		return "FieldDefinitionParser";
	};
};