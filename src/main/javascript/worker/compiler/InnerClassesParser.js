jjvm.compiler.InnerClassesParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var innerClasses = [];

		while(iterator.hasNext()) {
			var innerClass = this._loadEntry(iterator, constantsPool);
			var outerClass = this._loadEntry(iterator, constantsPool);
			var innerClassName = this._loadEntry(iterator, constantsPool);

			var accessFlags = iterator.readU16();

			var isPublic = accessFlags & 0x0001 ? true : false;
			var isPrivate = accessFlags & 0x0002 ? true : false;
			var isProtected = accessFlags & 0x0004 ? true : false;
			var isStatic = accessFlags & 0x0008 ? true : false;
			var isFinal = accessFlags & 0x0010 ? true : false;
			var isInterface = accessFlags & 0x0200 ? true : false;
			var isAbstract = accessFlags & 0x0400 ? true : false;

			innerClasses.push({
				innerClass: innerClass,
				outerClass: outerClass,
				innerClassName: innerClassName,
				isPublic: isPublic,
				isPrivate: isPrivate,
				isProtected: isProtected,
				isStatic: isStatic,
				isFinal: isFinal,
				isInterface: isInterface,
				isAbstract: isAbstract
			});
		}

		//jjvm.console.dir(innerClasses);
	};

	this._loadEntry = function(iterator, constantsPool) {
		var index = iterator.readU16();

		if(index !== 0) {
			return constantsPool.load(index);
		}
	};

	this.toString = function() {
		return "InnerClassesParser";
	};
};
