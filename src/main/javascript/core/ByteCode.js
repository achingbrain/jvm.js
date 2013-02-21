ByteCode = function(line) {
	var _breakpoint;
	
	var primitive_types = {
		"Z": "boolean",
		"B": "byte",
		"C": "char",
		"S": "short",
		"I": "int",
		"J": "long",
		"F": "float",
		"D": "double"
	};

	var ops_regex = {
		"load": /[0-9]+:\s+([a|i|d|l|f]load_([0-9]+))$/,
		"load_from_index": /[0-9]+:\s+([a|i|d|l|f]load)\s+[0-9]+$/,
		"array_load": /[0-9]+:\s+([a|b|c|d|f|i|l|s]aload)$/,
		"array_create": /[0-9]+:\s+(a?newarray)/,
		"array_length": /[0-9]+:\s+(arraylength)$/,
		"multi_dimensional_array_create": /[0-9]+:\s+(multianewarray)/,
		"throw": /[0-9]+:\s+(athrow)$/,
		"add": /[0-9]+:\s+([d|f|i|l]add)/,
		"mul": /[0-9]+:\s+([d|f|i|l]mul)/,
		"div": /[0-9]+:\s+([d|f|i|l]div)/,
		"sub": /[0-9]+:\s+([d|f|i|l]sub)/,
		"neg": /[0-9]+:\s+([d|f|i|l]neg)/,
		"rem": /[0-9]+:\s+([d|f|i|l]rem)/,
		"store": /[0-9]+:\s+([a|i|d|l|f]store_)/,
		"store_at_index": /[0-9]+:\s+([a|i|d|l|f]store\s+[0-9]+)/,
		"array_store": /[0-9]+:\s+([a|b|c|d|f|i|l|s]astore)/,
		"return": /[0-9]+:\s+([a|i|d|l|f]?return)$/,
		"new": /[0-9]+:\s+(new)\s+/,
		"dup": /[0-9]+:\s+(dup)$/,
		"dup2": /[0-9]+:\s+(dup2)$/,
		"dup2_x1": /[0-9]+:\s+(dup2_x1)$/,
		"dup2_x2": /[0-9]+:\s+(dup2_x2)$/,
		"dup_x1": /[0-9]+:\s+(dup_x1)$/,
		"dup_x2": /[0-9]+:\s+(dup_x2)$/,
		"invokespecial": /[0-9]+:\s+(invokespecial)/,
		"invokevirtual": /[0-9]+:\s+(invokevirtual)\s+#[0-9]+;\s+\/\/Method\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/,
		"invokevirtual_local": /[0-9]+:\s+(invokevirtual)\s+#[0-9]+;\s+\/\/Method\s+([a-zA-Z0-9_\$]+):/,
		"invokeinterface": /[0-9]+:\s+(invokeinterface)\s+#[0-9]+,\s+[0-9]+;\s+\/\/InterfaceMethod\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/,
		"invokeinterface_local": /[0-9]+:\s+(invokeinterface)\s+#[0-9]+,\s+[0-9]+;\s+\/\/InterfaceMethod\s+([a-zA-Z0-9_\$]+):/,
		"invokestatic": /[0-9]+:\s+(invokestatic)\s+#[0-9]+;\s+\/\/Method\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/,
		"invokestatic_local": /[0-9]+:\s+(invokestatic)\s+#[0-9]+;\s+\/\/Method\s+([a-zA-Z0-9_\$]+):/,
		"const": /[0-9]+:\s+([a|aa|i|d|l|f]const)/,
		"get_static": /[0-9]+:\s+(getstatic)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_]+):/,
		"get_local_static": /[0-9]+:\s+(getstatic)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_]+):/,
		"get_field": /[0-9]+:\s+(getfield)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_]+):/,
		"get_local_field": /[0-9]+:\s+(getfield)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_]+):/,
		"push": /[0-9]+:\s+((bi|si)push)\s+([0-9]+)$/,
		"put_field": /[0-9]+:\s+(putfield)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_]+):/,
		"put_local_field": /[0-9]+:\s+(putfield)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_]+):/,
		"put_static": /[0-9]+:\s+(putstatic)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_]+):/,
		"put_local_static": /[0-9]+:\s+(putstatic)\s+#[0-9]+;\s+\/\/Field\s+([a-zA-Z0-9_]+):/,
		"ldc_int": /[0-9]+:\s+(ldc)\s+#[0-9]+;\s+\/\/int\s+([0-9]+)$/,
		"ldc_string": /[0-9]+:\s+(ldc)\s+#[0-9]+;\s+\/\/String\s+(.*)$/,
		"ldc_float": /[0-9]+:\s+(ldc)\s+#[0-9]+;\s+\/\/float\s+([0-9]+\.[0-9])f$/,
		"ldc_long": /[0-9]+:\s+(ldc2_w)\s+#[0-9]+;\s+\/\/long\s+([0-9]+)l$/,
		"ldc_double": /[0-9]+:\s+(ldc2_w)\s+#[0-9]+;\s+\/\/double\s+([0-9]+\.[0-9])d$/,
		"const_null": /[0-9]+:\s+(aconst_null)$/,
		"convert": /[0-9]+:\s+([i|l|f|d]2[l|f|d|i|c|s])$/,
		"convert_to_boolean": /[0-9]+:\s+([i|l|f|d]2b)$/,
		"checkcast": /[0-9]+:\s+(checkcast)/,
		"compare": /[0-9]+:\s+([d|f|l]cmp[g|l]?)/,
		"goto": /[0-9]+:\s+(goto)/,
		"and": /[0-9]+:\s+([i|l]and)/,
		"or": /[0-9]+:\s+([i|l]or)/,
		"xor": /[0-9]+:\s+([i|l]xor)/,
		"shift_left": /[0-9]+:\s+([i|l]shl)/,
		"shift_right": /[0-9]+:\s+(([i|l]|lu)shr)/,
		"monitor_enter": /[0-9]+:\s+(monitorenter)/,
		"monitor_exit": /[0-9]+:\s+(monitorexit)/,
		"pop": /[0-9]+:\s+(pop)/,
		"pop2": /[0-9]+:\s+(pop2)/,
		"nop": /[0-9]+:\s+(nop)/,
		"swap": /[0-9]+:\s+(swap)/,
		"ret": /[0-9]+:\s+(ret)\s+([0-9]+)$/,
		"jsr": /[0-9]+:\s+(jsr)/,
		"if_equal": /[0-9]+:\s+(if(_[a|i]cmp)?eq)/,
		"if_not_equal": /[0-9]+:\s+(if(_[a|i]cmp)?ne)/,
		"if_less_than": /[0-9]+:\s+(if(_icmp)?lt)/,
		"if_less_than_or_equal": /[0-9]+:\s+(if(_icmp)?le)/,
		"if_greater_than": /[0-9]+:\s+(if(_icmp)?gt)/,
		"if_greater_than_or_equal": /[0-9]+:\s+(if(_icmp)?ge)/,
		"if_null": /[0-9]+:\s+(ifnull)/,
		"if_non_null": /[0-9]+:\s+(ifnonnull)/,
		"increment": /[0-9]+:\s+(iinc)/,
		"instanceof": /[0-9]+:\s+(instanceof)/
	};

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
		"load": function(string) {
			var location = string.split("_")[1];

			this.execute = function(frame) {
				var value = frame.getLocalVariables().load(location);
				frame.getStack().push(value);
			};
		},
		"load_from_index": function(string) {
			var regex = /load\s+([0-9]+)$/;
			var location = string.match(regex)[1];

			this.execute = function(frame) {
				var value = frame.getLocalVariables().load(location);
				frame.getStack().push(value);
			};
		},
		"array_load": function(string) {
			this.execute = function(frame) {
				var array = frame.getStack().pop();
				var index = frame.getStack().pop();

				if(index >= array.length) {
					throw "ArrayIndexOutOfBoundsExecption: " + index;
				}

				frame.getStack().push(array[index]);
			};
		},
		"array_create": function(string) {
			this.execute = function(frame) {
				var length = frame.getStack().pop();
				var array = [];
				array.length = length;

				frame.getStack().push(array);
			};
		},
		"multi_dimensional_array_create": function(string) {
			var regex = /multianewarray\s+#[0-9]+,\s+([0-9]+)/;
			var dimensions = string.match(regex)[1];

			this.execute = function(frame) {
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
		"array_length": function(string) {
			this.execute = function(frame) {
				var array = frame.getStack().pop();

				frame.getStack().push(array.length);
			};
		},
		"throw": function(string) {
			this.execute = function(frame) {
				var throwable = frame.getStack().pop();

				// is this too literal?
				throw throwable;
			};
		},
		"store": function(string) {
			var location = string.split("_")[1];

			this.execute = function(frame) {
				var value = frame.getStack().pop();

				frame.getLocalVariables().store(location, value);
			};
		},
		"store_at_index": function(string) {
			var regex = /[0-9]+:\s+[a|i|d|l|f]store\s+([0-9]+)/;
			var match = string.match(regex);
			var location = parseInt(match[1], 10);

			this.execute = function(frame) {
				var value = frame.getStack().pop();

				frame.getLocalVariables().store(location, value);
			};
		},
		"array_store": function(string) {
			this.execute = function(frame) {
				var value = frame.getStack().pop();
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				array[index] = value;
			};
		},
		"return": function(string) {
			this.execute = function(frame) {
				return frame.getStack().pop();
			};
		},
		"new": function(string) {
			var regex = /new\s+#[0-9]+;\s\/\/class\s(.*)/;

			this.execute = function(frame) {
				var className = string.match(regex)[1];
				var classDef = ClassLoader.loadClass(className);

				frame.getStack().push(new ObjectReference(classDef));
			};
		},
		"dup": function(string) {
			this.execute = function(frame) {
				var value = frame.getStack().pop();

				frame.getStack().push(value);
				frame.getStack().push(value);
			};
		},
		"dup2": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup2_x1": function(string) {
			this.execute = function(frame) {
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
		"dup2_x2": function(string) {
			this.execute = function(frame) {
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
		"dup_x1": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup_x2": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"invokespecial": function(string) {
			var regex = /\/\/Method\s+(([a-zA-Z0-9_$\/]+)\.)?\"<init>\":\((.*)\)/;

			this.execute = function(frame) {
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

					if(primitive_types[args[i]]) {
						args[i] = primitive_types[args[i]];
					} else if(_.str.startsWith(args[i], "L")) {
						args[i] = args[i].substr(1);
					}

					args[i] = ClassLoader.loadClass(args[i]);
				}

				var constructorArgs = [];

				for(var n = 0; n < args.length; n++) {
					constructorArgs.push(frame.getStack().pop());
				}

				var objectRef = frame.getStack().pop();
				var classDef = ClassLoader.loadClass(className);
				var constructorDef = classDef.getConstructor(args);

				constructorArgs.unshift(objectRef);

				frame.executeChild(classDef, constructorDef, constructorArgs);
			};
		},
		"invokevirtual": function(string) {
			var regex = /\/\/Method\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame) {
				var match = string.match(regex);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);

				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invokevirtual_local": function(string) {
			var regex = /\/\/Method\s+([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame) {
				var match = string.match(regex);
				var methodName = match[1];
				var classDef = frame.getClassDef();
				var methodDef = classDef.getMethod(methodName);

				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invokeinterface": function(string) {
			var regex = /\/\/InterfaceMethod\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame) {
				var match = string.match(regex);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);
				
				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invokeinterface_local": function(string) {
			var regex = /\/\/InterfaceMethod\s+([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame) {
				var match = string.match(regex);
				var methodName = match[1];
				var classDef = frame.getClassDef();
				var methodDef = classDef.getMethod(methodName);
				
				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invokestatic": function(string) {
			var regex = /\/\/Method\s+([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame) {
				var match = string.match(regex);
				var className = match[1].replace(/\//g, ".");
				var methodName = match[2];
				var classDef = ClassLoader.loadClass(className);
				var methodDef = classDef.getMethod(methodName);

				invokeMethod(classDef, methodDef, frame);
			};
		},
		"invokestatic_local": function(string) {
			var regex = /\/\/Method\s+([a-zA-Z0-9_\$]+):/;

			this.execute = function(frame) {
				var match = string.match(regex);
				var methodName = match[1];
				var classDef = frame.getClassDef();
				var methodDef = classDef.getMethod(methodName);

				invokeMethod(classDef, methodDef, frame);
			};
		},
		"const": function(string) {
			var value = string.split("_")[1];

			if(value == "m1") {
				value = -1;
			} else {
				value = 1 * value;
			}

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"get_static": function(string) {
			var regex = /\/\/Field\s+([a-zA-Z0-9_$\/]+)?\.([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var className = match[1].replace(/\//g, ".");
			var fieldName = match[2];

			this.execute = function(frame) {
				var classDef = ClassLoader.loadClass(className);
				var value = classDef.getStaticField(fieldName);

				frame.getStack().push(value);
			};
		},
		"get_local_static": function(string) {
			var regex = /\/\/Field\s+([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var fieldName = match[1];

			this.execute = function(frame) {
				var classDef = frame.getClassDef();
				var value = classDef.getStaticField(fieldName);

				frame.getStack().push(value);
			};
		},
		"put_static": function(string) {
			var regex = /\/\/Field\s+([a-zA-Z0-9_$\/]+)?\.([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var className = match[1].replace(/\//g, ".");
			var fieldName = match[2];

			this.execute = function(frame) {
				var classDef = ClassLoader.loadClass(className);
				var value = frame.getStack().pop();

				classDef.setStaticField(fieldName, value);
			};
		},
		"put_local_static": function(string) {
			var regex = /\/\/Field\s+([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var fieldName = match[1];

			this.execute = function(frame) {
				var classDef = frame.getClassDef();
				var value = frame.getStack().pop();

				classDef.setStaticField(fieldName, value);
			};
		},
		"get_field": function(string) {
			var regex = /\/\/Field\s([a-zA-Z0-9_\/]+)\.([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var className = match[1].replace(/\//g, ".");
			var fieldName = match[2];

			this.execute = function(frame) {
				var objectRef = frame.getStack().pop();
				var value = objectRef.getField(fieldName);

				frame.getStack().push(value);
			};
		},
		"get_local_field": function(string) {
			var regex = /\/\/Field\s+([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var fieldName = match[1];

			this.execute = function(frame) {
				var objectRef = frame.getStack().pop();
				var value = objectRef.getField(fieldName);

				frame.getStack().push(value);
			};
		},
		"put_field": function(string) {
			var regex = /\/\/Field\s([a-zA-Z0-9_$\/]+)\.([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var className = match[1].replace(/\//g, ".");
			var fieldName = match[2];

			this.execute = function(frame) {
				var value = frame.getStack().pop();
				var objectRef = frame.getStack().pop();

				objectRef.setField(fieldName, value);
			};
		},
		"put_local_field": function(string) {
			var regex = /\/\/Field\s([a-zA-Z0-9_]+):/;
			var match = string.match(regex);
			var fieldName = match[1];

			this.execute = function(frame) {
				var value = frame.getStack().pop();
				var objectRef = frame.getStack().pop();

				objectRef.setField(fieldName, value);
			};
		},
		"push": function(string) {
			var regex = /(bi|si)push\s+([0-9]+)$/;
			var match = string.match(regex);
			var value = parseInt(match[2], 10);

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"ldc_int": function(string) {
			var regex = /\/\/int\s+([0-9]+)$/;
			var match = string.match(regex);
			var value = parseFloat(match[1]);

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"ldc_string": function(string) {
			var regex = /\/\/String\s+(.*)$/;
			var match = string.match(regex);
			var value = match[1];

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"ldc_float": function(string) {
			var regex = /\/\/float\s+([0-9]+\.[0-9]+)f$/;
			var match = string.match(regex);
			var value = parseFloat(match[1]);

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"ldc_long": function(string) {
			var regex = /\/\/long\s+([0-9]+)l$/;
			var match = string.match(regex);
			var value = parseFloat(match[1]);

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"ldc_double": function(string) {
			var regex = /\/\/double\s+([0-9]+\.[0-9]+)d$/;
			var match = string.match(regex);
			var value = parseInt(match[1], 10);

			this.execute = function(frame) {
				frame.getStack().push(value);
			};
		},
		"const_null": function(string) {
			this.execute = function(frame) {
				frame.getStack().push(null);
			};
		},
		"convert": function(string) {
			this.execute = function(frame) {
				
			};	
		},
		"convert_to_boolean": function(string) {
			this.execute = function(frame) {
				var value = frame.getStack().pop() ? true : false;
				frame.getStack().push(value);
			};	
		},
		"add": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1 + value2);
			};
		},
		"mul": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1 * value2);
			};	
		},
		"div": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 / value1);
			};	
		},
		"sub": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 - value1);
			};	
		},
		"neg": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();

				frame.getStack().push(-1 * value1);
			};	
		},
		"rem": function(string) {
			this.execute = function(frame) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 % value1);
			};	
		},
		"checkcast": function(string) {
			var regex = /\/\/class\s+(.+)$/;
			var className = string.match(regex)[1].replace(/\//g, ".");

			this.execute = function(frame) {
				var objectRef = frame.getStack().pop();

				if(objectRef.getClass().getName() != className) {
					throw "ClassCastException: Object of type " + objectRef.getClass().getName() + " cannot be cast to " + className;
				}
			};	
		},
		"compare": function(string) {
			var regex = /\/\/class\s+(.+)$/;

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 == value2);
			};	
		},
		"and": function(string) {
			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 & value2);
			};
		},
		"or": function(string) {
			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 | value2);
			};
		},
		"xor": function(string) {
			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 ^ value2);
			};
		},
		"shift_left": function(string) {
			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 << value2);
			};
		},
		"shift_right": function(string) {
			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 >> value2);
			};
		},
		"monitor_enter": function(string) {
			this.execute = function(frame) {
				// don't support synchronisation so just pop the ref
				frame.getStack().pop();
			};
		},
		"monitor_exit": function(string) {
			this.execute = function(frame) {
				// don't support synchronisation so just pop the ref
				frame.getStack().pop();
			};
		},
		"pop": function(string) {
			this.execute = function(frame) {
				frame.getStack().pop();
			};
		},
		"pop2": function(string) {
			this.execute = function(frame) {
				frame.getStack().pop();
				frame.getStack().pop();
			};
		},
		"nop": function(string) {
			this.execute = function(frame) {
				
			};
		},
		"swap": function(string) {
			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"goto": function(string) {
			var regex = /goto\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[1], 10);

			this.execute = function(frame) {
				throw new Goto(goingTo);
			};
		},
		"ret": function(string) {
			var regex = /ret\s+([0-9]+)/;
			var match = string.match(regex);
			var location = parseInt(match[1], 10);

			this.execute = function(frame) {
				var goingTo = frame.getLocalVariables().load(location);

				throw new Goto(goingTo);
			};
		},
		"jsr": function(string) {
			var regex = /jsr\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[1], 10);

			this.execute = function(frame) {
				throw new Goto(goingTo);
			};
		},
		"if_equal": function(string) {
			var regex = /if(_[a|i]cmp)?eq\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[2], 10);

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 == value2) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_not_equal": function(string) {
			var regex = /if(_[a|i]cmp)?ne\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[2], 10);

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 != value2) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_less_than": function(string) {
			var regex = /if(_icmp)?lt\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[2], 10);

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 < value2) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_less_than_or_equal": function(string) {
			var regex = /if(_icmp)?le\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[2], 10);

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 <= value2) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_greater_than": function(string) {
			var regex = /if(_icmp)?gt\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[2], 10);

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 > value2) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_greater_than_or_equal": function(string) {
			var regex = /if(_icmp)?ge\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[2], 10);

			this.execute = function(frame) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				if(value1 >= value2) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_null": function(string) {
			var regex = /ifnull\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[1], 10);

			this.execute = function(frame) {
				var value = frame.getStack().pop();

				if(value === null) {
					throw new Goto(goingTo);
				}
			};
		},
		"if_non_null": function(string) {
			var regex = /ifnonnull\s+([0-9]+)/;
			var match = string.match(regex);
			var goingTo = parseInt(match[1], 10);

			this.execute = function(frame) {
				var value = frame.getStack().pop();

				if(value !== null) {
					throw new Goto(goingTo);
				}
			};
		},
		"increment": function(string) {
			var regex = /iinc\s+([0-9]+),\s+(-?[0-9]+)/;
			var match = string.match(regex);
			var location = parseInt(match[1], 10);
			var amount = parseInt(match[2], 10);
			
			this.execute = function(frame) {
				var value = frame.getLocalVariables().load(location);

				frame.getStack().push(value + amount);
			};
		},
		"instanceof": function(string) {
			var regex = /\/\/class\s+([a-zA-Z0-9_$\/]+)/;
			var match = string.match(regex);
			var className = match[1].replace(/\//g, ".");

			this.execute = function(frame) {
				var objectRef = frame.getStack().pop();

				frame.getStack().push(objectRef.getClass().getName() == className);
			};
		}
	};

	var operation;

	for(var key in ops_regex) {
		if(line.match(ops_regex[key])) {
			try {
				operation = new operations[key](line);
			} catch(e) {
				console.error(key + " " + e);
			}
			
		}
	}

	if(!operation) {
		throw "Cannot parse bytecode from " + line;
	}

	var _location = line.match(/([0-9]+):/)[1];
	_location = parseInt(_location, 10);

	this.execute = function(frame) {
		return operation.execute(frame);
	};

	this.getLocation = function() {
		return _location;
	};

	this.toString = function() {
		return line;
	};

	this.hasBreakpoint = function() {
		return _breakpoint;
	};

	this.setBreakpoint = function(breakpoint) {
		_breakpoint = breakpoint;
	};
};
