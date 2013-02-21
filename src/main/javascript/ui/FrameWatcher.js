FrameWatcher = function(localVariableTable, stackTable, title) {
	
	this._update = function(frame) {
		this._updateLocalVariableTable(frame.getLocalVariables().getLocalVariables());
		this._updateStackTable(frame.getStack().getStack());

		$(title).empty();
		$(title).append(frame.getClassDef().getName() + "#" + frame.getMethodDef().getName());
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

	NotificationCentre.register("onInstructionExecution", _.bind(function(frame, instruction) {
		this._update(frame.getThread().getCurrentFrame());
	}, this));
	NotificationCentre.register("onCurrentFrameChanged", _.bind(function(thread, frame) {
		this._update(thread.getCurrentFrame());
	}, this));
};
