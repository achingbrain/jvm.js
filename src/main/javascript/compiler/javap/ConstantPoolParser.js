jjvm.compiler.javap.ConstantPoolParser = function() {
	var regex = /^\s+Constant\spool:/;
	var matchString = /const\s+#([0-9]+)\s+=\s+Asciz\s+(.*);$/;
	var matchInteger = /const\s+#([0-9]+)\s+=\s+int\s+([0-9]+);$/;
	var matchFloat = /const\s+#([0-9]+)\s+=\s+float\s+(.*);$/;
	var matchLong = /const\s+#([0-9]+)\s+=\s+long\s+(.*);$/;
	var matchDouble = /const\s+#([0-9]+)\s+=\s+double\s+(.*);$/;
	var matchClass = /const\s+#([0-9]+)\s+=\s+class\s+#([0-9]+);/;
	var matchStringReference = /const\s+#([0-9]+)\s+=\s+String\s+#([0-9]+);/;
	var matchField = /const\s+#([0-9]+)\s+=\s+Field\s+#([0-9]+)\.#([0-9]+);/;
	var matchMethod = /const\s+#([0-9]+)\s+=\s+Method\s+#([0-9]+)\.#([0-9]+);/;
	var matchInterface = /const\s+#([0-9]+)\s+=\s+InterfaceMethod\s+#([0-9]+)\.#([0-9]+);/;
	var matchNameAndType = /const\s+#([0-9]+)\s+=\s+NameAndType\s+#([0-9]+):#([0-9]+);/;

	this.canParse = function(line) {
		if(line.match(regex)) {
			return true;
		}

		return false;
	};

	this.parse = function(iterator) {
		var pool = new jjvm.types.ConstantPool();

		while(iterator.hasNext()) {
			var line = iterator.next();
			line = _.str.trim(line);

			if(!line) {
				break;
			}

			var match;
			var index;

			if((match = line.match(matchString))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolValue("Asciz", match[2], pool));
			} else if((match = line.match(matchInteger))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolValue("int", parseInt(match[2], 10), pool));
			} else if((match = line.match(matchFloat))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolValue("float", parseFloat(match[2], 10), pool));
			} else if((match = line.match(matchLong))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolValue("long", parseInt(match[2], 10), pool));
			} else if((match = line.match(matchDouble))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolValue("double", parseFloat(match[2], 10), pool));
			} else if((match = line.match(matchClass))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolClassValue(parseInt(match[2], 10), pool));
			} else if((match = line.match(matchStringReference))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolStringReferenceValue(parseInt(match[2], 10), pool));
			} else if((match = line.match(matchField))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolFieldValue(parseInt(match[2], 10), parseInt(match[3], 10), pool));
			} else if((match = line.match(matchMethod))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolMethodValue(parseInt(match[2], 10), parseInt(match[3], 10), pool));
			} else if((match = line.match(matchInterface))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolMethodValue(parseInt(match[2], 10), parseInt(match[3], 10), pool));
			} else if((match = line.match(matchNameAndType))) {
				index = parseInt(match[1], 10);

				pool.store(index, new jjvm.types.ConstantPoolNameAndTypeValue(parseInt(match[2], 10), parseInt(match[3], 10), pool));
			} else {
				throw "ConstantPoolParser cannot parse " + line;
			}
		}

		console.dir(pool.getPool());

		return pool;
	};
};
