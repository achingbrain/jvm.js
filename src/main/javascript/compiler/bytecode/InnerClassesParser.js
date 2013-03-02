jjvm.compiler.bytecode.InnerClassesParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var innerClasses = [];

		while(iterator.hasNext()) {
			var innerClass = this._loadEntry(iterator, constantsPool);
			var outerClass = this._loadEntry(iterator, constantsPool);
			var innerClassName = this._loadEntry(iterator, constantsPool);

			var accessFlags = iterator.readU16();

			var isPublic = accessFlags & 0x0001 == 0x0001;
			var isPrivate = accessFlags & 0x0002 == 0x0002;
			var isProtected = accessFlags & 0x0004 == 0x0004;
			var isStatic = accessFlags & 0x0008 == 0x0008;
			var isFinal = accessFlags & 0x0010 == 0x0010;
			var isInterface = accessFlags & 0x0200 == 0x0200;
			var isAbstract = accessFlags & 0x0400 == 0x0400;

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

		console.dir(innerClasses);
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
