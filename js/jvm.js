jjvm = {
	core: {

	},
	compiler: {

	},
	runtime: {

	},
	types: {

	},
	ui: {

	},
	nativeMethods: {}
};
jjvm.core.ByteIterator = function(iterable) {
	_.extend(this, new jjvm.core.Iterator(iterable));

	this.readU8 = function() {
		return this.next();
	};

	this.read8 = function() {
		return this._checkSign(this.readU8(), 8);
	};

	this.readU16 = function() {

		// Under 32 bits so can use bitwise operators
		return ((this.readU8() & 0xFF) << 8) + ((this.readU8() & 0xFF) << 0);
	};

	this.read16 = function() {
		return this._checkSign(this.readU16(), 16);
	};

	this.readU32 = function() {

		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU16() * Math.pow(2, 16)) + this.readU16();
	};

	this.read32 = function() {
		return this._checkSign(this.readU32(), 32);
	};

	this.readU64 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU32() * Math.pow(2, 32)) + this.readU32();
	};

	this.read64 = function() {
		return this._checkSign(this.readU64(), 64);
	};

	this.readFloat = function() {
		var bits = this.readU32();

		if(bits == 0x7f800000) {
			return Infinity;
		} else if(bits == 0xff800000) {
			return -Infinity;
		} else if(bits >= 0x7f800001 && bits <= 0x7fffffff) {
			return NaN;
		} else if(bits >= 0xff800001 && bits <= 0xffffffff) {
			return NaN;
		}

		var s = ((bits >> 31) === 0) ? 1 : -1;
		var e = ((bits >> 23) & 0xff);
		var m = (e === 0) ?
				(bits & 0x7fffff) << 1 :
				(bits & 0x7fffff) | 0x800000;

		return s * m * Math.pow(2, e - 150);
	};

	this.readDouble = function() {
		var bits = this.readU64();

		if(bits == 0x7ff0000000000000) {
			return Infinity;
		} else if(bits == 0xfff0000000000000) {
			return -Infinity;
		} else if(bits >= 0x7ff0000000000001 && bits <= 0x7fffffffffffffff) {
			// the spec says NaN here but javap seems to say -0, 
			// which is == to 0 in JavaScript but whatever..
			return -0;
		} else if(bits >= 0xfff0000000000001 && bits <= 0xffffffffffffffff) {
			// the spec says NaN here but javap seems to say 0.
			return 0;
		}

		var s = (this._shiftRight(bits, 63) === 0) ? 1 : -1;
		var e = (this._shiftRight(bits, 52) & 0x7ff);
		var m = (e === 0) ?
			this._shiftLeft(this._64bitAnd(bits, 0xfffffffffffff), 1) :
			this._64bitOr(this._64bitAnd(bits, 0xfffffffffffff), 0x10000000000000);

		return s * m * Math.pow(2, e - 1075);
	};

	this._checkSign = function(value, bits) {
		var max = Math.pow(2, bits - 1);

		// if most significant bit is set, number is negative
		if(Math.abs(value & max) == max) {
			return value - Math.pow(2, bits);
		}

		return value;
	};

	this._shiftLeft = function(value, bits) {
		return parseInt(value * Math.pow(2, bits), 10);
	};

	this._shiftRight = function(value, bits) {
		return parseInt(value / Math.pow(2, bits), 10);
	};

	this._64bitSplit = function(value) {
		value = value.toString(16);
		var low_bytes = parseInt(value.substring(value.length - 8), 16);
		var high_bytes = parseInt(value.substring(0, value.length - 8), 16);

		return [high_bytes, low_bytes];
	};

	this._64bitJoin = function(value) {
		return (value[0] * Math.pow(16, 8)) + value[1];
	};

	this._64bitAnd = function(value, n) {
		var valueBits = this._64bitSplit(value);
		var nBits = this._64bitSplit(n);

		valueBits[0] = valueBits[0] & nBits[0];
		valueBits[1] = valueBits[1] & nBits[1];

		return this._64bitJoin(valueBits);
	};

	this._64bitOr = function(value, n) {
		var valueBits = this._64bitSplit(value);
		var nBits = this._64bitSplit(n);

		valueBits[0] = valueBits[0] | nBits[0];
		valueBits[1] = valueBits[1] | nBits[1];

		return this._64bitJoin(valueBits);
	};
};
jjvm.core.ClassCache = {
	/*load: function(className) {
		if(!localStorage) {
			return null;
		}

		if(!localStorage["jjvm_" + className]) {
			return null;
		}

		jjvm.console.info("loading " + className);
		var data = JSON.parse(localStorage["jjvm_" + className]);

		var classDef = new jjvm.types.ClassDefinition(data);

		jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef, true]);
		jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);

		return classDef;
	},

	store: function(classDef) {
		if(!localStorage) {
			return;
		}

		var data = JSON.stringify(classDef.getData());

		localStorage["jjvm_" + classDef.getName()] = data;
	},

	empty: function(className) {
		if(!localStorage) {
			return;
		}

		for(var key in localStorage) {
			if(key.substr(0, 5) == "jjvm_") {
				delete localStorage[key];
			}
		}
	},

	evict: function(className) {
		if(!localStorage) {
			return;
		}

		if(className instanceof jjvm.types.ClassDefinition) {
			className = className.getName();
		}

		delete localStorage["jjvm_" + className];
	}*/
};
jjvm.core.ClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.ClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.ClassLoader);

		// haven't seen this class before
		jjvm.core.ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.ClassLoader._classes;
	},

	loadClass: function(className) {
		className = className.replace(/\//g, ".");

		var output;

		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == className) {
				output = jjvm.core.ClassLoader._classes[i];
				break;
			}
		}

		if(!output) {
			output = jjvm.core.SystemClassLoader.loadClass(className);
		}

		if(output.hasMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER) && !output.getInitialized()) {
			// has class initializer so execute it
			output.setInitialized(true);
			var frame = new jjvm.runtime.Frame(output, output.getMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER));
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			thread.run();
		}

		return output;
	},

	getObjectRef: function() {
		if(!jjvm.core.ClassLoader._objectRef) {
			jjvm.core.ClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.ClassLoader._objectRef.getClass(), 
				jjvm.core.ClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, ["java.lang.ClassLoader"]), 
				[jjvm.core.SystemClassLoader.getObjectRef()]
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			thread.run();
		}

		return jjvm.core.ClassLoader._objectRef;
	}
};
// Jshint complains if we don't use this.console, Chrome complains if we
// don't use this["console"].  Chrome wins.
var c = "con" + "sole";

