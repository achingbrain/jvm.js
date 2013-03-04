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

	}
};
// Methods specified here will override any specified in bytecode.
//
// If you compile bytecode with native methods, you should specify
// an implementation of the method here, otherwise a compile time
// warning will be generated and your code will likely fail at
// run time.
jjvm.nativeMethods = {

	"java.lang.Object": {
		"registerNatives()V": function() {
			
		}
	},

	"java.io.PrintStream": {
		"println(Ljava/lang/String;):V": function(line) {
			jjvm.ui.JJVM.console.info(line);
		}
	}
};

jjvm.core.ByteIterator = function(iterable) {
	_.extend(this, new jjvm.core.Iterator(iterable));

	this.readU8 = function() {
		return this.next();
	};

	this.readU16 = function() {
		// Under 32 bits so can use bitwise operators
		return ((this.readU8() & 0xFF) << 8) + ((this.readU8() & 0xFF) << 0);
	};

	this.readU32 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU16() * Math.pow(2, 16)) + this.readU16();
	};

	this.readU64 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU32() * Math.pow(2, 32)) + this.readU32();
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
			return NaN;
		} else if(bits >= 0xfff0000000000001 && bits <= 0xffffffffffffffff) {
			return NaN;
		}

		var s = (this._shiftRight(bits, 63) === 0) ? 1 : -1;
		var e = (this._shiftRight(bits, 52) & 0x7ff);
		var m = (e === 0) ?
			this._shiftLeft(this._64bitAnd(bits, 0xfffffffffffff), 1) :
			this._64bitOr(this._64bitAnd(bits, 0xfffffffffffff), 0x10000000000000);
		
		return s * m * Math.pow(2, e - 1075);
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
jjvm.core.ClassLoader = {
	_classes: [],

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.ClassLoader._classes[i] = classDef;

				return;
			}
		}

		// haven't seen this class before
		jjvm.core.ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.ClassLoader._classes;
	},

	loadClass: function(className) {
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == className) {
				return jjvm.core.ClassLoader._classes[i];
			}
		}

		return jjvm.core.SystemClassLoader.loadClass(className);
	}
};
jjvm.core.Iterator = function(iterable) {
	var index = 0;

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

	this.getLocation = function() {
		return index;
	};

	this.getIterable = function() {
		return iterable;
	};
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

		if(!(args instanceof Array)) {
			args = [args];
		}

		args.unshift(sender);

		for(var i = 0; i < jjvm.core.NotificationCentre._listeners[eventType].length; i++) {
			jjvm.core.NotificationCentre._listeners[eventType][i].apply(this, args);
		}
	}
};

jjvm.core.SystemClassLoader = {
	_classes: [],

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		// haven't seen this class before
		jjvm.core.SystemClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.SystemClassLoader._classes;
	},

	loadClass: function(className) {
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[i];
			}
		}

		throw "NoClassDefFound: " + className;
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
			console.debug("Failed to deregister " + listener + " for event type " + eventType);
		}

		return deregistered;
	},

	dispatch: function(eventType, args) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] !== undefined) {
			var otherArgs = [this];

			if(args) {
				if(args instanceof Array) {
					otherArgs = otherArgs.concat(args);
				} else {
					otherArgs.push(args);
				}
			}

			var observers = this._observers[eventType].concat([]);

			for(var i = 0; i < observers.length; i++) {
				observers[i].apply(observers[i], otherArgs);
			}
		}

		// inform global listeners
		jjvm.core.NotificationCentre.dispatch(this, eventType, args);
	}
};
jjvm.types.ByteCode = function(mnemonic, operation, args, location, constantPool) {
	var _breakpoint;

	var invokeMethod = function(methodDef, frame) {
		var args = [];

		for(var i = 0; i < methodDef.getArgs().length; i++) {
			args.push(frame.getStack().pop());
		}

		if(methodDef.isStatic && !methodDef.isStatic()) {
			args.unshift(frame.getStack().pop());
		}

		var onChildExecutionCompleted = function(frame, output) {
			var deregistered = frame.deRegister("onChildFrameCompleted", this);

			if(output !== undefined) {
				frame.getStack().push(output);
			}
		};

		frame.register("onChildFrameCompleted", onChildExecutionCompleted);

		frame.executeChild(methodDef.getClassDef(), methodDef, args);
	};

	var operations = {
		"nop": function() {
			this.execute = function(frame, constantPool) {
				
			};
		},
		"push": function(value) {
			this.execute = function(frame, constantPool) {
				frame.getStack().push(value);
			};
		},
		"load": function(location) {
			this.execute = function(frame, constantPool) {
				var value = frame.getLocalVariables().load(location);
				frame.getStack().push(value);
			};
		},
		"array_load": function() {
			this.execute = function(frame, constantPool) {
				var array = frame.getStack().pop();
				var index = frame.getStack().pop();

				if(index >= array.length) {
					throw "ArrayIndexOutOfBoundsExecption: " + index;
				}

				frame.getStack().push(array[index]);
			};
		},
		"store": function(location) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getLocalVariables().store(location, value);
			};
		},
		"array_store": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				array[index] = value;
			};
		},
		"pop": function() {
			this.execute = function(frame, constantPool) {
				frame.getStack().pop();
			};
		},
		"pop2": function() {
			this.execute = function(frame, constantPool) {
				frame.getStack().pop();
				frame.getStack().pop();
			};
		},
		"dup": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getStack().push(value);
				frame.getStack().push(value);
			};
		},
		"dup2": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup2_x1": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup2_x2": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();
				var value4 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value4);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup_x1": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup_x2": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"swap": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"add": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1 + value2);
			};
		},
		"sub": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 - value1);
			};	
		},
		"mul": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1 * value2);
			};	
		},
		"div": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 / value1);
			};	
		},
		"rem": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 % value1);
			};	
		},
		"neg": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();

				frame.getStack().push(-1 * value1);
			};	
		},
		"shift_left": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 << value2);
			};
		},
		"arithmetic_shift_right": function() {
			this.execute = function(frame, constantPool) {
				// this probably won't work for > 32bit integers
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 >> value2);
			};
		},
		"logical_shift_right": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 >>> value2);
			};
		},
		"and": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 & value2);
			};
		},
		"or": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 | value2);
			};
		},
		"xor": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 ^ value2);
			};
		},
		"increment": function(location, amount) {
			this.execute = function(frame, constantPool) {
				var value = frame.getLocalVariables().load(location);

				frame.getStack().push(value + amount);
			};
		},
		"compare": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 == value2);
			};	
		},
		"if_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 == value2) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_not_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 != value2) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_less_than": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 < value2) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_greater_than_or_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 >= value2) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_greater_than": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 > value2) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_less_than_or_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 <= value2) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"goto": function(goingTo) {
			this.execute = function(frame, constantPool) {
				throw new jjvm.runtime.Goto(goingTo);
			};
		},
		"jsr": function(goingTo) {
			this.execute = function(frame, constantPool) {
				throw new jjvm.runtime.Goto(goingTo);
			};
		},
		"ret": function(location) {
			this.execute = function(frame, constantPool) {
				var goingTo = frame.getLocalVariables().load(location);

				throw new jjvm.runtime.Goto(goingTo);
			};
		},
		"tableswitch": function(low, high, table) {
			this.execute = function(frame, constantPool) {
				throw "tableswitch is not implemented";
			};
		},
		"lookupswitch": function(table) {
			this.execute = function(frame, constantPool) {
				throw "lookupswitch is not implemented";
			};
		},
		"return": function(string) {
			this.execute = function(frame, constantPool) {
				return frame.getStack().pop();
			};
		},
		"get_static": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var classDef = fieldDef.getClassDef();
				var value = classDef.getStaticField(fieldDef.getName());

				frame.getStack().push(value);
			};
			this.describe = function() {
				return "getstatic #" + index + " // " + constantPool.load(index);
			};
		},
		"put_static": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var classDef = fieldDef.getClassDef();
				var value = frame.getStack().pop();

				classDef.setStaticField(fieldDef.getName(), value);
			};
		},
		"get_field": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();

				var objectRef = frame.getStack().pop();
				var value = objectRef.getField(fieldDef.getName());

				frame.getStack().push(value);
			};
		},
		"put_field": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();

				var value = frame.getStack().pop();
				var objectRef = frame.getStack().pop();

				objectRef.setField(fieldDef.getName(), value);
			};
		},
		"invoke_virtual": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
			this.describe = function() {
				return "invokevirtual #" + index + " // " + constantPool.load(index);
			};
		},
		"invoke_special": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
			this.describe = function() {
				return "invokespecial #" + index + " // " + constantPool.load(index);
			};
		},
		"invoke_static": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
			this.describe = function() {
				return "invokestatic #" + index + " // " + constantPool.load(index);
			};
		},
		"invoke_interface": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
			this.describe = function() {
				return "invokeinterface #" + index + " // " + constantPool.load(index);
			};
		},
		"invoke_dynamic": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
			this.describe = function() {
				return "invokedynamic #" + index + " // " + constantPool.load(index);
			};
		},
		"new": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();

				frame.getStack().push(new jjvm.runtime.ObjectReference(classDef));
			};
			this.describe = function() {
				return "new #" + index + " // " + constantPool.load(index);
			};
		},
		"array_create": function(index) {
			this.execute = function(frame, constantPool) {
				var length = frame.getStack().pop();
				var array = [];
				array.length = length;

				frame.getStack().push(array);
			};
		},
		"array_length": function() {
			this.execute = function(frame, constantPool) {
				var array = frame.getStack().pop();

				frame.getStack().push(array.length);
			};
		},
		"throw": function(string) {
			this.execute = function(frame, constantPool) {
				var throwable = frame.getStack().pop();

				// is this too literal?
				throw throwable;
			};
		},
		"check_cast": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();
				var objectRef = frame.getStack().pop();

				if(!objectRef.isInstanceOf(classDef)) {
					throw "ClassCastException: Object of type " + objectRef.getClass().getName() + " cannot be cast to " + classDef.getName();
				}
			};	
		},
		"instance_of": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();
				var objectRef = frame.getStack().pop();

				frame.getStack().push(objectRef.isInstanceOf(classDef));
			};
		},
		"monitor_enter": function() {
			this.execute = function(frame, constantPool) {
				// don't support synchronisation so just pop the ref
				frame.getStack().pop();
			};
		},
		"monitor_exit": function() {
			this.execute = function(frame, constantPool) {
				// don't support synchronisation so just pop the ref
				frame.getStack().pop();
			};
		},
		"wide": function() {
			this.execute = function(frame, constantPool) {
				throw "Wide is not implemented. Your program will probably now crash.";
			};
		},		
		"multi_dimensional_array_create": function(index, dimensions) {
			this.execute = function(frame, constantPool) {
				var array = [];
				var lengths = [];

				for(var i = (dimensions - 1); i > -1; i--) {
					lengths[i] = frame.getStack().pop();
				}

				this._createArray(frame, array, lengths, 0);

				frame.getStack().push(array);
			};

			this._createArray = function(frame, parent, lengths, index) {
				if(index === (lengths.length - 1)) {
					return;
				}

				var length = lengths[index];

				for(var i = 0; i < length; i++) {
					var innerArray = [];

					if((index + 1) === (lengths.length - 1)) {
						innerArray.length = lengths[index + 1];
					}

					parent.push(innerArray);

					this._createArray(frame, innerArray, lengths, index + 1);
				}
			};
		},
		"if_null": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value === null) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_non_null": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value !== null) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		}
	};

	var _operation;

	if(operations[operation]) {
		// lets us call .apply on a function constructor
		var construct = function(constructor, args) {
			function F() {
				return constructor.apply(this, args);
			}
			F.prototype = constructor.prototype;

			return new F();
		};

		_operation = construct(operations[operation], args);
	}

	if(!_operation) {
		throw "Cannot parse bytecode from " + mnemonic + " " + operation + " " + args;
	}

	this.execute = function(frame, constantPool) {
		return _operation.execute(frame, constantPool);
	};

	this.getLocation = function() {
		return location;
	};

	this.toString = function() {
		if(_operation.describe) {
			return _operation.describe();
		}

		return mnemonic;
	};

	this.hasBreakpoint = function() {
		return _breakpoint;
	};

	this.setBreakpoint = function(breakpoint) {
		_breakpoint = breakpoint;
	};
};

