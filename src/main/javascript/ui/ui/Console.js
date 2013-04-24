jjvm.ui.Console = function(element) {
	$(element).find("button").click(_.bind(function(event) {
		event.preventDefault();
		this.clear();
	}, this));

	this.debug = function(message) {
		console.debug(message);
		this._addLogLine(message, "muted", "icon-wrench");
	};

	this.info = function(message) {
		console.info(message);
		this._addLogLine(message, "text-info", "icon-info-sign");
	};

	this.warn = function(message) {
		console.warn(message);
		this._addLogLine(message, "text-warning", "icon-exclamation-sign");
	};

	this.error = function(message) {
		console.error(message);
		this._addLogLine(message, "text-error", "icon-remove-sign");
	};

	this.clear = function() {
		$(element).find("ul").empty();
	};

	this._addLogLine = function(message, cssClass, iconClass) {
		var icon = document.createElement("i");
		icon.className = "icon-white " + iconClass;

		var logLine = document.createElement("li");
		logLine.className = cssClass;
		logLine.appendChild(icon);
		logLine.appendChild(document.createTextNode(" " + message));

		$(element).find("ul").append(logLine);

		$(element).scrollTop($(element)[0].scrollHeight);
	};
};
