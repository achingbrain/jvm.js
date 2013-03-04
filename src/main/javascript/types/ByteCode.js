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