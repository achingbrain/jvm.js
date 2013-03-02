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
		var compiler = new jjvm.compiler.bytecode.Compiler();

		for(var i = 0; i < files.length; i++) {
			compiler.compile(files[i]);
		}
	};

	$(element).on("dragenter", _.bind(this.onDragEnter, this));
	$(element).on("dragexit", _.bind(this.onDragExit, this));
	$(element).on("dragover", _.bind(this.onDragOver, this));
	$(element).on("drop", _.bind(this.onDrop, this));
};