// if there's a console, use it, otherwise pass it back to the main thread
jjvm.console = this[c] ? this[c] : {
	debug: function(string) {
		self.postMessage({
			action: "consoleDebug",
			args: JSON.stringify([string])
		});
	},

	info: function(string) {
		self.postMessage({
			action: "consoleInfo",
			args: JSON.stringify([string])
		});
	},

	warn: function(string) {
		self.postMessage({
			action: "consoleWarn",
			args: JSON.stringify([string])
		});
	},

	error: function(string) {
		if(string.stack) {
			_.each(string.stack.split("\n"), function(line) {
				self.postMessage({
					action: "consoleError",
					args: JSON.stringify([line])
				});
			});
		} else if(_.isString(string)) {
			self.postMessage({
				action: "consoleError",
				args: JSON.stringify([string])
			});
		}
	}
};
jjvm.core.Iterator = function(iterable) {
	var index = 0;

	if(!iterable) {
		throw "Cannot iterrate over falsy value!";	
	}

	this.next = function() {
		var output = iterable[index];
		index++;

		return output;
	};

	this.hasNext = function() {
		return index < iterable.length;
	};

	this.peek = function() {
		return iterable[index];
	};

	this.skip = function() {
		index++;
	};

	this.rewind = function() {
		index--;
	};

	this.reset = function() {
		index = 0;
	};

	this.jump = function(location) {
		index = location;
	};

	this.consume = function() {
		index = iterable.length;
	};

	this.getLocation = function() {
		return index;
	};

	this.getIterable = function() {
		return iterable;
	};
};
jjvm.core.SystemClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.SystemClassLoader);

		// haven't seen this class before
		jjvm.core.SystemClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.SystemClassLoader._classes;
	},

	loadClass: function(className) {
		if(jjvm.types.Primitives.primitiveToClass[className]) {
			// convert int to java.lang.Integer
			var className2 = jjvm.types.Primitives.primitiveToClass[className];
		}

		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[i];
			}
		}

		if(_.string.startsWith(className, "[")) {
			var clazz = new jjvm.types.ClassDefinition({
				getValue: function() {
					return className;
				}
			}, {
				getValue: function() {
					return "java.lang.Object";
				}
			});

			jjvm.core.SystemClassLoader.addClassDefinition(clazz);

			return clazz;
		}

		/*var cached = jjvm.core.ClassCache.load(className);

		if(cached) {
			jjvm.core.SystemClassLoader._classes.push(cached);

			return cached;
		}*/

		jjvm.console.info("Downloading " + className);

		// Have to use synchronous request here and as such can't use html5
		// response types as they make the UI unresponsive even though
		// we're in a non-UI thread.  Thanks for nothing W3C.
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "../rt/" + className.replace(/\./g, "/") + ".json", false);
		xhr.send();

		if(xhr.status == 200) {
			var bytes = JSON.parse(xhr.responseText);

			var compiler = new jjvm.compiler.Compiler();
			compiler.compileSystemBytes(bytes);
		}

		for(var n = 0; n < jjvm.core.SystemClassLoader._classes.length; n++) {
			if(jjvm.core.SystemClassLoader._classes[n].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[n];
			}
		}

		throw "NoClassDefFound: " + className;
	},

	getObjectRef: function() {
		if(!jjvm.core.SystemClassLoader._objectRef) {
			jjvm.core.SystemClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.SystemClassLoader._objectRef.getClass(), 
				jjvm.core.SystemClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, [])
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			thread.run();
		}

		return jjvm.core.SystemClassLoader._objectRef;
	}
};

