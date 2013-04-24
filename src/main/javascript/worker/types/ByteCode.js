jjvm.types.ByteCode = function(data) {
	var _data = data ? data : {};

	var _breakpoint;
	var _operation;

	var invokeMethod = function(methodDef, frame) {
		var args = [];

		for(var i = 0; i < methodDef.getArgs().length; i++) {
			args.unshift(frame.getStack().pop());
		}

		if(!methodDef.isStatic()) {
			// place reference to current object at position 0 of local arguments
			args.unshift(frame.getStack().pop());
		}

		if(args[0] instanceof jjvm.types.ClassDefinition) {
			// swap ClassDefinition for it's object ref
			var classDef = args.shift();
			args.unshift(classDef.getObjectRef());
		}

		if(methodDef.isStatic()) {
			console.debug("Invoking static method " + methodDef.getName() + " on " + methodDef.getClassDef().getName() + " with args " + args);
		} else {
			console.debug("Invoking instance method " + methodDef.getName() + " on " + args[0].getClass().getName() + " as " + methodDef.getClassDef().getName() + " with args " + args);
		}

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
		"push_constant": function(index) {
			this.execute = function(frame, constantPool) {
				// should return String, int or float
				var value = constantPool.load(index);

				if(!value) {
					throw "Constant value was falsy!";
				}

				if(value instanceof jjvm.types.ConstantPoolClassValue) {
					value = value.getClassDef();
				} else if(value instanceof jjvm.types.ConstantPoolStringReferenceValue) {
					value = value.getStringReference();
				} else {
					value = value.getValue();
				}

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
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				if(index >= array.length) {
					throw "ArrayIndexOutOfBoundsExecption: " + index;
				}

				frame.getStack().push(array[index]);
			};
		},
		"array_load_character": function() {
			this.execute = function(frame, constantPool) {
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				if(index >= array.length) {
					throw "ArrayIndexOutOfBoundsExecption: " + index;
				}

				frame.getStack().push(array[index].charCodeAt(0));
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
		"array_store_character": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				// convert ascii code to string
				array[index] = String.fromCharCode(value);
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
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value2);
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
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				// bitwise operators don't work for > 32bit integers in JavaScript
				var result = value2 * Math.pow(2, value1);

				frame.getStack().push(result);
			};
		},
		"arithmetic_shift_right": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				// bitwise operators don't work for > 32bit integers in JavaScript
				var result = value2 / Math.pow(2, value1);

				frame.getStack().push(result);
			};
		},
		"logical_shift_right": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				// probably won't work for > 32bit integers in JavaScript
				frame.getStack().push(value2 >>> value1);
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

				frame.getLocalVariables().store(location, value + amount);
			};
		},
		"compare": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 == value2);
			};	
		},
		"convert": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getStack().push(value);
			};	
		},
		"convert_to_boolean": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getStack().push(value ? true : false);
			};	
		},
		"if_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 == value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpeq #" + jumpTo;
			};
		},
		"if_not_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 != value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpne #" + jumpTo;
			};
		},
		"if_less_than": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 < value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmplt #" + jumpTo;
			};
		},
		"if_greater_than_or_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 >= value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpge #" + jumpTo;
			};
		},
		"if_greater_than": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 > value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpgt #" + jumpTo;
			};
		},
		"if_less_than_or_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 <= value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmple #" + jumpTo;
			};
		},
		"if_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value === 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_not_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value !== 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_less_than_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value < 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_greater_than_or_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value >= 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_greater_than_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value > 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_less_than_or_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value <= 0) {
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
		"return_value": function(string) {
			this.execute = function(frame, constantPool) {
				return frame.getStack().pop();
			};
		},
		"return_void": function(string) {
			this.execute = function(frame, constantPool) {
				return jjvm.runtime.Void;
			};
		},
		"get_static": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var classDef = constantPool.load(index).getClassDef();
				var value = classDef.getStaticField(fieldDef.getName());

				frame.getStack().push(value);
			};
		},
		"put_static": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var classDef = constantPool.load(index).getClassDef();
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
		},
		"invoke_special": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_static": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_interface": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				// special case - the interface contract demands that the object reference on the stack
				// will implement a method with the same name and arguments as the interface method def
				// so execute that instead

				var objectRef = frame.getStack().pop();
				var classDef = objectRef.getClass();
				methodDef = classDef.getMethod(methodDef.getName());

				// put the ref back on the stack
				frame.getStack().push(objectRef);

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_dynamic": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
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

				throw new jjvm.runtime.Thrown(throwable);
			};
		},
		"check_cast": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();
				var objectRef = frame.getStack().pop();

				if(!objectRef.isInstanceOf(classDef)) {
					throw "ClassCastException: Object of type " + objectRef.getClass().getName() + " cannot be cast to " + classDef.getName();
				}

				// put it back on the stack
				frame.getStack().push(objectRef);
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

	this._getOperation = function() {
		if(!_operation) {

			// lets us call .apply on a function constructor
			var construct = _.bind(function(constructor) {
				function F() {
					return constructor.apply(this, _data.args);
				}
				F.prototype = constructor.prototype;

				return new F();
			}, this);

			_operation = construct(operations[this.getOperation()]);

			// allow for overriding description as sometimes we want to show specific 
			// arguments and bytecode for instructions that have been grouped together
			if(_data.description) {
				_operation.describe = function() {
					return _data.description;
				};
			}
		}

		return _operation;
	};

	this.execute = function(frame, constantPool) {
		return this._getOperation().execute(frame, constantPool);
	};

	this.getLocation = function() {
		return location;
	};

	this.toString = function() {
		return this.getLocation() + ": " + this.getDescription();
	};

	this.hasBreakpoint = function() {
		return _breakpoint ? true : false;
	};

	this.setBreakpoint = function(breakpoint) {
		_breakpoint = breakpoint;
	};

	this.setMnemonic = function(mnemonic) {
		this.getData().mnemonic = mnemonic;
	};

	this.getMnemonic = function() {
		return this.getData().mnemonic;
	};

	this.setOperation = function(operation) {
		this.getData().operation = operation;
	};

	this.getOperation = function() {
		return this.getData().operation;
	};

	this.setArgs = function(args) {
		this.getData().args = args;
	};

	this.getArgs = function() {
		return this.getData().args;
	};

	this.setLocation = function(location) {
		this.getData().location = location;
	};

	this.getLocation = function() {
		return this.getData().location;
	};

	this.setDescription = function(description) {
		this.getData().description = description;
	};

	this.getDescription = function() {
		return this.getData().description;
	};

	this.canStepInto = function() {
		return _.string.startsWith(this.getOperation(), "invoke");
	};

	this.getData = function() {
		return _data;
	};
};