jjvm.types.ClassDefinition = function(name, parent) {
	var _name = name.getValue().replace(/\//g, ".");
	var _parent = parent ? jjvm.core.ClassLoader.loadClass(parent.getValue().replace(/\//g, ".")) : null;
	var _isAbstract = false;
	var _isFinal = false;
	var _isInterface = false;
	var _isSuper = false;
	var _visibility = "package";
	var _interfaces = [];
	var _methods = [];
	var _fields = [];
	var _exceptionTable = null;
	var _sourceFile;
	var _minorVersion;
	var _majorVersion;
	var _deprecated = false;
	var _synthetic = false;
	var _constantPool = null;

	// holds values of static fields
	var _staticFields = {};

	this.getName = function() {
		return _name;
	};

	this.getParent = function() {
		return _parent;
	};

	this.getVisibility = function() {
		return _visibility;
	};

	this.setVisibility = function(visibility) {
		_visibility = visibility;
	};

	this.isAbstract = function() {
		return _isAbstract;
	};

	this.setIsAbstract = function(isAbstract) {
		_isAbstract = isAbstract;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.setIsFinal = function(isFinal) {
		_isFinal = isFinal;
	};

	this.isInterface = function() {
		return _isInterface;
	};

	this.setIsInterface = function(isInterface) {
		_isInterface = isInterface;
	};

	this.isSuper = function() {
		return _isSuper;
	};

	this.setIsSuper = function(isSuper) {
		_isSuper = isSuper;
	};

	this.getInterfaces = function() {
		return _interfaces;
	};

	this.addInterface = function(anInterface) {
		_interfaces.push(anInterface);
	};

	this.getMethods = function() {
		return _methods;
	};

	this.getMethod = function(name) {
		for(var i = 0; i < _methods.length; i++) {
			if(_methods[i].getName() == name) {
				return _methods[i];
			}
		}

		if(_parent !== null) {
			return _parent.getMethod(name);
		}

		throw "Method " + name + " does not exist on class " + this.getName();
	};

	this.addMethod = function(methodDef) {
		_methods.push(methodDef);
	};

	this.getFields = function() {
		return _fields;
	};

	this.addField = function(fieldDef) {
		_fields.push(fieldDef);
	};

	this.invokeStaticMethod = function(name, args) {
		
	};

	this.getStaticField = function(name) {
		this._hasStaticField(name);

		return _staticFields[name];
	};

	this.setStaticField = function(name, value) {
		this._hasStaticField(name);

		_staticFields[name] = value;
	};

	this._hasStaticField = function(name) {
		var foundField = false;

		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name && _fields[i].isStatic()) {
				foundField = true;
			}
		}

		if(!foundField) {
			throw "field " + name + " does not exist on class " + this.getName();
		}
	};

	this.setExceptionTable = function(exceptionTable) {
		_exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
	};

	this.setConstantPool = function(constantPool) {
		constantPool.setClassDef(this);
		_constantPool = constantPool;
	};

	this.getConstantPool = function() {
		return _constantPool;
	};

	this.setSourceFile = function(sourceFile) {
		_sourceFile = sourceFile;
	};

	this.getSourceFile = function() {
		return _sourceFile;
	};

	this.setMinorVersion = function(minorVersion) {
		_minorVersion = minorVersion;
	};

	this.getMinorVersion = function() {
		return _minorVersion;
	};

	this.setMajorVersion = function(majorVersion) {
		_majorVersion = majorVersion;
	};

	this.getMajorVersion = function() {
		return _majorVersion;
	};

	this.setDeprecated = function(deprecated) {
		_deprecated = deprecated;
	};

	this.getDeprecated = function() {
		return _deprecated;
	};

	this.setSynthetic = function(synthetic) {
		_synthetic = synthetic;
	};

	this.getSynthetic = function() {
		return _synthetic;
	};

	this.getVersion = function() {
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

		return versions[_majorVersion];
	};

	this.isChildOf = function(classDef) {
		if(this.getName() == classDef.getName()) {
			return true;
		}

		for(var i = 0; i < this.getInterfaces().length; i++) {
			if(this.getInterfaces()[i].isChildOf(classDef)) {
				return true;
			}
		}

		if(this.getParent()) {
			return this.getParent().isChildOf(classDef);
		}

		return false;
	};

	this.toString = function() {
		return "ClassDef#" + this.getName();
	};

	this.toJavaP = function() {
		var output = _visibility;
		output += _isAbstract ? " abstract" : "";
		output += _isFinal ? " final" : "";
		output += _isInterface ? " interface" : " class";
		output += " " + _name;
		output += _parent ? " extends " + _parent : "";
		output += "\r\n";
		output += "\tSourceFile: \"" + _sourceFile + "\"\r\n";
		output += "\tMinor version: " + _minorVersion + "\r\n";
		output += "\tMajor version: " + _majorVersion + "\r\n";
		output += "\r\n";
		output += _constantPool.toJavaP();
		output += "\r\n";

		if(_fields.length > 0) {
			for(var f = 0; f < _fields.length; f++) {
				output += _fields[f].toJavaP();
			}

			output += "\r\n";
		}

		for(var m = 0; m < _methods.length; m++) {
			output += _methods[m].toJavaP();
			output += "\r\n";
		}

		return output;
	};
};

jjvm.types.ConstantPool = function() {
	var _classDef;
	var pool = [];

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.store = function(index, value) {
		pool[index] = value;
	};

	this.load = function(index) {
		return pool[index];
	};

	this.getPool = function() {
		return pool;
	};

	this.toString = function() {
		return "ConstantPool" + (_classDef ? "#" + _classDef.getName() : "");
	};

	this.toJavaP = function() {
		var output = "\tConstant pool:\r\n";

		for(var i = 0; i < pool.length; i++) {
			if(!pool[i]) {
				continue;
			}

			output += "\tconst #" + i + "\t= " + pool[i] + "\r\n";
		}

		return output;
	};
};

jjvm.types.ConstantPoolClassValue = function(index, constantPool) {

	this.getValue = function() {
		return constantPool.load(index).getValue();
	};

	this.getClassDef = function() {
		var className = this.getValue();
		className = className.replace(/\//g, ".");

		if(jjvm.types.Primitives[className]) {
			className = jjvm.types.Primitives[className];
		}

		return jjvm.core.ClassLoader.loadClass(className);
	};

	this.toString = function() {
		return "class\t\t#" + index + ";\t\t//\t" + this.getValue();
	};
};

jjvm.types.ConstantPoolFieldValue = function(classIndex, nameAndTypeIndex, constantPool) {

	this.getValue = function() {
		return this.toString();
	};

	this.getFieldDef = function() {
		var classDef = constantPool.load(classIndex).getClassDef();
		var nameAndType = constantPool.load(nameAndTypeIndex);
		var fieldName = nameAndType.getName();
		var fields = classDef.getFields();

		for(var i = 0; i < fields.length; i++) {
			if(fields[i].getName() == fieldName) {
				return fields[i];
			}
		}

		throw "Field " + fieldName + " not found on class " + classDef.getName();
	};

	this.toString = function() {
		var className = constantPool.load(classIndex).getValue();
		var nameAndType = constantPool.load(nameAndTypeIndex);

		return "Field\t\t#" + classIndex + ".#" + nameAndTypeIndex + ";\t//\t" + className + "." + nameAndType.getName() + ":" + nameAndType.getType();
	};
};

jjvm.types.ConstantPoolMethodValue = function(classIndex, nameAndTypeIndex, constantPool) {

	this.getValue = function() {
		return this.toString();
	};

	this.getMethodDef = function() {
		var classDef = constantPool.load(classIndex).getClassDef();
		var nameAndType = constantPool.load(nameAndTypeIndex);
		var methodName = nameAndType.getName();
		var methods = classDef.getMethods();

		for(var i = 0; i < methods.length; i++) {
			if(methods[i].getName() == methodName) {
				return methods[i];
			}
		}

		throw "Method " + methodName + " not found on class " + classDef.getName();
	};

	this.toString = function() {
		var className = constantPool.load(classIndex).getValue();
		var nameAndType = constantPool.load(nameAndTypeIndex);

		return "Method\t#" + classIndex + ".#" + nameAndTypeIndex + ";\t\t//\t" + className + "." + nameAndType.getName() + nameAndType.getType();
	};
};

jjvm.types.ConstantPoolNameAndTypeValue = function(nameIndex, typeIndex, constantPool) {

	this.getValue = function() {
		return this.getName() + ":" + typeIndex;
	};

	this.getName = function() {
		return constantPool.load(nameIndex).getValue();
	};

	this.getType = function() {
		return constantPool.load(typeIndex).getValue();
	};

	this.toString = function() {
		return "NameAndType	#" + nameIndex + ":#" + typeIndex + ";	// " + this.getValue();
	};
};

jjvm.types.ConstantPoolStringReferenceValue = function(index, constantPool) {

	this.getValue = function() {
		return constantPool.load(index).getValue();
	};

	this.toString = function() {
		return "String			#" + index + ";	// " + this.getValue();
	};
};

jjvm.types.ConstantPoolValue = function(type, value, constantPool) {

	this.getValue = function() {
		return value;
	};

	this.getType = function() {
		return type;
	};

	this.getTypeName = function() {
		if(value.length > 1) {
			// returns an object type, remove the L and ;
			return value.substring(1, value.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives[value]) {
			// convert I to int, Z to boolean, etc
			return jjvm.types.Primitives[value];
		}

		return value;
	};

	this.toString = function() {
		return type + "\t\t" + value + ";";
	};
};

jjvm.types.ExceptionTable = function(table) {

	this.resolve = function(line) {
		for(var i = 0; i < table.length; i++) {
			if(table[i].from <= line && table[i].to >= line) {
				return table[i].target;
			}
		}

		return null;
	};

	this.toJavaP = function() {
		var output = "\t\tExceptionTable:\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			//output += "\t\t\tline " + i + ":\t" + table[i] + "\r\n";
		}

		return output;
	};

	this.toString = function() {
		return "ExceptionTable";
	};
};

jjvm.types.FieldDefinition = function(name, type, classDef) {
	var _visibility = "package";
	var _isStatic = false;
	var _isFinal = false;
	var _isVolatile = false;
	var _isTransient = false;
	var _type = _.str.trim(type);
	var _name = _.str.trim(name);
	var _deprecated = false;
	var _synthetic = false;
	var _constantValue = null;
	var _classDef = classDef;

	this.getVisibility = function() {
		return _visibility;
	};

	this.setVisibility = function(visibility) {
		_visibility = visibility;
	};

	this.isStatic = function() {
		return _isStatic;
	};

	this.setIsStatic = function(isStatic) {
		_isStatic = isStatic;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.setIsFinal = function(isFinal) {
		_isFinal = isFinal;
	};

	this.isVolatile = function() {
		return _isVolatile;
	};

	this.setIsVolatile = function(isVolatile) {
		_isVolatile = isVolatile;
	};

	this.isTransient = function() {
		return _isTransient;
	};

	this.setIsTransient = function(isTransient) {
		_isTransient = isTransient;
	};

	this.getType = function() {
		return _type;
	};

	this.getName = function() {
		return _name;
	};

	this.setDeprecated = function(deprecated) {
		_deprecated = deprecated;
	};

	this.getDeprecated = function() {
		return _deprecated;
	};

	this.setSynthetic = function(synthetic) {
		_synthetic = synthetic;
	};

	this.getSynthetic = function() {
		return _synthetic;
	};

	this.setConstantValue = function(constantValue) {
		_constantValue = constantValue;
	};

	this.getConstantValue = function() {
		return _constantValue;
	};

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.getClassDef = function() {
		return _classDef;
	};


	this.toJavaP = function() {
		var output = _visibility;
		output += _isStatic ? " static" : "";
		output += _isFinal ? " final" : "";
		output += _isVolatile ? " volatile" : "";
		output += _isTransient ? " transient" : "";
		output += " " + _type + " " + _name + ");\r\n";

		return output;
	};

	this.toString = function() {
		return "Field#" + this.getName();
	};
};

jjvm.types.LineNumberTable = function(table) {

	this.getTable = function() {
		return table;
	};

	this.toJavaP = function() {
		var output = "\t\tLineNumberTable:\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			output += "\t\t\tline " + table[i] + ":\t" + i + "\r\n";
		}

		return output;
	};

	this.toString = function() {
		return "LineNumberTable";
	};
};

jjvm.types.LocalVariableTable = function(table) {

	this.getTable = function() {
		return table;
	};
};

jjvm.types.MethodDefinition = function(name, args, returns, classDef) {
	var _visibility = "package";
	var _isStatic = false;
	var _isFinal = false;
	var _isSynchronized = false;
	var _isNative = false;
	var _isAbstract = false;
	var _isStrict = false;
	var _name = _.str.trim(name);
	var _args = args ? args : [];
	var _returns = _.str.trim(returns ? returns : "void");
	var _instructions = null;
	var _implementation = null;
	var _deprecated = false;
	var _synthetic = false;
	var _exceptionTable = null;
	var _throws = [];
	var _lineNumberTable = null;
	var _localVariableTable = null;
	var _stackMapTable = null;
	var _maxStackSize = 0;
	var _maxLocalVariables = 0;
	var _classDef = classDef;

	this.getVisibility = function() {
		return _visibility;
	};

	this.setVisibility = function(visibility) {
		_visibility = visibility;
	};

	this.isStatic = function() {
		return _isStatic;
	};

	this.setIsStatic = function(isStatic) {
		_isStatic = isStatic;
	};

	this.isFinal = function() {
		return _isFinal;
	};

	this.setIsFinal = function(isFinal) {
		_isFinal = isFinal;
	};

	this.isSynchronized = function() {
		return _isSynchronized;
	};

	this.setIsSynchronized = function(isSynchronized) {
		_isSynchronized = isSynchronized;
	};

	this.isNative = function() {
		return _isNative;
	};

	this.setIsNative = function(isNative) {
		_isNative = isNative;
	};

	this.isAbstract = function() {
		return _isAbstract;
	};

	this.setIsAbstract = function(isAbstract) {
		_isAbstract = isAbstract;
	};

	this.getIsStrict = function() {
		return _isStrict;
	};

	this.setIsStrict = function(isStrict) {
		_isStrict = isStrict;
	};

	this.getName = function() {
		return _name;
	};

	this.getArgs = function() {
		return _args;
	};

	this.getReturns = function() {
		return _returns;
	};

	this.getInstructions = function() {
		return _instructions;
	};

	this.setInstructions = function(instructions) {
		_instructions = instructions;
	};

	this.getImplementation = function() {
		return _implementation;
	};

	this.setImplementation = function(implementation) {
		_implementation = implementation;
	};

	this.setDeprecated = function(deprecated) {
		_deprecated = deprecated;
	};

	this.getDeprecated = function() {
		return _deprecated;
	};

	this.setSynthetic = function(synthetic) {
		_synthetic = synthetic;
	};

	this.getSynthetic = function() {
		return _synthetic;
	};

	this.setExceptionTable = function(exceptionTable) {
		_exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
	};

	this.setThrows = function(list) {
		_throws = list;
	};

	this.getThrows = function() {
		return _throws;
	};

	this.setLineNumberTable = function(lineNumberTable) {
		_lineNumberTable = lineNumberTable;
	};

	this.getLineNumberTable = function() {
		return _lineNumberTable;
	};

	this.setLocalVariableTable = function(localVariableTable) {
		_localVariableTable = localVariableTable;
	};

	this.getLocalVariableTable = function() {
		return _localVariableTable;
	};

	this.setStackMapTable = function(stackMapTable) {
		_stackMapTable = stackMapTable;
	};

	this.getStackMapTable = function() {
		return _stackMapTable;
	};

	this.setMaxStackSize = function(maxStackSize) {
		_maxStackSize = maxStackSize;
	};

	this.getMaxStackSize = function() {
		return _maxStackSize;
	};

	this.setMaxLocalVariables = function(maxLocalVariables) {
		_maxLocalVariables = maxLocalVariables;
	};

	this.getMaxLocalVariables = function() {
		return _maxLocalVariables;
	};

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.getClassDef = function() {
		return _classDef;
	};

	this.toJavaP = function() {
		var output = _visibility;
		output += _isStatic ? " static" : "";
		output += _isFinal ? " final" : "";
		output += _isAbstract ? " abstract" : "";
		output += _isSynchronized ? " synchronized" : "";
		output += " " + _returns + " " + _name + "(" + _args.join(", ") + ");\r\n";
		output += "\tCode:\r\n";
		output += "\t\tStack=" + _maxStackSize + ", Locals="+ _maxLocalVariables + ", Args_size=" + _args.length + "\r\n";
		
		if(_implementation) {
			output += "\t\tNative code\r\n";
		} else {
			for(var i = 0; i < _instructions.length; i++) {
				output += "\t\t" + _instructions[i].getLocation() + ":\t" + _instructions[i] + "\r\n";
			}
		}

		if(_lineNumberTable) {
			output += _lineNumberTable.toJavaP();
		}

		if(_exceptionTable) {
			output += _exceptionTable.toJavaP();
		}

		return output;
	};

	this.toString = function() {
		return "Method#" + this.getName();
	};
};

jjvm.types.Primitives = {
	"Z": "boolean",
	"B": "byte",
	"C": "char",
	"S": "short",
	"I": "int",
	"J": "long",
	"F": "float",
	"D": "double",
	"V": "void"
};

jjvm.runtime.Frame = function(classDef, methodDef, args, parent) {
	_.extend(this, jjvm.core.Watchable);

	var _stack = new jjvm.runtime.Stack();
	var _variables = new jjvm.runtime.LocalVariables(args ? args : []);
	var _child;
	var _thread;
	var _output;
	var _currentInstruction;
	var _version = jjvm.runtime.Frame.index++;
	var _instructions = new jjvm.core.Iterator(methodDef.getInstructions());
	var _skipBreakpointAtLocation;
	var _executionHalted;

	this.getLocalVariables = function() {
		return _variables;
	};

	this.getStack = function() {
		return _stack;
	};

	this.getClassDef = function() {
		return classDef;
	};

	this.getMethodDef = function() {
		return methodDef;
	};

	this.getParent = function() {
		return parent;
	};

	this.getChild = function() {
		return _child;
	};

	this.getCurrentInstruction = function() {
		return _currentInstruction;
	};

	this.getOutput = function() {
		return _output;
	};

	this.getThread = function() {
		return _thread;
	};

	this._resumeExecution = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		_thread.setExecutionSuspended(false);
		_skipBreakpointAtLocation = _currentInstruction.getLocation();

		this._executeNextInstruction();
	};

	this._stepOver = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// start stepping
		this._executeNextInstruction();
	};

	this._dropToFrame = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// reset execution index and enabled stepping
		_instructions.reset();
		_currentInstruction = _instructions.peek();
		this.dispatch("onBeforeInstructionExecution", _currentInstruction);
	};

	var stepOverCallback = _.bind(this._stepOver, this);
	var dropToFrameCallback = _.bind(this._dropToFrame, this);
	var resumeExecutionCallback = _.bind(this._resumeExecution, this);

	this.execute = function(thread) {
		_thread = thread;
		_thread.setCurrentFrame(this);
		_thread.register("onStepOver", stepOverCallback);
		_thread.register("onDropToFrame", dropToFrameCallback);
		_thread.register("onResumeExecution", resumeExecutionCallback);

		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var target = args.shift();
			_output = methodDef.getImplementation().apply(target, args);

			this.dispatch("onFrameComplete");
		} else {
			if(_thread.isExecutionSuspended()) {
				_currentInstruction = _instructions.peek();
				this.dispatch("onBeforeInstructionExecution", _currentInstruction);
			} else {
				this._executeNextInstruction();
			}
		}
	};

	this.executeChild = function(classDef, methodDef, args) {
		_child = new jjvm.runtime.Frame(classDef, methodDef, args, this);

		_child.register("onFrameComplete", _.bind(function() {
			if(_child.getOutput() !== undefined) {
				//this.getStack().push(_child.getOutput());
			}

			this.dispatch("onChildFrameCompleted", _child.getOutput());
			_child = null;
			_thread.setCurrentFrame(this);

			// highlight our next instruction
			_currentInstruction = _instructions.peek();
			this.dispatch("onBeforeInstructionExecution", _currentInstruction);
		}, this));

		_child.execute(_thread, _executionHalted);

		return _child;
	};

	this.toString = function() {
		return "Frame#" + _version + " " + classDef.getName() + "." + methodDef.getName() + (_currentInstruction ? ":" + _currentInstruction.getLocation() : "");
	};

	this._shouldStopOnBreakpoint = function() {
		if(!_currentInstruction.hasBreakpoint()) {
			return false;
		}

		// this makes the resume button work if we're currently on an 
		// instruction with a breakpoint
		if(_currentInstruction.getLocation() == _skipBreakpointAtLocation) {
			_skipBreakpointAtLocation = -1;

			return false;
		}

		if(_thread.isExecutionSuspended()) {
			return false;
		}

		return true;
	};

	this._executeNextInstruction = function() {
		// get instruction to execute
		_currentInstruction = _instructions.next();

		this.dispatch("onBeforeInstructionExecution", _currentInstruction);

		if(this._shouldStopOnBreakpoint()) {
			this.dispatch("onBreakpointEncountered", _currentInstruction);
			_thread.setExecutionSuspended(true);
			_instructions.rewind();

			return;
		}

		try {
			var output = _currentInstruction.execute(this, classDef.getConstantPool());

			if(output !== undefined) {
				_output = output;
			}
		} catch(error) {
			if(error instanceof jjvm.runtime.Goto) {
				for(var i = 0; i < methodDef.getInstructions().length; i++) {
					if(methodDef.getInstructions()[i].getLocation() == error.getLocation()) {
						_executionIndex = i - 1;
					}
				}
			} else {
				throw error;
			}
		}

		this.dispatch("onInstructionExecution", _currentInstruction);
		this.dispatch("onAfterInstructionExecution", _currentInstruction);

		if(!_instructions.hasNext()) {
			_thread.deRegister("onStepOver", stepOverCallback);
			_thread.deRegister("onDropToFrame", dropToFrameCallback);
			_thread.deRegister("onResumeExecution", resumeExecutionCallback);

			this.dispatch("onFrameComplete");

			return;
		}

		if(_thread.isExecutionSuspended() !== true) {
			// execute next instruction in one second
			this._executeNextInstruction();
			//setTimeout(_.bind(this._executeNextInstruction, this), 1000);
		} else if(_instructions.hasNext() && _thread.isCurrentFrame(this)) {
			
			// we are suspended, highlight the next instruction
			var next = _instructions.peek();

			this.dispatch("onBeforeInstructionExecution", next);
		}
	};

	this.toString = function() {
		return "Frame#" + classDef.getName() + "#" + methodDef.getName();
	};
};