jjvm.core.Watchable = {

	register: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
	},

	registerOneTimeListener: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
		listener.____oneTime = true;
	},

	deRegister: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};

			return false;
		}

		if(this._observers[eventType] === undefined) {
			return false;
		}

		var lengthBefore = this._observers[eventType].length;

		this._observers[eventType] = _.without(this._observers[eventType], listener);

		var lengthAfter = this._observers[eventType].length;

		var deregistered = lengthBefore != lengthAfter;

		if(!deregistered) {
			throw "Failed to deregister " + listener + " for event type " + eventType;
		}

		return deregistered;
	},

	dispatch: function(eventType, args) {
		if(!this._observers) {
			this._observers = {};
		}

		if(args === undefined) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.Watchable#dispatch as args";
		}

		if(this._observers[eventType] !== undefined) {
			var observerArgs = [this];
			observerArgs = observerArgs.concat(args);

			// copy the array in case the listener deregisters itself as part of the callback
			var observers = this._observers[eventType].concat([]);

			for(var i = 0; i < observers.length; i++) {
				observers[i].apply(observers[i], observerArgs);

				if(observers[i].____oneTime === true) {
					this.deRegister(eventType, observers[i]);
				}
			}
		}

		// inform global listeners
		//jjvm.console.info("dispatching " + eventType + " with args " + args);
		jjvm.core.NotificationCentre.dispatch(this, eventType, args);
	}
};
jjvm.core.DOMUtil = {
	create: function(type, content, attributes) {
		// if we've been passed two arguments, see if the second is content or attributes
		if(!attributes && _.isObject(content) && !_.isString(content) && !_.isArray(content) && !_.isElement(content)) {
			attributes = content;
			content = null;
		}

		if(type && content && attributes) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && content) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && attributes) {
			return jjvm.core.DOMUtil._createEmpty(type, attributes);
		} else {
			return jjvm.core.DOMUtil._createEmpty(type);
		}

		//jjvm.console.error("jjvm.core.DOMUtil.create passed wrong number of arguments.  Expected 1, 2 or 3, was " + arguments.length);
	},

	_create: function(type, content, attributes) {
		var output = jjvm.core.DOMUtil._createEmpty(type, attributes);

		jjvm.core.DOMUtil.append(content, output);

		return output;
	},

	_createEmpty: function(type, attributes) {
		var output = document.createElement(type);

		if(attributes) {
			for(var key in attributes) {
				output[key] = attributes[key];
			}
		}

		return output;
	},

	append: function(content, node) {
		if(_.isString(content)) {
			jjvm.core.DOMUtil._appendText(content, node);
		} else if(_.isArray(content)) {
			for(var i = 0; i < content.length; i++) {
				jjvm.core.DOMUtil.append(content[i], node);
			}
		} else if(_.isElement(content)) {
			node.appendChild(content);
		}
	},

	_appendText: function(content, node) {
		node.appendChild(document.createTextNode(content));
	}
};
jjvm.core.NotificationCentre = {
	_listeners: {},

	register: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			jjvm.core.NotificationCentre._listeners[eventType] = [];
		}

		jjvm.core.NotificationCentre._listeners[eventType].push(listener);
	},

	deRegister: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		for(var i = 0; i < jjvm.core.NotificationCentre._listeners[eventType].length; i++) {
			if(jjvm.core.NotificationCentre._listeners[eventType][i] == listener) {
				jjvm.core.NotificationCentre._listeners[eventType].splice(i, 1);
				i--;
			}
		}
	},

	dispatch: function(sender, eventType, args) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		if(!args) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.NotificationCentre#dispatch as args";
		}

		var observerArgs = [sender];
		observerArgs = observerArgs.concat(args);

		// copy the array in case the listener deregisters itself as part of the callback
		var observers = jjvm.core.NotificationCentre._listeners[eventType].concat([]);

		for(var i = 0; i < observers.length; i++) {
			observers[i].apply(observers[i], observerArgs);
		}
	}
};

