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
			mnemonic: "fconst_2",
			operation: "push",
			args: [2.0]
		},
		0x0E: {
			mnemonic: "dconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0F: {
			mnemonic: "dconst_1",
			operation: "push",
			args: [1.0]
		},
		0x10: {
			mnemonic: "bipush",
			operation: "push",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0x11: {
			mnemonic: "sipush",
			operation: "push",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0x12: {
			mnemonic: "ldc",
			operation: "push",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x13: {
			mnemonic: "ldc_w",
			operation: "push",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				// should return String, int or float
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x14: {
			mnemonic: "ldc2_w",
			operation: "push",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				// should return double or long
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x15: {
			mnemonic: "iload",
			operation: "load",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x16: {
			mnemonic: "lload",
			operation: "load",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x17: {
			mnemonic: "fload",
			operation: "load",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x18: {
			mnemonic: "dload",
			operation: "load",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [constantPool.load(args.index).getValue()];
			}
		},
		0x19: {
			mnemonic: "aload",
			operation: "load",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [constantPool.load(args.index).getValue()];
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
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0x37: {
			mnemonic: "lstore",
			operation: "store",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0x38: {
			mnemonic: "fstore",
			operation: "store",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0x39: {
			mnemonic: "dstore",
			operation: "store",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0x3A: {
			mnemonic: "dstore",
			operation: "store",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
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
			pre_args: function(iterator) {
				return {
					index: iterator.readU8(),
					value: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index, args.value];
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
			operation: "if_equal_to_zero",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0x9A: {
			mnemonic: "ifne",
			operation: "if_not_equal_to_zero",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0x9B: {
			mnemonic: "iflt",
			operation: "if_less_than_zero",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0x9C: {
			mnemonic: "ifge",
			operation: "if_greater_than_or_equal_to_zero",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0x9D: {
			mnemonic: "ifgt",
			operation: "if_greater_than_zero",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0x9E: {
			mnemonic: "ifle",
			operation: "if_less_than_or_equal_to_zero",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0x9F: {
			mnemonic: "if_icmpeq",
			operation: "if_equal",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA0: {
			mnemonic: "if_icmpne",
			operation: "if_not_equal",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA1: {
			mnemonic: "if_icmplt",
			operation: "if_less_than",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA2: {
			mnemonic: "if_icmpge",
			operation: "if_greater_than_or_equal",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA3: {
			mnemonic: "if_icmpgt",
			operation: "if_greater_than",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA4: {
			mnemonic: "if_icmple",
			operation: "if_less_than_or_equal",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA5: {
			mnemonic: "if_acmpeq",
			operation: "if_equal",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA6: {
			mnemonic: "if_acmpne",
			operation: "if_not_equal",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA7: {
			mnemonic: "goto",
			operation: "goto",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA8: {
			mnemonic: "jsr",
			operation: "jsr",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xA9: {
			mnemonic: "ret",
			operation: "ret",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xAA: {
			mnemonic: "tableswitch",
			operation: "tableswitch",
			pre_args: function(iterator) {
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

				return {
					low: low,
					high: high,
					table: table
				};
			},
			args: function(args, constantPool) {
				return [args.low, args.high, args.table];
			}
		},
		0xAB: {
			mnemonic: "lookupswitch",
			operation: "lookupswitch",
			pre_args: function(iterator) {
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

				return {
					table: table
				};
			},
			args: function(args, constantPool) {
				return [args.table];
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
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB3: {
			mnemonic: "putstatic",
			operation: "put_static",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB4: {
			mnemonic: "getfield",
			operation: "get_field",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB5: {
			mnemonic: "putfield",
			operation: "put_field",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB6: {
			mnemonic: "invokevirtual",
			operation: "invoke_virtual",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB7: {
			mnemonic: "invokespecial",
			operation: "invoke_special",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB8: {
			mnemonic: "invokestatic",
			operation: "invoke_static",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xB9: {
			mnemonic: "invokeinterface",
			operation: "invoke_interface",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16(),
					count: iterator.readU8(),
					_: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index, args.count, args._];
			}
		},
		0xBA: {
			mnemonic: "invokedynamic",
			operation: "invoke_dynamic",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xBB: {
			mnemonic: "new",
			operation: "new",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xBC: {
			mnemonic: "newarray",
			operation: "array_create",
			pre_args: function(iterator) {
				return {
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xBD: {
			mnemonic: "anewarray",
			operation: "array_create",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
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
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
			}
		},
		0xC1: {
			mnemonic: "instanceof",
			operation: "instance_of",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.index];
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
			pre_args: function(iterator) {
				return {
					opcode: iterator.readU8(),
					index: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.opcode, args.index];
			}
		},
		0xC5: {
			mnemonic: "multianewarray",
			operation: "multi_dimensional_array_create",
			pre_args: function(iterator) {
				return {
					index: iterator.readU16(),
					dimensions: iterator.readU8()
				};
			},
			args: function(args, constantPool) {
				return [args.index, args.dimensions];
			}
		},
		0xC6: {
			mnemonic: "ifnull",
			operation: "if_null",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xC7: {
			mnemonic: "ifnonnull",
			operation: "if_non_null",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU16()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xC8: {
			mnemonic: "goto_w",
			operation: "goto",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU32()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
			}
		},
		0xC9: {
			mnemonic: "jsr_w",
			operation: "jsr",
			pre_args: function(iterator) {
				return {
					jumpto: iterator.readU32()
				};
			},
			args: function(args, constantPool) {
				return [args.jumpto];
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

	this._createArgFunction = function(code, args, constantPool) {
		return function() {
			return _bytecode_mapping[code].args(args, constantPool);
		};
	};

	this._createArgFunction2 = function(code) {
		return function() {
			return _bytecode_mapping[code].args;
		};
	};

	this.parse = function(iterator, constantPool) {
		var instructions = [];

		while(iterator.hasNext()) {
			var location = iterator.getLocation();
			var code = iterator.readU8();

			if(_bytecode_mapping[code]) {
				var args = {};
				if(_bytecode_mapping[code].pre_args instanceof Function) {
					// read any values from the iterator as necessary
					args = _bytecode_mapping[code].pre_args(iterator);
				}

				instructions.push(new jjvm.types.ByteCode(
					_bytecode_mapping[code].mnemonic, 
					_bytecode_mapping[code].operation, 
					_bytecode_mapping[code].args instanceof Function ? 
					this._createArgFunction(code, args, constantPool) : 
					this._createArgFunction2(code),
					location,
					constantPool)
				);
			} else {
				throw "Cannot map bytecode 0x" + (code < 16 ? "0" : "") + code.toString(16);
			}
		}

		return instructions;
	};

	this.toString = function() {
		return "ByteCodeParser";
	};
};
