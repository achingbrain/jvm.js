jjvm.ui.FrameWatcher = function(localVariableTable, stackTable, title) {
	
	this._update = function(frame) {
		if(frame.isSystemFrame) {
			return;
		}

		this._updateLocalVariableTable(frame.localVariables);
		this._updateStackTable(frame.stack);

		$(title).empty();
		$(title).append(_.escape(frame.className + "#" + frame.methodSignature));
	};

	this._updateLocalVariableTable = function(localVariables) {
		$(localVariableTable).empty();
		var topRow = $("<tr></tr>");
		var bottomRow = $("<tr></tr>");
		var thead = $("<thead></thead>");
		$(thead).append(topRow);
		var tbody = $("<tbody></tbody>");
		$(tbody).append(bottomRow);
		$(localVariableTable).append(thead);
		$(localVariableTable).append(tbody);

		$.each(localVariables, function(index, entry) {
			$(topRow).append("<th>" + index + "</th>");
			$(bottomRow).append("<td>" + entry + "</td>");
		});
	};

	this._updateStackTable = function(stack) {
		$(stackTable).empty();
		
		var tbody = $("<tbody></tbody>");
		$(stackTable).append(tbody);

		var minItems = 5 - stack.length;

		for(var i = 0; i < minItems; i++) {
			$(tbody).append("<tr><td>&nbsp;</td></tr>");
		}

		for(var n = (stack.length -1); n >= 0; n--) {
			$(tbody).append("<tr><td>" + stack[n] + "</td></tr>");
		}
	};

	jjvm.core.NotificationCentre.register("onInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onAfterInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onCurrentFrameChanged", _.bind(function(_, thread, frame) {
		this._update(frame);
	}, this));
};
