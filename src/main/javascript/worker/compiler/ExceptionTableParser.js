jjvm.compiler.ExceptionTableParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var table = [];

		// default catch type is all exceptions
		var type = {
			getClassDef: function() {
				return jjvm.core.ClassLoader.loadClass("java.lang.Throwable");
			}
		};

		while(iterator.hasNext()) {
			var from = iterator.readU16();
			var to = iterator.readU16();
			var target = iterator.readU16();
			var typeIndex = iterator.readU16();

			if(typeIndex !== 0) {
				// catch only specific type
				type = constantsPool.load(typeIndex);
			}

			table.push({
				from: from,
				to: to,
				target: target,
				type: type
			});
		}

		if(table.length === 0) {
			return null;
		}

		return new jjvm.types.ExceptionTable(table);
	};

	this.toString = function() {
		return "ExceptionTableParser";
	};
};
