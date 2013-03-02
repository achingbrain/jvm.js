jjvm.core.ByteIterator = function(iterable) {
	_.extend(this, new jjvm.core.Iterator(iterable));

	this.readU8 = function() {
		return this.next();
	};

	this.readU16 = function() {
		// Under 32 bits so can use bitwise operators
		return (this.readU8() << 8) | this.readU8();
	};

	this.readU32 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU8() * Math.pow(2, 24)) + (this.readU8() * Math.pow(2, 16)) + this.readU16();
	};

	this.readU64 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU8() * Math.pow(2, 56)) + (this.readU8() * Math.pow(2, 48)) + (this.readU8() * Math.pow(2, 40)) + (this.readU8() * Math.pow(2, 32)) + this.readU32();
	};
};