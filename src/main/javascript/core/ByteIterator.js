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