function Iterator(iterable) {
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
}