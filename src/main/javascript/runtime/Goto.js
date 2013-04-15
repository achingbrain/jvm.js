jjvm.runtime.Goto = function(offset) {
	this.getLocation = function() {
		return offset;
	};
};
