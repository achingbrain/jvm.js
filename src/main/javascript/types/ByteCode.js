jjvm.types.ByteCode = function(mnemonic, operation, args, location) {
	var _breakpoint;

	var invokeMethod = function(classDef, methodDef, frame) {
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
		
		frame.executeChild(classDef, methodDef, args);
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
				var field = constantPool.load(index);

				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var value = classDef.getStaticField(fieldName);

				frame.getStack().push(value);
			};
		},
		"put_static": function(index) {
			this.execute = function(frame, constantPool) {
				var field = constantPool.load(index).getValue();
				var fieldName = field.getName();

				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var value = frame.getStack().pop();

				classDef.setStaticField(fieldName, value);
			};
		},
		"get_field": function(index) {
			this.execute = function(frame, constantPool) {
				var field = constantPool.load(index).getValue();
				var fieldName = field.getName();

				var objectRef = frame.getStack().pop();
				var value = objectRef.getField(fieldName);

				frame.getStack().push(value);
			};
		},
		"put_field": function(index) {
			this.execute = function(frame, constantPool) {
				var field = constantPool.load(index).getValue();
				var fieldName = field.getName();

				var value = frame.getStack().pop();
				var objectRef = frame.getStack().pop();

				objectRef.setField(fieldName, value);
			};
		},
		"invoke_virtual": function(index) {
			this.execute = function(frame, constantPool) {
				var match = constantPool.load(index);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);

				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invoke_special": function(string) {
			var regex = /\/\/Method\s+(([a-zA-Z0-9_$\/]+)\.)?\"<init>\":\((.*)\)/;

			this.execute = function(frame, constantPool) {
				var match = string.match(regex);
				var className = match[2] ? match[2].replace(/\//g, ".") : frame.getClassDef().getName();
				var args = match[3].split(";");

				for(var i = 0; i < args.length; i++) {
					args[i] = _.str.trim(args[i]);

					if(_.str.isBlank(args[i])) {
						args.splice(i, 1);
						i--;

						continue;
					}

					args[i] = args[i].replace(/\//g, ".");

					if(jjvm.types.Primitives[args[i]]) {
						args[i] = jjvm.types.Primitives[args[i]];
					} else if(_.str.startsWith(args[i], "L")) {
						args[i] = args[i].substr(1);
					}

					args[i] = jjvm.core.ClassLoader.loadClass(args[i]);
				}

				var constructorArgs = [];

				for(var n = 0; n < args.length; n++) {
					constructorArgs.push(frame.getStack().pop());
				}

				var objectRef = frame.getStack().pop();
				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var constructorDef = classDef.getConstructor(args);

				constructorArgs.unshift(objectRef);

				frame.executeChild(classDef, constructorDef, constructorArgs);
			};
		},
		"invoke_static": function(string) {
			var regex = /\/\/Method\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame, constantPool) {
				var match = string.match(regex);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);

				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invoke_interface": function(string) {
			var regex = /\/\/InterfaceMethod\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame, constantPool) {
				var match = string.match(regex);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);
				
				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invoke_dynamic": function(string) {
			var regex = /\/\/InterfaceMethod\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame, constantPool) {
				var match = string.match(regex);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = jjvm.core.ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);
				
				invokeMethod(classDef, methodDef, frame);
			};
		},
		"new": function(index) {
			this.execute = function(frame, constantPool) {
				var className = constantPool.load(index);
				var classDef = jjvm.core.ClassLoader.loadClass(className);

				frame.getStack().push(new jjvm.runtime.ObjectReference(classDef));
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
				var className = constantPool.load(index);
				var objectRef = frame.getStack().pop();

				if(objectRef.getClass().getName() != className) {
					throw "ClassCastException: Object of type " + objectRef.getClass().getName() + " cannot be cast to " + className;
				}
			};	
		},
		"instance_of": function(index) {
			this.execute = function(frame, constantPool) {
				var className = constantPool.load(index);
				var objectRef = frame.getStack().pop();

				frame.getStack().push(objectRef.getClass().getName() == className);
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
		return mnemonic;
	};

	this.hasBreakpoint = function() {
		return _breakpoint;
	};

	this.setBreakpoint = function(breakpoint) {
		_breakpoint = breakpoint;
	};
};