jjvm.ui.ClassDropper = function(element) {
	
	this.onDragEnter = function(event) {
		event.preventDefault();

		$(element).addClass("dragging");
	};

	this.onDragExit = function(event) {
		event.preventDefault();	

		$(element).removeClass("dragging");
	};

	this.onDragOver = function(event) {
		event.preventDefault();
	};

	this.onDrop = function(event) {
		event.preventDefault();

		$(element).removeClass("dragging");

		var files = event.originalEvent.dataTransfer.files;

		for(var i = 0; i < files.length; i++) {
			jjvm.ui.JJVM.jvm.compile(files[i]);
		}
	};

	$(element).on("dragenter", _.bind(this.onDragEnter, this));
	$(element).on("dragexit", _.bind(this.onDragExit, this));
	$(element).on("dragover", _.bind(this.onDragOver, this));
	$(element).on("drop", _.bind(this.onDrop, this));
};

jjvm.ui.ClassOutliner = function(element) {
	var _userList = $(element).find("ul.user").get(0);
	var _systemList = $(element).find("ul.system").get(0);
	var _listElements = {};

	this._onExecutionComplete = function() {
		$(_userList).find("li").removeClass("executing");
		$(_systemList).find("li").removeClass("executing");
	};

	this._onBeforeInstructionExecution = function(__, frame) {
		if(frame.isSystemFrame || !frame.isCurrentFrame || !frame.isExecutionSuspended) {
			return;
		}

		this._highlight(frame.className, frame.methodSignature, frame.currentInstruction);
	};

	this._onAfterInstructionExecution = function(__, frame) {
		if(frame.isSystemFrame || !frame.isCurrentFrame || !frame.isExecutionSuspended) {
			return;
		}

		// if there's no next instruction we are returning so don't remove the highlight
		if(frame.nextInstruction) {
			this._highlight(frame.nextInstruction.className, frame.nextInstruction.methodSignature, frame.nextInstruction.instruction);
		}
	};

	this._onBreakpointEncountered = function(__, frame) {
		if(frame.isSystemFrame || !frame.isCurrentFrame || !frame.isExecutionSuspended) {
			return;
		}

		this._highlight(frame.className, frame.methodSignature, frame.currentInstruction);
	};

	this._highlight = function(className, methodSignature, instruction) {
		$(element + " li").removeClass("executing");

		if(!instruction) {
			return;
		}
		
		var listElement = _listElements[className][methodSignature][instruction.location];

		$(listElement).addClass("executing");

		if(_.string.endsWith(instruction.mnemonic, "return")) {
			$(listElement).addClass("return");
		}

		// ensure whatever's highlighted is visible are expanded
		var parent = listElement.parentNode;

		while(parent) {
			if(parent.style && parent.style.display == "none") {
				parent.style.display = "block";
			}

			parent = parent.parentNode;
		}

		// stop previous scroll animation
		$(element).stop(true, false);
		$(element).scrollTo(listElement, 200, {"axis": "y", "offset": -100});
	};

	this._buildClassList = function(sender, classDef, isSystemClass) {
		if(isSystemClass) {
			this._buildClassOutline(classDef, _systemList, false);
		} else {
			this._buildClassOutline(classDef, _userList, true);
		}
	};

	this._buildClassOutline = function(classDef, list, startExpanded) {
		var innerList = jjvm.core.DOMUtil.create("ul");

		this._buildFieldList(innerList, classDef.name, classDef.fields);
		this._buildMethodList(innerList, classDef.name, classDef.methods);

		var link = jjvm.core.DOMUtil.create("a", [
			(classDef.visibility == "public" ? this._formatKeyword("public") : ""),
			" ",
			(classDef.isAbstract ? this._formatKeyword("abstract") : ""),
			" ",
			(classDef.isFinal ? this._formatKeyword("final") : ""),
			" ",
			(classDef.isInterface ? this._formatKeyword("interface") : this._formatKeyword("class")),
			" ",
			classDef.name,
			(classDef.parent ? [
				" ", this._formatKeyword("extends"), " ", classDef.parent
			] : ""),
			(classDef.interfaces.length > 0 ? [
				" ", this._formatKeyword("implements"), " ", this._formatInterfaces(classDef.interfaces)
			] : "")
		]);

		var classInfo = "";

		if(classDef.sourceFile) {
			classInfo = jjvm.core.DOMUtil.create("small", [
				classDef.sourceFile, " / ", this._formatVersion(classDef.majorVersion, classDef.minorVersion)
			], {className: "muted"});
		}

		$(link).click(function(event) {
			event.preventDefault();
			innerList.style.display = innerList.style.display == "none" ? "block" : "none";
		});

		var listHolder = jjvm.core.DOMUtil.create("li", [
			classInfo,
			link,
			innerList
		]);

		if(!startExpanded) {
			innerList.style.display = "none";
		}

		list.appendChild(listHolder);
	};

	this._buildFieldList = function(list, className, fields) {
		var index = 0;

		for(var name in fields) {
			var field = fields[name];
			var cssClass = "field " + field.visibility + (index === 0 ? " first" : "");
			var iconClass = "icon-white ";

			if(field.visibility == "public") {
				iconClass += "icon-plus";
			} else if(field.visibility == "private") {
				iconClass += "icon-minus";
			} else if(field.visibility == "protected") {
				iconClass += "icon-asterisk";
			}

			list.appendChild(jjvm.core.DOMUtil.create("li", [
				jjvm.core.DOMUtil.create("icon", {className: iconClass}),
				" ", 
				this._formatVisibility(field.visibility),
				" ",
				this._formatType(field.type),
				" ",
				(field.isStatic ? this._formatKeyword("static") : ""),
				" ",
				(field.isFinal ? this._formatKeyword("final") : ""),
				" ",
				field.name
			]));

			index++;
		}
	};

	this._buildMethodList = function(list, className, methods) {
		var index = 0;

		for(var name in methods) {
			var method = methods[name];
			var cssClass = "method " + method.visibility + (index === 0 ? " first" : "");
			var iconClass = "icon-white ";

			if(method.visibility == "public") {
				iconClass += "icon-plus";
			} else if(method.visibility == "private") {
				iconClass += "icon-minus";
			} else if(method.visibility == "protected") {
				iconClass += "icon-asterisk";
			}

			var methodSignature = jjvm.core.DOMUtil.create("li", [
				jjvm.core.DOMUtil.create("icon", {className: iconClass}),
				" ", 
				this._formatVisibility(method.visibility),
				" ",
				(method.isStatic ? this._formatKeyword("static") : ""),
				" ",
				(method.isFinal ? this._formatKeyword("final") : ""),
				" ", 
				(method.isSynchronized ? this._formatKeyword("synchronized") : ""),
				" ",
				this._formatType(method.returns),
				" ",
				method.name,
				"(",
				this._formatTypes(method.args),
				")"
			]);

			list.appendChild(methodSignature);

			var instructionList = jjvm.core.DOMUtil.create("ul", {className: "instruction_list"});
			methodSignature.appendChild(instructionList);

			if(method.isNative) {
				jjvm.core.DOMUtil.append(jjvm.core.DOMUtil.create("li", "Native code", {className: "muted"}), instructionList);
			} else if(method.instructions.length > 0) {
				for(var i = 0; i < method.instructions.length; i++) {
					var instruction = method.instructions[i];
					var checkbox = jjvm.core.DOMUtil.create("input", {
						type: "checkbox",
						onchange: this._getBreakpointCallback(className, method.signature, instruction)
					});

					var listItem = jjvm.core.DOMUtil.create("li", [
						checkbox,
						" ",
						instruction.location + ": " + instruction.description
					]);

					if(!_listElements[className]) {
						_listElements[className] = {};
					}

					if(!_listElements[className][method.signature]) {
						_listElements[className][method.signature] = [];
					}

					_listElements[className][method.signature][instruction.location] = listItem;

					instructionList.appendChild(listItem);
				}
			} else if(!method.isAbstract) {
				jjvm.core.DOMUtil.append(jjvm.core.DOMUtil.create("li", "Missing"), instructionList);
			}

			index++;
		}
	};

	this._getBreakpointCallback = function(className, methodSignature, instruction) {
		return function() {
			jjvm.ui.JJVM.jvm.setBreakpoint(className, methodSignature, instruction.location, this.checked);
		};
	};

	this._formatVisibility = function(visibility) {
		var cssClass;

		if(visibility == "public") {
			cssClass = "text-success";
		} else if(visibility == "protected") {
			cssClass = "text-warning";
		} else {
			cssClass = "text-error";
		}

		return jjvm.core.DOMUtil.create("span", visibility, {className: cssClass});
	};

	this._formatKeyword = function(keyword) {
		return jjvm.core.DOMUtil.create("span", keyword, {className: "text-warning"});
	};

	this._formatType = function(type) {
		return jjvm.core.DOMUtil.create("span", type, {className: "text-info"});
	};

	this._formatTypes = function(types) {
		var output = [];

		$.each(types, _.bind(function(index, type) {
			output.push(this._formatType(type));

			if(index < (types.length - 1)) {
				output.push(", ");
			}
		}, this));

		return output;
	};

	this._formatInterfaces = function(interfaces) {
		var output = [];

		for(var i = 0; i < interfaces.length; i++) {
			output.push(interfaces[i]);
		}

		return output.join(", ");
	};

	this._formatVersion = function(majorVersion, minorVersion) {
		var versions = {
			0x2D: "Java 1.1",
			0x2E: "Java 1.2",
			0x2F: "Java 1.3",
			0x30: "Java 1.4",
			0x31: "Java 5",
			0x32: "Java 6",
			0x33: "Java 7",
			0x34: "Java 8"
		};

		return versions[majorVersion];
	};

	jjvm.core.NotificationCentre.register("onClassDefined", _.bind(this._buildClassList, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._onBeforeInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onAfterInstructionExecution", _.bind(this._onAfterInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onBreakpointEncountered", _.bind(this._onBreakpointEncountered, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._onExecutionComplete, this));
};

jjvm.ui.Console = function(element) {
	$(element).find("button#button_console_clear").click(_.bind(function(event) {
		event.preventDefault();
		this.clear();
	}, this));

	var LEVELS = {
		"ERROR": 4,
		"WARN": 3,
		"INFO": 2,
		"DEBUG": 1
	};

	if(!window.localStorage.jvm_log_level) {
		window.localStorage.jvm_log_level = LEVELS.INFO;
	}

	$(element).find("a#button_console_set_error").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.ERROR;
	}, this));

	$(element).find("a#button_console_set_warn").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.WARN;
	}, this));

	$(element).find("a#button_console_set_info").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.INFO;
	}, this));

	$(element).find("a#button_console_set_debug").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.DEBUG;
	}, this));

	this.debug = function(message) {
		jjvm.console.debug(message);
		this._addLogLine(message, "muted", "icon-wrench", 1);
	};

	this.info = function(message) {
		jjvm.console.info(message);
		this._addLogLine(message, "text-info", "icon-info-sign", 2);
	};

	this.warn = function(message) {
		jjvm.console.warn(message);
		this._addLogLine(message, "text-warning", "icon-exclamation-sign", 3);
	};

	this.error = function(message) {
		jjvm.console.error(message);
		this._addLogLine(message, "text-error", "icon-remove-sign", 4);
	};

	this.clear = function() {
		$(element).find("ul").empty();
	};

	this._addLogLine = function(message, cssClass, iconClass, level) {
		if(level < window.localStorage.jvm_log_level) {
			return;
		}

		var icon = document.createElement("i");
		icon.className = "icon-white " + iconClass;

		var logLine = document.createElement("li");
		logLine.className = cssClass;
		logLine.appendChild(icon);
		logLine.appendChild(document.createTextNode(" " + message));

		$(element).find("ul#console_area").append(logLine);

		$(element).scrollTop($(element)[0].scrollHeight);
	};
};