jjvm.runtime.Frame.index = 0;
jjvm.runtime.Goto = function(location) {
	this.getLocation = function() {
		return location;
	};
};

jjvm.runtime.LocalVariables = function(args) {

	this.store = function(index, value) {
		args[index] = value;
	};

	this.load = function(index) {
		return args[index];
	};

	this.getLocalVariables = function(index) {
		return args;
	};
};

jjvm.runtime.ObjectReference = function(classDef) {
	var _fields = {};
	var _values = {};

	this.getClass = function() {
		return classDef;
	};

	this.invoke = function(methodName, args) {

	};

	this.getField = function(name) {
		this._hasField(name);

		return _fields[name];
	};

	this.setField = function(name, value) {
		this._hasField(name);

		_fields[name] = value;
	};

	this._hasField = function(name) {
		var foundField = false;

		for(var i = 0; i < this.getClass().getFields().length; i++) {
			var field = this.getClass().getFields()[i];

			if(field.getName() == name && !field.isStatic()) {
				foundField = true;
			}
		}

		if(!foundField) {
			throw "field " + name + " does not exist on class " + this.getClass().getName();
		}
	};

	this.isInstanceOf = function(classDef) {
		return this.getClass().isChildOf(classDef);
	};

	this.toString = function() {
		return "ObjectReference#" + classDef.getName();
	};
};

