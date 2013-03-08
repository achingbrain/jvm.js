jjvm.compiler.AttributesParser = function(iterator, constantPool) {
	
	this.parse = function(iterator, constantPool) {
		var attributeCount = iterator.readU16();

		this.onAttributeCount(attributeCount);

		for(var n = 0; n < attributeCount; n++) {
			var attributeName = constantPool.load(iterator.readU16()).getValue();
			var attributeLength = iterator.readU32();
			var attributeStart = iterator.getLocation();

			var nextPosition = iterator.getLocation() + attributeLength;

			if(this["on" + attributeName]) {
				this["on" + attributeName](iterator, constantPool);
			} else {
				this.onUnrecognisedAttribute(attributeName);
			}

			// make sure we've consumed the attribute
			var read = iterator.getLocation() - attributeStart;

			if(read != attributeLength) {
				//jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Short read of " + attributeName + " read " + read + " of " + attributeLength + " bytes"]);
			}

			iterator.jump(nextPosition);
		}
	};

	this.onAttributeCount = function(attributeCount) {

	};

	this.onUnrecognisedAttribute = function(attributeName) {

	};

	this.toString = function() {
		return "AttributesParser";
	};
};