jjvm.ui.FrameWatcher = function(localVariableTable, stackTable, title) {
	
	this._update = function(frame) {
		if(frame.isSystemFrame) {
			return;
		}

		this._updateLocalVariableTable(frame.localVariables);
		this._updateStackTable(frame.stack);

		$(title).empty();
		$(title).append(_.escape(frame.className + "#" + frame.methodSignature));
	};

	this._updateLocalVariableTable = function(localVariables) {
		$(localVariableTable).empty();
		var topRow = $("<tr></tr>");
		var bottomRow = $("<tr></tr>");
		var thead = $("<thead></thead>");
		$(thead).append(topRow);
		var tbody = $("<tbody></tbody>");
		$(tbody).append(bottomRow);
		$(localVariableTable).append(thead);
		$(localVariableTable).append(tbody);

		$.each(localVariables, function(index, entry) {
			$(topRow).append("<th>" + index + "</th>");
			$(bottomRow).append("<td>" + entry + "</td>");
		});
	};

	this._updateStackTable = function(stack) {
		$(stackTable).empty();
		
		var tbody = $("<tbody></tbody>");
		$(stackTable).append(tbody);

		var minItems = 5 - stack.length;

		for(var i = 0; i < minItems; i++) {
			$(tbody).append("<tr><td>&nbsp;</td></tr>");
		}

		for(var n = (stack.length -1); n >= 0; n--) {
			$(tbody).append("<tr><td>" + stack[n] + "</td></tr>");
		}
	};

	jjvm.core.NotificationCentre.register("onInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onAfterInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onCurrentFrameChanged", _.bind(function(_, thread, frame) {
		this._update(frame);
	}, this));
};

