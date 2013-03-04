jjvm.ui.ClassOutliner = function(element) {
	var _userList = $(element).find("ul.user")[0];
	var _systemList = $(element).find("ul.system")[0];
	var _listElements = [];

	this._onExecutionComplete = function() {
		$(_userList).find("li").removeClass("executing");
		$(_systemList).find("li").removeClass("executing");
	};

	this._onBeforeInstructionExecution = function(frame, instruction) {
		for(var i = 0; i < _listElements.length; i++) {
			var item = _listElements[i];

			if(item.instruction == instruction) {
				$(item.listItem).addClass("executing");
				currentInstruction = item.listItem;
			} else {
				$(item.listItem).removeClass("executing");
			}
		}
	};

	this._buildClassList = function(sender) {
		$(_userList).empty();
		$(_systemList).empty();
		_listElements = [];

		$.each(jjvm.core.ClassLoader.getClassDefinitions(), _.bind(function(index, classDef) {
			this._buildClassOutline(classDef, _userList, true);
		}, this));

		$.each(jjvm.core.SystemClassLoader.getClassDefinitions(), _.bind(function(index, classDef) {
			this._buildClassOutline(classDef, _systemList, false);
		}, this));
	};

	this._buildClassOutline = function(classDef, list, startExpanded) {
		var innerList = $("<ul></ul>");

		$.each(classDef.getFields(), _.bind(function(index, fieldDef) {
			var cssClass = "field " + fieldDef.getVisibility() + (index === 0 ? " first" : "");
			var icon = "icon-white ";

			if(fieldDef.getVisibility() == "public") {
				icon += "icon-plus";
			} else if(fieldDef.getVisibility() == "private") {
				icon += "icon-minus";
			} else if(fieldDef.getVisibility() == "protected") {
				icon += "icon-asterisk";
			}

			innerList.append("<li class=\"" + cssClass + "\"><i class=\"" + icon + "\"></i> " + 
				this._formatVisibility(fieldDef.getVisibility()) + " " + 
				this._formatType(fieldDef.getType()) + " " + 
				(fieldDef.isStatic() ? this._formatKeyword("static") : "") + " " + 
				(fieldDef.isFinal() ? this._formatKeyword("final") : "") + " " + 
				fieldDef.getName() + "</li>");
		}, this));

		$.each(classDef.getMethods(), _.bind(function(index, methodDef) {
			var cssClass = "method " + methodDef.getVisibility() + (index === 0 ? " first" : "");
			var icon = "icon-white ";

			if(methodDef.getVisibility() == "public") {
				icon += "icon-plus";
			} else if(methodDef.getVisibility() == "private") {
				icon += "icon-minus";
			} else if(methodDef.getVisibility() == "protected") {
				icon += "icon-asterisk";
			}

			var method = innerList.append("<li class=\"" + cssClass + "\"><i class=\"" + icon + "\"></i> " + 
				this._formatVisibility(methodDef.getVisibility()) + " " + 
				(methodDef.isStatic() ? this._formatKeyword("static") : "") + " " + 
				(methodDef.isFinal() ? this._formatKeyword("final") : "") + " " + 
				(methodDef.isSynchronized() ? this._formatKeyword("synchronized") : "") + " " + 
				this._formatType(methodDef.getReturns()) + " " + 
				_.escape(methodDef.getName()) + "(" + 
				this._formatTypes(methodDef.getArgs()) + ")</li>");
			var instructionList = $("<ul class=\"instruction_list\"></ul>");
			$(method).append(instructionList);

			if(methodDef.getImplementation()) {
				$(instructionList).append("<li>Native code</li>");
			} else if(methodDef.getInstructions()) {
				$.each(methodDef.getInstructions(), function(index, instruction) {
					var checkbox = $("<input type=\"checkbox\"/>");
					$(checkbox).attr("checked", instruction.hasBreakpoint());
					$(checkbox).change(function() {
						instruction.setBreakpoint($(checkbox).is(':checked'));
					});

					var listItem = $("<li></li>");
					$(listItem).append(checkbox);
					$(listItem).append(" " + _.escape(instruction.toString()));

					_listElements.push({listItem: listItem, instruction: instruction});

					$(instructionList).append(listItem);
				});
			} else {
				$(instructionList).append("<li>Missing</li>");
			}
		}, this));

		var link = $("<a>" + classDef.getName() + "</a>");

		if(classDef.getSourceFile()) {
			$(link).prepend("<small class=\"muted\">" + classDef.getSourceFile() + " / " + classDef.getVersion() + "</small>");
		}

		$(link).click(function(event) {
			event.preventDefault();
			innerList.toggle();
		});

		var listHolder = $("<li></li>");
		listHolder.append(link);
		listHolder.append(innerList);

		if(!startExpanded) {
			$(innerList).css("display", "none");
		}

		$(list).append(listHolder);
	};

	this._formatVisibility = function(visibility) {
		var cssClass;

		if(visibility == "public") {
			cssClass = "text-success";
		} else if(visibility == "protected") {
			cssClass = "text-warning";
		} else {
			cssClass = "text-error";
		}

		return "<span class=\"" + cssClass + "\">" + visibility + "</span>";
	};

	this._formatKeyword = function(keyword) {
		return "<span class=\"text-warning\">" + keyword + "</span>";	
	};

	this._formatType = function(type) {
		return "<span class=\"text-info\">" + type + "</span>";
	};

	this._formatTypes = function(types) {
		var output = [];

		$.each(types, _.bind(function(index, type) {
			output.push(this._formatType(type));
		}, this));

		return output.join(", ");
	};

	jjvm.core.NotificationCentre.register("onCompileSuccess", _.bind(this._buildClassList, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._onBeforeInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._onExecutionComplete, this));

	this._buildClassList();
};