jjvm.runtime.Stack = function() {
	var _stack = [];

	this.push = function(value) {
		_stack.push(value);
	};

	this.pop = function() {
		return _stack.pop();
	};

	this.getStack = function() {
		return _stack;
	};
};

jjvm.runtime.Thread = function(frame, parent) {
	_.extend(this, jjvm.core.Watchable);

	jjvm.runtime.ThreadPool.threads.push(this);
	
	var _initialFrame = frame;
	var _currentFrame = frame;
	var _index = jjvm.runtime.Thread.index++;
	var _status = jjvm.runtime.Thread.STATUS.NEW;
	var _executionSuspended;

	this.run = function() {
		frame.register("onFrameComplete", _.bind(function() {
			this.setStatus(jjvm.runtime.Thread.STATUS.TERMINATED);

			if(parent === undefined && frame.getMethodDef().getName() == "main") {
				this.dispatch("onExecutionComplete");
			}
		}, this));

		this.setStatus(jjvm.runtime.Thread.STATUS.RUNNABLE);
		frame.execute(this);
	};

	this.isExecutionSuspended = function() {
		return _executionSuspended ? true : false;
	};

	this.setExecutionSuspended = function(executionSuspended) {
		_executionSuspended  = executionSuspended;
	};

	this.isCurrentFrame = function(frame) {
		return _currentFrame == frame;
	};

	this.getCurrentFrame = function() {
		return _currentFrame;
	};

	this.setCurrentFrame = function(frame) {
		_currentFrame = frame;

		this.dispatch("onCurrentFrameChanged", frame);
	};

	this.getInitialFrame = function(frame) {
		return _initialFrame;
	};

	this.setStatus = function(status) {
		_status = status;

		this.dispatch("onThreadStatusChanged", frame);
	};

	this.getStatus = function() {
		return _status;
	};

	this.toString = function() {
		return "Thread#" + _index + " (" + _status + ")";
	};
};

jjvm.runtime.Thread.index = 0;
jjvm.runtime.Thread.STATUS = {
	NEW: "NEW",
	RUNNABLE: "RUNNABLE",
	BLOCKED: "BLOCKED",
	WAITING: "WAITING",
	TIMED_WAITING: "TIMED_WAITING",
	TERMINATED: "TERMINATED"
};

