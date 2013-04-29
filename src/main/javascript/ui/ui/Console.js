jjvm.ui.Console = function(element) {
	$(element).find("button#button_console_clear").click(_.bind(function(event) {
		event.preventDefault();
		this.clear();
	}, this));

	var LEVELS = {
		"ERROR": 4,
		"WARN": 3,
		"INFO": 2,
		"DEBUG": 1
	};

	if(!window.localStorage.jvm_log_level) {
		window.localStorage.jvm_log_level = LEVELS.INFO;
	}

	$(element).find("a#button_console_set_error").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.ERROR;
	}, this));

	$(element).find("a#button_console_set_warn").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.WARN;
	}, this));

	$(element).find("a#button_console_set_info").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.INFO;
	}, this));

	$(element).find("a#button_console_set_debug").click(_.bind(function(event) {
		event.preventDefault();
		window.localStorage.jvm_log_level = LEVELS.DEBUG;
	}, this));

	this.debug = function(message) {
		jjvm.console.debug(message);
		this._addLogLine(message, "muted", "icon-wrench", 1);
	};

	this.info = function(message) {
		jjvm.console.info(message);
		this._addLogLine(message, "text-info", "icon-info-sign", 2);
	};

	this.warn = function(message) {
		jjvm.console.warn(message);
		this._addLogLine(message, "text-warning", "icon-exclamation-sign", 3);
	};

	this.error = function(message) {
		jjvm.console.error(message);
		this._addLogLine(message, "text-error", "icon-remove-sign", 4);
	};

	this.clear = function() {
		$(element).find("ul").empty();
	};

	this._addLogLine = function(message, cssClass, iconClass, level) {
		if(level < window.localStorage.jvm_log_level) {
			return;
		}

		var icon = document.createElement("i");
		icon.className = "icon-white " + iconClass;

		var logLine = document.createElement("li");
		logLine.className = cssClass;
		logLine.appendChild(icon);
		logLine.appendChild(document.createTextNode(" " + message));

		$(element).find("ul#console_area").append(logLine);

		$(element).scrollTop($(element)[0].scrollHeight);
	};
};