jjvm.ui.JJVM = {
	console: null,
	_frameWatcher: null,
	_classOutliner: null,
	_threadWatcher: null,
	_classDropper: null,
	jvm: null,

	init: function() {
		// no compilation while we do setup
		$("#button_compile").attr("disabled", true);

		jjvm.ui.JJVM.jvm = new jjvm.ui.JVM();

		// set up gui
		jjvm.ui.JJVM.console = new jjvm.ui.Console("#console");
		jjvm.ui.JJVM._frameWatcher = new jjvm.ui.FrameWatcher("#localVariables", "#stack", "#frame h3 small"),
		jjvm.ui.JJVM._classOutliner = new jjvm.ui.ClassOutliner("#classes"),
		jjvm.ui.JJVM._threadWatcher = new jjvm.ui.ThreadWatcher("#threads > ul"),
		jjvm.ui.JJVM._classDropper = new jjvm.ui.ClassDropper("#program_define");

		// initialy disabled debug buttons
		$("#button_resume").attr("disabled", true);
		$("#button_pause").attr("disabled", true);
		$("#button_step_over").attr("disabled", true);
		$("#button_step_into").attr("disabled", true);
		$("#button_step_out").attr("disabled", true);
		$("#button_drop_to_frame").attr("disabled", true);

		// set up debug button listeners
		$("#button_resume").click(function() {
			jjvm.ui.JJVM.jvm.resumeExecution(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_pause").click(function() {
			jjvm.ui.JJVM.jvm.suspendExecution(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_over").click(function() {
			jjvm.ui.JJVM.jvm.stepOver(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_into").click(function() {
			jjvm.ui.JJVM.jvm.stepInto(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_out").click(function() {
			jjvm.ui.JJVM.jvm.stepOut(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_drop_to_frame").click(function() {
			jjvm.ui.JJVM.jvm.dropToFrame(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});

		// enable compile and run buttons when we have source code
		$("#source").bind("keyup", function() {
			if($("#source").val()) {
				$("#button_compile").removeAttr("disabled");
			} else {
				$("#button_compile").attr("disabled", true);
			}
		});

		// set up button listeners
		$("#button_run").click(jjvm.ui.JJVM.run);

		jjvm.core.NotificationCentre.register("onCompileSuccess", function() {
			if(window.webkitNotifications && window.webkitNotifications.checkPermission() === 0) {
				var notification = window.webkitNotifications.createNotification("icon.png", "JJVM", "Compilation complete");
				notification.show();
			}
		});
		jjvm.core.NotificationCentre.register("onCompileError", function(sender, error) {
			jjvm.ui.JJVM.console.error("Compilation error!");
			jjvm.ui.JJVM.console.error(error);
		});

		jjvm.core.NotificationCentre.register("onCompileWarning", function(sender, warning) {
			jjvm.ui.JJVM.console.warn(warning);
		});

		jjvm.core.NotificationCentre.register("onBreakpointEncountered", function() {
			$("#button_run").attr("disabled", true);
			$("#button_resume").removeAttr("disabled");
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").removeAttr("disabled");
			$("#button_step_into").removeAttr("disabled");
			$("#button_step_out").removeAttr("disabled");
			$("#button_drop_to_frame").removeAttr("disabled");
		});

		jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
			// reset buttons
			$("#button_run").removeAttr("disabled");
			$("#button_resume").attr("disabled", true);
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").attr("disabled", true);
			$("#button_step_into").attr("disabled", true);
			$("#button_step_out").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);
		});

		jjvm.core.NotificationCentre.register("onExecutionStarted", function() {
			$("#button_run").attr("disabled", true);
			$("#button_resume").attr("disabled", true);
			$("#button_pause").removeAttr("disabled");
			$("#button_step_over").attr("disabled", true);
			$("#button_step_into").attr("disabled", true);
			$("#button_step_out").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);
		});

		// all done, enable input
		$("#source").removeAttr("disabled");

		// if we've already got input, enable the compile button
		if($("#source").val()) {
			$("#button_compile").removeAttr("disabled");
		}

		// html5 notifications!
		if(window.webkitNotifications) {
			var permissions = window.webkitNotifications.checkPermission();

			if(permissions === 0) {
				// granted
			} else if(permissions === 1) {
				// not yet granted
				window.webkitNotifications.requestPermission();
			} else if(permissions === 2) {
				// blocked
			}
		}
	},

	run: function(event) {
		event.preventDefault();

		jjvm.ui.JJVM.jvm.run([$("#program_run input").val().split(",")]);
	}
};
jjvm.ui.JVM = function() {
	var _worker = new Worker("js/jvm_compiler_worker.js");

	_worker.onmessage = function(event) {
		var actions = {
			"postNotification": function(type, args) {
				jjvm.core.NotificationCentre.dispatch(this, type, args);
			},
			"consoleError": function(message) {
				jjvm.ui.JJVM.console.error(message);
			},
			"consoleWarn": function(message) {
				jjvm.ui.JJVM.console.warn(message);
			},
			"consoleInfo": function(message) {
				jjvm.ui.JJVM.console.info(message);
			},
			"consoleDebug": function(message) {
				jjvm.ui.JJVM.console.debug(message);
			},
			"getThreads": function(threads) {
				jjvm.core.NotificationCentre.dispatch(this, "onGotThreads", [threads]);
			}
		};

		var args = JSON.parse(event.data.args);

		if(actions[event.data.action]) {
			actions[event.data.action].apply(actions[event.data.action], args);
		} else {
			jjvm.console.error("Unknown action from worker " + event.data.action);
		}
	};

	// takes a File or Blob object
	this.compile = function(file) {
		var reader = new FileReader();

		// init the reader event handlers
		reader.onload = _.bind(this._onFileLoaded, this, file);

		// begin the read operation
		reader.readAsArrayBuffer(file);
	};

	this._onFileLoaded = function(file, event) {
		_worker.postMessage({
			action: "compile",
			args: [new Uint8Array(event.target.result)]
		});
	};

	this.run = function(args) {
		_worker.postMessage({
			action: "run",
			args: [args]
		});
	};

	this.setBreakpoint = function(className, methodSignature, instructionIndex, setBreakpoint) {
		_worker.postMessage({
			action: "setBreakpoint",
			args: [className, methodSignature, instructionIndex, setBreakpoint]
		});
	};

	this.resumeExecution = function(threadName) {
		_worker.postMessage({
			action: "resumeExecution",
			args: [threadName]
		});	
	};

	this.suspendExecution = function(threadName) {
		_worker.postMessage({
			action: "suspendExecution",
			args: [threadName]
		});	
	};

	this.stepOver = function(threadName) {
		_worker.postMessage({
			action: "stepOver",
			args: [threadName]
		});	
	};

	this.stepInto = function(threadName) {
		_worker.postMessage({
			action: "stepInto",
			args: [threadName]
		});	
	};

	this.stepOut = function(threadName) {
		_worker.postMessage({
			action: "stepOut",
			args: [threadName]
		});	
	};

	this.dropToFrame = function(threadName) {
		_worker.postMessage({
			action: "dropToFrame",
			args: [threadName]
		});	
	};

	this.getThreads = function() {
		_worker.postMessage({
			action: "getThreads",
			args: []
		});	
	};
};

jjvm.ui.ThreadWatcher = function(list) {
	var _selectedThread;

	this.getSelectedThread = function() {
		return _selectedThread;
	};

	this.setSelectedThread = function(thread) {
		_selectedThread = thread;
	};

	this._update = function(sender, threads) {
		$(list).empty();

		_.each(threads, _.bind(function(thread) {
			if(!_selectedThread) {
				_selectedThread = thread;
			}

			this._addThread(thread);
		}, this));
	};

	this._addThread = function(thread) {
		var threadName;

		if(_selectedThread == thread) {
			threadName = jjvm.core.DOMUtil.create("span", 
				jjvm.core.DOMUtil.create("i", thread.name, {className: "icon-arrow-right icon-white"})
			);
		} else {
			threadName = jjvm.core.DOMUtil.create("a", thread.name);

			threadName.onclick = _.bind(function(event) {
				event.preventDefault();

				_selectedThread = thread;
				//this._update();
			}, this);
		}

		var li = jjvm.core.DOMUtil.create("li", threadName);

		if(thread.status == "RUNNABLE") {
			threadName.className += " text-success";
		} else if(thread.status == "TERMINATED") {
			threadName.className += " muted";
		} else if(thread.status == "NEW") {
			threadName.className += " text-info";
		} else if(thread.status == "BLOCKED") {
			threadName.className += " text-error";
		} else if(thread.status == "WAITING") {
			threadName.className += " text-warn";
		} else if(thread.status == "TIMED_WAITING") {
			threadName.className += " text-warn";
		}

		var frameList = jjvm.core.DOMUtil.create("ul");

		_.each(thread.frames, function(frame) {
			frameList.appendChild(jjvm.core.DOMUtil.create("li", frame.className + "#" + frame.methodSignature));
		});

		li.appendChild(frameList);
		$(list).append(li);
	};

	jjvm.core.NotificationCentre.register("onGotThreads", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onBreakpointEncountered", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onExecutionStarted", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onThreadGC", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
};