jjvm.runtime.ThreadPool = {
	threads: [],
	
	reap: function() {
		for(var i = 0; i < jjvm.runtime.ThreadPool.threads.length; i++) {
			if(jjvm.runtime.ThreadPool.threads[i].getStatus() == jjvm.runtime.Thread.STATUS.TERMINATED) {
				jjvm.runtime.ThreadPool.threads.splice(i, 1);
			}
		}

		jjvm.core.NotificationCentre.dispatch(this, "onThreadGC");
	}
};

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
				console.warn("Short read of " + attributeName + " read " + read + " of " + attributeLength + " bytes");
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
jjvm.compiler.BlockParser = function() {

	this.parseBlock = function(iterator, constantsPool, length, parser) {
		//console.info("parsing block of length " + length + " with " + parser);
		var block = iterator.getIterable().subarray(iterator.getLocation(), iterator.getLocation() + length);
		var blockIterator = new jjvm.core.ByteIterator(block);

		// skip to end of block
		iterator.jump(iterator.getLocation() + length);

		// parse block
		return parser.parse(blockIterator, constantsPool);
	};

	this.readEmptyBlock = function(attributeName, iterator, expectedLength) {
		if(expectedLength === undefined) {
			expectedLength = 0;
		}

		var attributeLength = iterator.readU32();

		if(attributeLength !== expectedLength) {
			throw attributeName + " attribute should have length " + expectedLength + "!";
		}
	};

	this.toString = function() {
		return "BlockParser";
	};
};
jjvm.compiler.ByteCodeParser = function() {
	var _bytecode_mapping = {
		0x00: {
			mnemonic: "nop",
			operation: "nop",
			args: []
		},
		0x01: {
			mnemonic: "aconst_null",
			operation: "push",
			args: [null]
		},
		0x02: {
			mnemonic: "iconst_m1",
			operation: "push",
			args: [-1]
		},
		0x03: {
			mnemonic: "iconst_0",
			operation: "push",
			args: [0]
		},
		0x04: {
			mnemonic: "iconst_1",
			operation: "push",
			args: [1]
		},
		0x05: {
			mnemonic: "iconst_2",
			operation: "push",
			args: [2]
		},
		0x06: {
			mnemonic: "iconst_3",
			operation: "push",
			args: [3]
		},
		0x07: {
			mnemonic: "iconst_4",
			operation: "push",
			args: [4]
		},
		0x08: {
			mnemonic: "iconst_5",
			operation: "push",
			args: [5]
		},
		0x09: {
			mnemonic: "lconst_0",
			operation: "push",
			args: [0]
		},
		0x0A: {
			mnemonic: "lconst_1",
			operation: "push",
			args: [1]
		},
		0x0B: {
			mnemonic: "fconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0C: {
			mnemonic: "fconst_1",
			operation: "push",
			args: [1.0]
		},
		0x0D: {
			mnemonic: "dconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0F: {
			mnemonic: "dconst_1",
			operation: "push",
			args: [0.0]
		},
		0x10: {
			mnemonic: "bipush",
			operation: "push",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0x11: {
			mnemonic: "sipush",
			operation: "push",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x12: {
			mnemonic: "ldc",
			operation: "push",
			args: function(iterator, constantPool) {
				return [constantPool.load(iterator.readU8()).getValue()];
			}
		},
		0x13: {
			mnemonic: "ldc_w",
			operation: "push",
			args: function(iterator, constantPool) {
				// should return String, int or float
				return [constantPool.load(iterator.readU16()).getValue()];
			}
		},
		0x14: {
			mnemonic: "ldc2_w",
			operation: "push",
			args: function(iterator, constantPool) {
				// should return double or long
				return [constantPool.load(iterator.readU16()).getValue()];
			}
		},
		0x15: {
			mnemonic: "iload",
			operation: "load",
			args: function(iterator, constantPool) {
				return [constantPool.load(iterator.readU8()).getValue()];
			}
		},
		0x16: {
			mnemonic: "lload",
			operation: "load",
			args: function(iterator, constantPool) {
				return [constantPool.load(iterator.readU8()).getValue()];
			}
		},
		0x17: {
			mnemonic: "fload",
			operation: "load",
			args: function(iterator, constantPool) {
				return [constantPool.load(iterator.readU8()).getValue()];
			}
		},
		0x18: {
			mnemonic: "dload",
			operation: "load",
			args: function(iterator, constantPool) {
				return [constantPool.load(iterator.readU8()).getValue()];
			}
		},
		0x19: {
			mnemonic: "aload",
			operation: "load",
			args: function(iterator, constantPool) {
				return [constantPool.load(iterator.readU8()).getValue()];
			}
		},
		0x1A: {
			mnemonic: "iload_0",
			operation: "load",
			args: [0]
		},
		0x1B: {
			mnemonic: "iload_1",
			operation: "load",
			args: [1]
		},
		0x1C: {
			mnemonic: "iload_2",
			operation: "load",
			args: [2]
		},
		0x1D: {
			mnemonic: "iload_3",
			operation: "load",
			args: [3]
		},
		0x1E: {
			mnemonic: "lload_0",
			operation: "load",
			args: [0]
		},
		0x1F: {
			mnemonic: "lload_1",
			operation: "load",
			args: [1]
		},
		0x20: {
			mnemonic: "lload_2",
			operation: "load",
			args: [2]
		},
		0x21: {
			mnemonic: "lload_3",
			operation: "load",
			args: [3]
		},
		0x22: {
			mnemonic: "fload_0",
			operation: "load",
			args: [0.0]
		},
		0x23: {
			mnemonic: "fload_1",
			operation: "load",
			args: [1.0]
		},
		0x24: {
			mnemonic: "fload_2",
			operation: "load",
			args: [2.0]
		},
		0x25: {
			mnemonic: "fload_3",
			operation: "load",
			args: [3.0]
		},
		0x26: {
			mnemonic: "dload_0",
			operation: "load",
			args: [0.0]
		},
		0x27: {
			mnemonic: "dload_1",
			operation: "load",
			args: [1.0]
		},
		0x28: {
			mnemonic: "dload_2",
			operation: "load",
			args: [2.0]
		},
		0x29: {
			mnemonic: "dload_3",
			operation: "load",
			args: [3.0]
		},
		0x2A: {
			mnemonic: "aload_0",
			operation: "load",
			args: [0]
		},
		0x2B: {
			mnemonic: "aload_1",
			operation: "load",
			args: [1]
		},
		0x2C: {
			mnemonic: "aload_2",
			operation: "load",
			args: [2]
		},
		0x2D: {
			mnemonic: "aload_3",
			operation: "load",
			args: [3]
		},
		0x2E: {
			mnemonic: "iaload",
			operation: "array_load",
			args: []
		},
		0x2F: {
			mnemonic: "laload",
			operation: "array_load",
			args: []
		},
		0x30: {
			mnemonic: "faload",
			operation: "array_load",
			args: []
		},
		0x31: {
			mnemonic: "daload",
			operation: "array_load",
			args: []
		},
		0x32: {
			mnemonic: "aaload",
			operation: "array_load",
			args: []
		},
		0x33: {
			mnemonic: "baload",
			operation: "array_load",
			args: []
		},
		0x34: {
			mnemonic: "caload",
			operation: "array_load",
			args: []
		},
		0x35: {
			mnemonic: "saload",
			operation: "array_load",
			args: []
		},
		0x36: {
			mnemonic: "istore",
			operation: "store",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0x37: {
			mnemonic: "lstore",
			operation: "store",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0x38: {
			mnemonic: "fstore",
			operation: "store",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0x39: {
			mnemonic: "dstore",
			operation: "store",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0x3A: {
			mnemonic: "dstore",
			operation: "store",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0x3B: {
			mnemonic: "istore_0",
			operation: "store",
			args: [0]
		},
		0x3C: {
			mnemonic: "istore_1",
			operation: "store",
			args: [1]
		},
		0x3D: {
			mnemonic: "istore_2",
			operation: "store",
			args: [2]
		},
		0x3E: {
			mnemonic: "istore_3",
			operation: "store",
			args: [3]
		},
		0x3F: {
			mnemonic: "lstore_0",
			operation: "store",
			args: [0]
		},
		0x40: {
			mnemonic: "lstore_1",
			operation: "store",
			args: [1]
		},
		0x41: {
			mnemonic: "lstore_2",
			operation: "store",
			args: [2]
		},
		0x42: {
			mnemonic: "lstore_3",
			operation: "store",
			args: [3]
		},
		0x43: {
			mnemonic: "fstore_0",
			operation: "store",
			args: [0.0]
		},
		0x44: {
			mnemonic: "fstore_1",
			operation: "store",
			args: [1.0]
		},
		0x45: {
			mnemonic: "fstore_2",
			operation: "store",
			args: [2.0]
		},
		0x46: {
			mnemonic: "fstore_3",
			operation: "store",
			args: [3.0]
		},
		0x47: {
			mnemonic: "dstore_0",
			operation: "store",
			args: [0.0]
		},
		0x48: {
			mnemonic: "dstore_1",
			operation: "store",
			args: [1.0]
		},
		0x49: {
			mnemonic: "dstore_2",
			operation: "store",
			args: [2.0]
		},
		0x4A: {
			mnemonic: "dstore_3",
			operation: "store",
			args: [3.0]
		},
		0x4B: {
			mnemonic: "astore_0",
			operation: "store",
			args: [0.0]
		},
		0x4C: {
			mnemonic: "astore_1",
			operation: "store",
			args: [1.0]
		},
		0x4D: {
			mnemonic: "astore_2",
			operation: "store",
			args: [2.0]
		},
		0x4E: {
			mnemonic: "astore_3",
			operation: "store",
			args: [3.0]
		},
		0x4F: {
			mnemonic: "iastore",
			operation: "array_store",
			args: []
		},
		0x50: {
			mnemonic: "lastore",
			operation: "array_store",
			args: []
		},
		0x51: {
			mnemonic: "fastore",
			operation: "array_store",
			args: []
		},
		0x52: {
			mnemonic: "dastore",
			operation: "array_store",
			args: []
		},
		0x53: {
			mnemonic: "aastore",
			operation: "array_store",
			args: []
		},
		0x54: {
			mnemonic: "bastore",
			operation: "array_store",
			args: []
		},
		0x55: {
			mnemonic: "castore",
			operation: "array_store",
			args: []
		},
		0x56: {
			mnemonic: "sastore",
			operation: "array_store",
			args: []
		},
		0x57: {
			mnemonic: "pop",
			operation: "pop",
			args: []
		},
		0x58: {
			mnemonic: "pop2",
			operation: "pop2",
			args: []
		},
		0x59: {
			mnemonic: "dup",
			operation: "dup",
			args: []
		},
		0x5A: {
			mnemonic: "dup_x1",
			operation: "dup_x1",
			args: []
		},
		0x5B: {
			mnemonic: "dup_x2",
			operation: "dup_x2",
			args: []
		},
		0x5C: {
			mnemonic: "dup2",
			operation: "dup2",
			args: []
		},
		0x5D: {
			mnemonic: "dup2_x1",
			operation: "dup2_x1",
			args: []
		},
		0x5E: {
			mnemonic: "dup2_x2",
			operation: "dup2_x2",
			args: []
		},
		0x5F: {
			mnemonic: "swap",
			operation: "swap",
			args: []
		},
		0x60: {
			mnemonic: "iadd",
			operation: "add",
			args: []
		},
		0x61: {
			mnemonic: "ladd",
			operation: "add",
			args: []
		},
		0x62: {
			mnemonic: "fadd",
			operation: "add",
			args: []
		},
		0x63: {
			mnemonic: "dadd",
			operation: "add",
			args: []
		},
		0x64: {
			mnemonic: "isub",
			operation: "sub",
			args: []
		},
		0x65: {
			mnemonic: "lsub",
			operation: "sub",
			args: []
		},
		0x66: {
			mnemonic: "fsub",
			operation: "sub",
			args: []
		},
		0x67: {
			mnemonic: "dsub",
			operation: "sub",
			args: []
		},
		0x68: {
			mnemonic: "imul",
			operation: "mul",
			args: []
		},
		0x69: {
			mnemonic: "lmul",
			operation: "mul",
			args: []
		},
		0x6A: {
			mnemonic: "fmul",
			operation: "mul",
			args: []
		},
		0x6B: {
			mnemonic: "dmul",
			operation: "mul",
			args: []
		},
		0x6C: {
			mnemonic: "idiv",
			operation: "div",
			args: []
		},
		0x6D: {
			mnemonic: "ldiv",
			operation: "div",
			args: []
		},
		0x6E: {
			mnemonic: "fdiv",
			operation: "div",
			args: []
		},
		0x6F: {
			mnemonic: "ddiv",
			operation: "div",
			args: []
		},
		0x70: {
			mnemonic: "irem",
			operation: "rem",
			args: []
		},
		0x71: {
			mnemonic: "lrem",
			operation: "rem",
			args: []
		},
		0x72: {
			mnemonic: "frem",
			operation: "rem",
			args: []
		},
		0x73: {
			mnemonic: "drem",
			operation: "rem",
			args: []
		},
		0x74: {
			mnemonic: "ineg",
			operation: "neg",
			args: []
		},
		0x75: {
			mnemonic: "lneg",
			operation: "neg",
			args: []
		},
		0x76: {
			mnemonic: "fneg",
			operation: "neg",
			args: []
		},
		0x77: {
			mnemonic: "dneg",
			operation: "neg",
			args: []
		},
		0x78: {
			mnemonic: "ishl",
			operation: "shift_left",
			args: []
		},
		0x79: {
			mnemonic: "lshl",
			operation: "shift_left",
			args: []
		},
		0x7A: {
			mnemonic: "ishr",
			operation: "arithmetic_shift_right",
			args: []
		},
		0x7B: {
			mnemonic: "lshr",
			operation: "arithmetic_shift_right",
			args: []
		},
		0x7C: {
			mnemonic: "iushr",
			operation: "logical_shift_right",
			args: []
		},
		0x7D: {
			mnemonic: "lushr",
			operation: "logical_shift_right",
			args: []
		},
		0x7E: {
			mnemonic: "iand",
			operation: "and",
			args: []
		},
		0x7F: {
			mnemonic: "land",
			operation: "and",
			args: []
		},
		0x80: {
			mnemonic: "ior",
			operation: "or",
			args: []
		},
		0x81: {
			mnemonic: "lor",
			operation: "or",
			args: []
		},
		0x82: {
			mnemonic: "ixor",
			operation: "xor",
			args: []
		},
		0x83: {
			mnemonic: "lxor",
			operation: "xor",
			args: []
		},
		0x84: {
			mnemonic: "iinc",
			operation: "increment",
			args: function(iterator, constantPool) {
				return [iterator.readU8(), iterator.readU8()];
			}
		},
		0x85: {
			mnemonic: "i2l",
			operation: "convert",
			args: []
		},
		0x86: {
			mnemonic: "i2f",
			operation: "convert",
			args: []
		},
		0x87: {
			mnemonic: "i2d",
			operation: "convert",
			args: []
		},
		0x88: {
			mnemonic: "l2i",
			operation: "convert",
			args: []
		},
		0x89: {
			mnemonic: "l2f",
			operation: "convert",
			args: []
		},
		0x8A: {
			mnemonic: "l2d",
			operation: "convert",
			args: []
		},
		0x8B: {
			mnemonic: "f2i",
			operation: "convert",
			args: []
		},
		0x8C: {
			mnemonic: "f2l",
			operation: "convert",
			args: []
		},
		0x8D: {
			mnemonic: "f2d",
			operation: "convert",
			args: []
		},
		0x8E: {
			mnemonic: "d2i",
			operation: "convert",
			args: []
		},
		0x8F: {
			mnemonic: "d2l",
			operation: "convert",
			args: []
		},
		0x90: {
			mnemonic: "d2f",
			operation: "convert",
			args: []
		},
		0x91: {
			mnemonic: "i2b",
			operation: "convert_to_boolean",
			args: []
		},
		0x92: {
			mnemonic: "i2c",
			operation: "convert",
			args: []
		},
		0x93: {
			mnemonic: "i2s",
			operation: "convert",
			args: []
		},
		0x94: {
			mnemonic: "lcmp",
			operation: "compare",
			args: []
		},
		0x95: {
			mnemonic: "fcmpl",
			operation: "compare",
			args: []
		},
		0x96: {
			mnemonic: "fcmpg",
			operation: "compare",
			args: []
		},
		0x97: {
			mnemonic: "dcmpl",
			operation: "compare",
			args: []
		},
		0x98: {
			mnemonic: "dcmpg",
			operation: "compare",
			args: []
		},
		0x99: {
			mnemonic: "ifeq",
			operation: "if_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x9A: {
			mnemonic: "ifne",
			operation: "if_not_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x9B: {
			mnemonic: "iflt",
			operation: "if_less_than",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x9C: {
			mnemonic: "ifge",
			operation: "if_greater_than_or_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x9D: {
			mnemonic: "ifgt",
			operation: "if_greater_than",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x9E: {
			mnemonic: "ifle",
			operation: "if_less_than_or_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0x9F: {
			mnemonic: "if_icmpeq",
			operation: "if_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA0: {
			mnemonic: "if_icmpne",
			operation: "if_not_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA1: {
			mnemonic: "if_icmplt",
			operation: "if_less_than",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA2: {
			mnemonic: "if_icmpge",
			operation: "if_greater_than_or_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA3: {
			mnemonic: "if_icmpgt",
			operation: "if_greater_than",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA4: {
			mnemonic: "if_icmple",
			operation: "if_less_than",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA5: {
			mnemonic: "if_acmpeq",
			operation: "if_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA6: {
			mnemonic: "if_acmpne",
			operation: "if_not_equal",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA7: {
			mnemonic: "goto",
			operation: "goto",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA8: {
			mnemonic: "jsr",
			operation: "jsr",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xA9: {
			mnemonic: "ret",
			operation: "ret",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0xAA: {
			mnemonic: "tableswitch",
			operation: "tableswitch",
			args: function(iterator, constantPool) {
				var default_offset;

				// there are 0-3 bytes of padding before default_offset
				for(var i = 0; i < 3; i++) {
					default_offset = iterator.readU8();

					// fewer than three bytes!
					if(default_offset !== 0) {
						break;
					}
				}

				if(default_offset === 0 || default_offset === undefined) {
					default_offset = iterator.readU32();
				}

				var low = iterator.readU32();
				var high = iterator.readU32();
				var table = [];

				for(var n = 0; n < (low - high) + 1; i++) {
					table.push(iterator.readU32());
				}

				return [low, high, table];
			}
		},
		0xAB: {
			mnemonic: "lookupswitch",
			operation: "lookupswitch",
			args: function(iterator, constantPool) {
				var default_offset;

				// there are 0-3 bytes of padding before default_offset
				for(var i = 0; i < 3; i++) {
					default_offset = iterator.readU8();

					// fewer than three bytes!
					if(default_offset !== 0) {
						break;
					}
				}

				if(default_offset === 0 || default_offset === undefined) {
					default_offset = iterator.readU32();
				}

				var keys = iterator.readU32();
				var table = {};

				for(var n = 0; n < keys; i++) {
					table[iterator.readU32()] = iterator.readU32();
				}

				return [table];
			}
		},
		0xAC: {
			mnemonic: "ireturn",
			operation: "return",
			args: []
		},
		0xAD: {
			mnemonic: "lreturn",
			operation: "return",
			args: []
		},
		0xAE: {
			mnemonic: "flreturn",
			operation: "return",
			args: []
		},
		0xAF: {
			mnemonic: "dreturn",
			operation: "return",
			args: []
		},
		0xB0: {
			mnemonic: "areturn",
			operation: "return",
			args: []
		},
		0xB1: {
			mnemonic: "return",
			operation: "nop",
			args: []
		},
		0xB2: {
			mnemonic: "getstatic",
			operation: "get_static",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB3: {
			mnemonic: "putstatic",
			operation: "put_static",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB4: {
			mnemonic: "getfield",
			operation: "get_field",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB5: {
			mnemonic: "putfield",
			operation: "put_field",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB6: {
			mnemonic: "invokevirtual",
			operation: "invoke_virtual",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB7: {
			mnemonic: "invokespecial",
			operation: "invoke_special",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB8: {
			mnemonic: "invokestatic",
			operation: "invoke_static",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xB9: {
			mnemonic: "invokeinterface",
			operation: "invoke_interface",
			args: function(iterator, constantPool) {
				return [iterator.readU16(), iterator.readU8(), iterator.readU8()];
			}
		},
		0xBA: {
			mnemonic: "invokedynamic",
			operation: "invoke_dynamic",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xBB: {
			mnemonic: "new",
			operation: "new",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xBC: {
			mnemonic: "newarray",
			operation: "array_create",
			args: function(iterator, constantPool) {
				return [iterator.readU8()];
			}
		},
		0xBD: {
			mnemonic: "anewarray",
			operation: "array_create",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xBE: {
			mnemonic: "arraylength",
			operation: "array_length",
			args: []
		},
		0xBF: {
			mnemonic: "athrow",
			operation: "throw",
			args: []
		},
		0xC0: {
			mnemonic: "checkcast",
			operation: "check_cast",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xC1: {
			mnemonic: "instanceof",
			operation: "instance_of",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xC2: {
			mnemonic: "monitorenter",
			operation: "monitor_enter",
			args: []
		},
		0xC3: {
			mnemonic: "monitorexit",
			operation: "monitor_exit",
			args: []
		},
		0xC4: {
			mnemonic: "wide",
			operation: "wide",
			args: function(iterator, constantPool) {
				return [iterator.readU8(), iterator.readU16()];
			}
		},
		0xC5: {
			mnemonic: "multianewarray",
			operation: "multi_dimensional_array_create",
			args: function(iterator, constantPool) {
				return [iterator.readU16(), iterator.readU8()];
			}
		},
		0xC6: {
			mnemonic: "ifnull",
			operation: "if_null",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xC7: {
			mnemonic: "ifnonnull",
			operation: "if_non_null",
			args: function(iterator, constantPool) {
				return [iterator.readU16()];
			}
		},
		0xC8: {
			mnemonic: "goto_w",
			operation: "goto",
			args: function(iterator, constantPool) {
				return [iterator.readU32()];
			}
		},
		0xC9: {
			mnemonic: "jsr_w",
			operation: "jsr",
			args: function(iterator, constantPool) {
				return [iterator.readU32()];
			}
		},
		0xCA: {
			mnemonic: "breakpoint",
			operation: "nop",
			args: []
		},
		0xFE: {
			mnemonic: "impdep1",
			operation: "nop",
			args: []
		},
		0xFF: {
			mnemonic: "impdep2",
			operation: "nop",
			args: []
		}
	};

	this.parse = function(iterator, constantPool) {
		var instructions = [];

		while(iterator.hasNext()) {
			var location = iterator.getLocation();
			var code = iterator.readU8();

			if(_bytecode_mapping[code]) {
				instructions.push(new jjvm.types.ByteCode(
					_bytecode_mapping[code].mnemonic, 
					_bytecode_mapping[code].operation, 
					_bytecode_mapping[code].args instanceof Function ?  _bytecode_mapping[code].args(iterator, constantPool) :  _bytecode_mapping[code].args,
					location,
					constantPool)
			);
			} else {
				throw "Cannot map bytecode " + code.toString(16);
			}
		}

		return instructions;
	};

	this.toString = function() {
		return "ByteCodeParser";
	};
};

jjvm.compiler.ClassDefinitionParser = function() {
	var constantPoolParser = new jjvm.compiler.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.MethodDefinitionParser();
	var innerClassesParser = new jjvm.compiler.InnerClassesParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator) {
		var minorVersion = iterator.readU16();
		var majorVersion = iterator.readU16();

		var constantPool = constantPoolParser.parse(iterator);

		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16());
		var parent = constantPool.load(iterator.readU16());

		var classDef = new jjvm.types.ClassDefinition(name, parent);
		classDef.setMinorVersion(minorVersion);
		classDef.setMajorVersion(majorVersion);
		classDef.setConstantPool(constantPool);

		var interfaceCount = iterator.readU16();

		for(var i = 0; i < interfaceCount; i++) {
			classDef.addInterface(constantPool.load(iterator.readU16()));
		}

		if(accessFlags & 0x0001) {
			classDef.setVisibility("public");
		}

		if(accessFlags & 0x0010) {
			classDef.setIsFinal(true);
		}

		if(accessFlags & 0x0020) {
			classDef.setIsSuper(true);
		}

		if(accessFlags & 0x0200) {
			classDef.setIsInterface(true);
		}

		if(accessFlags & 0x0400) {
			classDef.setIsAbstract(true);
		}

		this.parseFields(iterator, classDef, constantPool);

		this.parseMethods(iterator, classDef, constantPool);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("class " + name + " has " + attributeCount + " attribtues");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on class " + name);
		};
		attributesParser.onSourceFile = function(iterator, constantPool) {
			var sourceFileName = constantPool.load(iterator.readU16()).getValue();
			classDef.setSourceFile(sourceFileName);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Deprecated", iterator);
			classDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Synthetic", iterator);
			classDef.setSynthetic(true);
		};
		attributesParser.onInnerClasses = function(iterator, constantPool) {
			blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, innerClassesParser);
		};
		attributesParser.parse(iterator, constantPool);

		//console.debug(classDef.toJavaP());

		return classDef;
	};

	this.parseFields = function(iterator, classDef, constantPool) {
		var fieldCount = iterator.readU16();

		//console.info("class " + classDef.getName() + " has " + fieldCount + " fields");

		for(var i = 0; i < fieldCount; i++) {
			classDef.addField(fieldDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.parseMethods = function(iterator, classDef, constantPool) {
		var methodCount = iterator.readU16();

		//console.info("class " + classDef.getName() + " has " + methodCount + " methods");

		for(var i = 0; i < methodCount; i++) {
			classDef.addMethod(methodDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.toString = function() {
		return "ClassDefinitionParser";
	};
};

jjvm.compiler.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.ClassDefinitionParser();

	// takes a File object
	this.compile = function(file, synchronous) {
		var reader = new FileReader();
	 
		// init the reader event handlers
		reader.onload = _.bind(this._onLoad, this, file);

		// begin the read operation
		reader.readAsArrayBuffer(file);
	};

	this._onLoad = function(file, event) {
		this.compileBytes(event.target.result);
	};

	this.compileBytes = function(buffer) {
		try {
			var bytes = new Uint8Array(buffer);
			var iterator = new jjvm.core.ByteIterator(bytes);

			if(!this._isClassFile(iterator)) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileFailed", file.name + " does not contain bytecode");

				return;
			}

			var classDef = classDefinitionParser.parse(iterator);

			jjvm.core.ClassLoader.addClassDefinition(classDef);

			jjvm.core.NotificationCentre.dispatch(this, "onDefined", classDef);
			jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};

	this._isClassFile = function(iterator) {
		var value = iterator.readU32();

		return value == 0xCAFEBABE;
	};
};

jjvm.compiler.ConstantPoolParser = function() {

	this.parse = function(iterator) {
		var poolSize = iterator.readU16();

		var pool = new jjvm.types.ConstantPool();
		var table = new jjvm.core.ByteIterator(iterator.getIterable().subarray(10));

		for(var i = 1; i < poolSize; i++) {
			var tag = iterator.next();

			if(tag == 0x01) {
				var length = iterator.readU16();
				var value = "";

				for(var n = 0; n < length; n++) {
					value += String.fromCharCode(parseInt(iterator.next(), 10));
				}

				pool.store(i, new jjvm.types.ConstantPoolValue("Asciz", value, pool));
			} else if(tag == 0x03) {
				pool.store(i, new jjvm.types.ConstantPoolValue("int", iterator.readU32(), pool));
			} else if(tag == 0x04) {
				pool.store(i, new jjvm.types.ConstantPoolValue("float", iterator.readFloat(), pool));
			} else if(tag == 0x05) {
				pool.store(i, new jjvm.types.ConstantPoolValue("long", iterator.readU64(), pool));
			} else if(tag == 0x06) {
				pool.store(i, new jjvm.types.ConstantPoolValue("double", iterator.readDouble(), pool));
			} else if(tag == 0x07) {
				pool.store(i, new jjvm.types.ConstantPoolClassValue(iterator.readU16(), pool));
			} else if(tag == 0x08) {
				pool.store(i, new jjvm.types.ConstantPoolStringReferenceValue(iterator.readU16(), pool));
			} else if(tag == 0x09) {
				pool.store(i, new jjvm.types.ConstantPoolFieldValue(iterator.readU16(), iterator.readU16(), pool));
			} else if(tag == 0x0A) {
				pool.store(i, new jjvm.types.ConstantPoolMethodValue(iterator.readU16(), iterator.readU16(), pool));
			} else if(tag == 0x0B) {
				pool.store(i, new jjvm.types.ConstantPoolMethodValue(iterator.readU16(), iterator.readU16(), pool));
			} else if(tag == 0x0C) {
				pool.store(i, new jjvm.types.ConstantPoolNameAndTypeValue(iterator.readU16(), iterator.readU16(), pool));
			} else {
				throw "ConstantPoolParser cannot parse " + tag;
			}

			if(tag == 0x05 || tag == 0x06) {
				// longs and doubles take two slots in the table
				i++;
			}
		}

		return pool;
	};

	this.toString = function() {
		return "ConstantPoolParser";
	};
};

jjvm.compiler.ExceptionTableParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table.push({
				from: iterator.readU16(),
				to: iterator.readU16(),
				target: iterator.readU16(),
				type: constantsPool.load(iterator.readU16())
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

jjvm.compiler.LineNumberTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table[iterator.readU16()] = iterator.readU16();
		}

		return new jjvm.types.LineNumberTable(table);
	};

	this.toString = function() {
		return "LineNumberTableParser";
	};
};

jjvm.compiler.MethodDefinitionParser = function() {
	var byteCodeParser = new jjvm.compiler.ByteCodeParser();
	var exceptionTableParser = new jjvm.compiler.ExceptionTableParser();
	var lineNumberTableParser = new jjvm.compiler.LineNumberTableParser();
	var stackMapTableParser = new jjvm.compiler.StackMapTableParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();
	var codeAttributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16()).getValue();
		var descriptor = constantPool.load(iterator.readU16());
		var type = descriptor.getValue();

		var typeRegex = /\((.*)?\)(L[a-zA-Z\/]+;|Z|B|C|S|I|J|F|D|V)/;
		var match = type.match(typeRegex);

		var returns = match[2];

		if(returns.length > 1) {
			// returns an object type, remove the L and ;
			returns = returns.substring(1, returns.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives[returns]) {
			// convert I to int, Z to boolean, etc
			returns = jjvm.types.Primitives[returns];
		}

		var args = [];

		if(match[1]) {
			var argsIterator = new jjvm.core.Iterator(match[1].split(""));

			while(argsIterator.hasNext()) {
				var character = argsIterator.next();

				if(jjvm.types.Primitives[character]) {
					// convert I to int, Z to boolean, etc
					args.push(jjvm.types.Primitives[character]);
				} else if(character == "L") {
					// start of object type definition, read until ";"
					var className = "";

					while(true) {
						var classNameCharacter = argsIterator.next();

						if(classNameCharacter == ";") {
							className = className.replace(/\//g, ".");

							break;
						} else {
							className += classNameCharacter;
						}
					}

					args.push(className);
				}
			}
		}

		var methodDef = new jjvm.types.MethodDefinition(name, args, returns, classDef);

		if(accessFlags & 0x0001) {
			methodDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			methodDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			methodDef.setVisibility("protected");
		}

		if(accessFlags & 0x0008) {
			methodDef.setIsStatic(true);
		}
		
		if(accessFlags & 0x0010) {
			methodDef.setIsFinal(true);
		}
		
		if(accessFlags & 0x0020) {
			methodDef.setIsSynchronized(true);
		}

		if(accessFlags & 0x0100) {
			methodDef.setIsNative(true);

			if(jjvm.nativeMethods[classDef.getName()] && jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]) {
				methodDef.setImplementation(jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]);
			} else {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]"]);
			}
		}

		if(accessFlags & 0x0400) {
			methodDef.setIsAbstract(true);
		}

		if(accessFlags & 0x0800) {
			methodDef.setIsStrict(true);
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("method " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			console.warn("Unrecognised attribute " + attributeName + " on method " + name);
		};
		attributesParser.onCode = function(iterator, constantPool) {
			methodDef.setMaxStackSize(iterator.readU16());
			methodDef.setMaxLocalVariables(iterator.readU16());

			// read bytecode instructions
			methodDef.setInstructions(blockParser.parseBlock(iterator, constantPool, iterator.readU32(), byteCodeParser));

			// read exception table
			methodDef.setExceptionTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, exceptionTableParser));

			codeAttributesParser.onAttributeCount = function(attributeCount) {
				//console.info("Code block has " + attributeCount + " attributes");
			};
			codeAttributesParser.onUnrecognisedAttribute = function(attributeName) {
				console.warn("Unrecognised attribute " + attributeName + " on code block");
			};
			codeAttributesParser.onLineNumberTable = function() {
				methodDef.setLineNumberTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 4, lineNumberTableParser));
			};
			codeAttributesParser.parse(iterator, constantPool);
		};
		attributesParser.onExceptions = function(iterator, constantPool) {
			var numExceptions = iterator.readU16();
			var exceptions = [];

			for(var m = 0; m < numExceptions; m++) {
				exceptions.push(constantPool.load(iterator.readU16()));
			}

			methodDef.setThrows(exceptions);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Deprecated", iterator);
			methodDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Synthetic", iterator);
			methodDef.setSynthetic(true);
		};
		attributesParser.parse(iterator, constantPool);

		return methodDef;
	};

	this.toString = function() {
		return "MethodDefinitionParser";
	};
};

jjvm.compiler.StackMapTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		while(iterator.hasNext()) {
			
		}
	};

	this.toString = function() {
		return "StackMapTableParser";
	};
};


(function() {
	// These are built in classes bundled with the JVM.  Declared here for compatibility..

	var object = new jjvm.types.ClassDefinition(
		new jjvm.types.ConstantPoolValue("Asciz", "java/lang/Object"), 
		null
	);
	object.setVisibility("public");

	var objectInit = new jjvm.types.MethodDefinition("<init>", [], null, object);
	objectInit.setImplementation(function() {
		// default initialiser
	});
	object.addMethod(objectInit);
	jjvm.core.SystemClassLoader.addClassDefinition(object);

	var printStream = new jjvm.types.ClassDefinition(
		new jjvm.types.ConstantPoolValue("Asciz", "java.io.PrintStream"),
		new jjvm.types.ConstantPoolValue("Asciz", "java.lang.Object")
	);
	printStream.setVisibility("public");
	var printStreamPrintLn = new jjvm.types.MethodDefinition("println", ["java.lang.String"], "void", printStream);
	printStreamPrintLn.setImplementation(function(line) {
		jjvm.ui.JJVM.console.info(line);
	});
	printStream.addMethod(printStreamPrintLn);
	jjvm.core.SystemClassLoader.addClassDefinition(printStream);

	var system = new jjvm.types.ClassDefinition(
		new jjvm.types.ConstantPoolValue("Asciz", "java.lang.System"),
		new jjvm.types.ConstantPoolValue("Asciz", "java.lang.Object")
	);
	system.setVisibility("public");
	
	var systemOut = new jjvm.types.FieldDefinition("out", "java.io.PrintStream", system);
	systemOut.setIsStatic(true);
	system.addField(systemOut);

	system.setStaticField("out", new jjvm.runtime.ObjectReference(printStream));
	jjvm.core.SystemClassLoader.addClassDefinition(system);
})();

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
		var compiler = new jjvm.compiler.Compiler();

		for(var i = 0; i < files.length; i++) {
			compiler.compile(files[i]);
		}
	};

	$(element).on("dragenter", _.bind(this.onDragEnter, this));
	$(element).on("dragexit", _.bind(this.onDragExit, this));
	$(element).on("dragover", _.bind(this.onDragOver, this));
	$(element).on("drop", _.bind(this.onDrop, this));
};

jjvm.ui.ClassOutliner = function(element) {
	var _userList = $(element).find("ul.user")[0];
	var _systemList = $(element).find("ul.system")[0];
	var _listElements = [];

	this._onExecutionComplete = function() {
		$(_userList).find("li").removeClass("executing");
		$(_systemList).find("li").removeClass("executing");
	};

	this._onBeforeInstructionExecution = function(frame, instruction) {
		for(var i = 0; i < _listElements.length; i++) {
			var item = _listElements[i];

			if(item.instruction == instruction) {
				$(item.listItem).addClass("executing");
				currentInstruction = item.listItem;
			} else {
				$(item.listItem).removeClass("executing");
			}
		}
	};

	this._buildClassList = function(sender) {
		$(_userList).empty();
		$(_systemList).empty();
		_listElements = [];

		$.each(jjvm.core.ClassLoader.getClassDefinitions(), _.bind(function(index, classDef) {
			this._buildClassOutline(classDef, _userList, true);
		}, this));

		$.each(jjvm.core.SystemClassLoader.getClassDefinitions(), _.bind(function(index, classDef) {
			this._buildClassOutline(classDef, _systemList, false);
		}, this));
	};

	this._buildClassOutline = function(classDef, list, startExpanded) {
		var innerList = $("<ul></ul>");

		$.each(classDef.getFields(), _.bind(function(index, fieldDef) {
			var cssClass = "field " + fieldDef.getVisibility() + (index === 0 ? " first" : "");
			var icon = "icon-white ";

			if(fieldDef.getVisibility() == "public") {
				icon += "icon-plus";
			} else if(fieldDef.getVisibility() == "private") {
				icon += "icon-minus";
			} else if(fieldDef.getVisibility() == "protected") {
				icon += "icon-asterisk";
			}

			innerList.append("<li class=\"" + cssClass + "\"><i class=\"" + icon + "\"></i> " + 
				this._formatVisibility(fieldDef.getVisibility()) + " " + 
				this._formatType(fieldDef.getType()) + " " + 
				(fieldDef.isStatic() ? this._formatKeyword("static") : "") + " " + 
				(fieldDef.isFinal() ? this._formatKeyword("final") : "") + " " + 
				fieldDef.getName() + "</li>");
		}, this));

		$.each(classDef.getMethods(), _.bind(function(index, methodDef) {
			var cssClass = "method " + methodDef.getVisibility() + (index === 0 ? " first" : "");
			var icon = "icon-white ";

			if(methodDef.getVisibility() == "public") {
				icon += "icon-plus";
			} else if(methodDef.getVisibility() == "private") {
				icon += "icon-minus";
			} else if(methodDef.getVisibility() == "protected") {
				icon += "icon-asterisk";
			}

			var method = innerList.append("<li class=\"" + cssClass + "\"><i class=\"" + icon + "\"></i> " + 
				this._formatVisibility(methodDef.getVisibility()) + " " + 
				(methodDef.isStatic() ? this._formatKeyword("static") : "") + " " + 
				(methodDef.isFinal() ? this._formatKeyword("final") : "") + " " + 
				(methodDef.isSynchronized() ? this._formatKeyword("synchronized") : "") + " " + 
				this._formatType(methodDef.getReturns()) + " " + 
				_.escape(methodDef.getName()) + "(" + 
				this._formatTypes(methodDef.getArgs()) + ")</li>");
			var instructionList = $("<ul class=\"instruction_list\"></ul>");
			$(method).append(instructionList);

			if(methodDef.getImplementation()) {
				$(instructionList).append("<li>Native code</li>");
			} else if(methodDef.getInstructions()) {
				$.each(methodDef.getInstructions(), function(index, instruction) {
					var checkbox = $("<input type=\"checkbox\"/>");
					$(checkbox).attr("checked", instruction.hasBreakpoint());
					$(checkbox).change(function() {
						instruction.setBreakpoint($(checkbox).is(':checked'));
					});

					var listItem = $("<li></li>");
					$(listItem).append(checkbox);
					$(listItem).append(" " + _.escape(instruction.toString()));

					_listElements.push({listItem: listItem, instruction: instruction});

					$(instructionList).append(listItem);
				});
			} else {
				$(instructionList).append("<li>Missing</li>");
			}
		}, this));

		var link = $("<a>" + classDef.getName() + "</a>");

		if(classDef.getSourceFile()) {
			$(link).prepend("<small class=\"muted\">" + classDef.getSourceFile() + " / " + classDef.getVersion() + "</small>");
		}

		$(link).click(function(event) {
			event.preventDefault();
			innerList.toggle();
		});

		var listHolder = $("<li></li>");
		listHolder.append(link);
		listHolder.append(innerList);

		if(!startExpanded) {
			$(innerList).css("display", "none");
		}

		$(list).append(listHolder);
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

		return "<span class=\"" + cssClass + "\">" + visibility + "</span>";
	};

	this._formatKeyword = function(keyword) {
		return "<span class=\"text-warning\">" + keyword + "</span>";	
	};

	this._formatType = function(type) {
		return "<span class=\"text-info\">" + type + "</span>";
	};

	this._formatTypes = function(types) {
		var output = [];

		$.each(types, _.bind(function(index, type) {
			output.push(this._formatType(type));
		}, this));

		return output.join(", ");
	};

	jjvm.core.NotificationCentre.register("onCompileSuccess", _.bind(this._buildClassList, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._onBeforeInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._onExecutionComplete, this));

	this._buildClassList();
};

jjvm.ui.Console = function(element) {
	$(element).find("button").click(_.bind(function(event) {
		event.preventDefault();
		this.clear();
	}, this));

	this.info = function(message) {
		console.info(message);
		this._addLogLine(message, "text-info", "icon-info-sign");
	};

	this.warn = function(message) {
		console.warn(message);
		this._addLogLine(message, "text-warning", "icon-exclamation-sign");
	};

	this.error = function(message) {
		console.error(message);
		this._addLogLine(message, "text-error", "icon-remove-sign");
	};

	this.clear = function() {
		$(element).find("ul").empty();
	};

	this._addLogLine = function(message, cssClass, iconClass) {
		var icon = document.createElement("i");
		icon.className = "icon-white " + iconClass;

		var logLine = document.createElement("li");
		logLine.className = cssClass;
		logLine.appendChild(icon);
		logLine.appendChild(document.createTextNode(" " + message));

		$(element).find("ul").append(logLine);

		$(element).scrollTop($(element)[0].scrollHeight);
	};
};

jjvm.ui.FrameWatcher = function(localVariableTable, stackTable, title) {
	
	this._update = function(frame) {
		this._updateLocalVariableTable(frame.getLocalVariables().getLocalVariables());
		this._updateStackTable(frame.getStack().getStack());

		$(title).empty();
		$(title).append(frame.getClassDef().getName() + "#" + frame.getMethodDef().getName());
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

	jjvm.core.NotificationCentre.register("onInstructionExecution", _.bind(function(frame, instruction) {
		this._update(frame.getThread().getCurrentFrame());
	}, this));
	jjvm.core.NotificationCentre.register("onCurrentFrameChanged", _.bind(function(thread, frame) {
		this._update(thread.getCurrentFrame());
	}, this));
};

jjvm.ui.JJVM = {
	console: null,
	_frameWatcher: null,
	_classOutliner: null,
	_threadWatcher: null,
	_classDropper: null,

	init: function() {
		// no compilation while we do setup
		$("#button_compile").attr("disabled", true);

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
		$("#button_drop_to_frame").attr("disabled", true);

		// set up debug button listeners
		$("#button_resume").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onResumeExecution");
		});
		$("#button_pause").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onSuspendExecution");
		});
		$("#button_step_over").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onStepOver");
		});
		$("#button_drop_to_frame").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onDropToFrame");
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
			jjvm.ui.JJVM.console.info("Compilation complete");
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
			$("#button_drop_to_frame").removeAttr("disabled");
		});

		jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
			// reset buttons
			$("#button_run").removeAttr("disabled");
			$("#button_resume").attr("disabled", true);
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);

			jjvm.ui.JJVM.console.info("Done");
		});

		// all done, enable input
		$("#source").removeAttr("disabled");

		// if we've already got input, enable the compile button
		if($("#source").val()) {
			$("#button_compile").removeAttr("disabled");
		}
	},

	run: function(event) {
		event.preventDefault();

		// find something to execute
		var mainClass;
		var mainMethod;

		$.each(jjvm.core.ClassLoader.getClassDefinitions(), function(index, classDef) {
			$.each(classDef.getMethods(), function(index, methodDef) {
				if(methodDef.getName() == "main" && methodDef.isStatic() && methodDef.getReturns() == "void") {
					mainClass = classDef;
					mainMethod = methodDef;
				}
			});
		});

		if(!mainMethod) {
			// nothing to execute, abort!
			jjvm.ui.JJVM.console.warn("No main method present.");

			return;
		}

		// parse program arguments
		var args = $("#program_run input").val().split(",");

		$.each(args, function(index, arg) {
			args[index] = _.str.trim(arg);
		});

		args = [null, args];

		$("#button_run").attr("disabled", true);
		$("#button_resume").attr("disabled", true);
		$("#button_pause").removeAttr("disabled");
		$("#button_step_over").attr("disabled", true);
		$("#button_drop_to_frame").attr("disabled", true);

		try {
			jjvm.ui.JJVM.console.info("Executing...");
			var thread = new jjvm.runtime.Thread(new jjvm.runtime.Frame(mainClass, mainMethod, args));
			thread.register("onExecutionComplete", function() {
				thread.deRegister("onExecutionComplete", this);

				$("#button_run").removeAttr("disabled");
				$("#button_resume").removeAttr("disabled");
				$("#button_pause").attr("disabled", true);
				$("#button_step_over").removeAttr("disabled");
				$("#button_drop_to_frame").removeAttr("disabled");

				jjvm.runtime.ThreadPool.reap();
			});
			jjvm.ui.JJVM._threadWatcher.setSelectedThread(thread);
			thread.run();
		} catch(error) {
			jjvm.ui.JJVM.console.error(error);
		}
	}
};
jjvm.ui.ThreadWatcher = function(list) {
	var _selectedThread;

	this.getSelectedThread = function() {
		return _selectedThread;
	};

	this.setSelectedThread = function(thread) {
		_selectedThread = thread;
	};

	this._update = function() {
		$(list).empty();

		for(var i = 0; i < jjvm.runtime.ThreadPool.threads.length; i++) {
			if(!_selectedThread) {
				_selectedThread = jjvm.runtime.ThreadPool.threads[i];
			}

			this._addThread(jjvm.runtime.ThreadPool.threads[i]);
		}
	};

	this._addThread = function(thread) {
		var threadName;

		if(_selectedThread == thread) {
			threadName = $("<span><i class=\"icon-arrow-right icon-white\"></i> " + thread + "</span>");
		} else {
			threadName = $("<a>" + thread + "</a>");

			$(threadName).click(_.bind(function(event) {
				event.preventDefault();

				_selectedThread = thread;
				this._update();
			}, this));
		}

		var li = $("<li />");
		$(li).append(threadName);

		if(thread.getStatus() == jjvm.runtime.Thread.STATUS.RUNNABLE) {
			$(threadName).addClass("text-success");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.TERMINATED) {
			$(threadName).addClass("muted");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.NEW) {
			$(threadName).addClass("text-info");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.BLOCKED) {
			$(threadName).addClass("text-error");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.WAITING) {
			$(threadName).addClass("text-warn");
		} else if(thread.getStatus() == jjvm.runtime.Thread.STATUS.TIMED_WAITING) {
			$(threadName).addClass("text-warn");
		}

		var frameList = $("<ul></ul>");
		var frame = thread.getInitialFrame();

		while(frame) {
			$(frameList).append("<li>" + frame + "</li>");	

			frame = frame.getChild();
		}

		$(li).append(frameList);
		$(list).append(li);
	};

	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onThreadGC", _.bind(this._update, this));
};
