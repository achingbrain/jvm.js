// Jshint complains if we don't use this.console, Chrome complains if we
// don't use this["console"].  Chrome wins.
var c = "con" + "sole";

// if there's a console, use it, otherwise pass it back to the main thread
jjvm.console = this[c] ? this[c] : {
	debug: function(string) {
		self.postMessage({
			action: "consoleDebug",
			args: JSON.stringify([string])
		});
	},

	info: function(string) {
		self.postMessage({
			action: "consoleInfo",
			args: JSON.stringify([string])
		});
	},

	warn: function(string) {
		self.postMessage({
			action: "consoleWarn",
			args: JSON.stringify([string])
		});
	},

	error: function(string) {
		if(string.stack) {
			_.each(string.stack.split("\n"), function(line) {
				self.postMessage({
					action: "consoleError",
					args: JSON.stringify([line])
				});
			});
		} else if(_.isString(string)) {
			self.postMessage({
				action: "consoleError",
				args: JSON.stringify([string])
			});
		}
	}
};