jjvm.ui.ClassOutliner = function(element) {
	var _userList = $(element).find("ul.user").get(0);
	var _systemList = $(element).find("ul.system").get(0);
	var _listElements = [];

	this._onExecutionComplete = function() {
		$(_userList).find("li").removeClass("executing");
		$(_systemList).find("li").removeClass("executing");
	};

	this._onBeforeInstructionExecution = function(frame, instruction) {
		if(frame.isSystemFrame()) {
			return;
		}

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

	this._buildClassList = function(sender, classDef, isSystemClass) {
		//$(_userList).empty();
		//$(_systemList).empty();
		//_listElements = [];

		if(isSystemClass) {
			this._buildClassOutline(classDef, _systemList, false);
		} else {
			this._buildClassOutline(classDef, _userList, true);
		}
/*
		$.each(jjvm.core.ClassLoader.getClassDefinitions(), _.bind(function(index, classDef) {
			this._buildClassOutline(classDef, _userList, true);
		}, this));

		$.each(jjvm.core.SystemClassLoader.getClassDefinitions(), _.bind(function(index, classDef) {
			this._buildClassOutline(classDef, _systemList, false);
		}, this));*/
	};

	this._buildClassOutline = function(classDef, list, startExpanded) {
		var innerList = jjvm.core.DOMUtil.create("ul");

		$.each(classDef.getFields(), _.bind(function(index, fieldDef) {
			var cssClass = "field " + fieldDef.getVisibility() + (index === 0 ? " first" : "");
			var iconClass = "icon-white ";

			if(fieldDef.getVisibility() == "public") {
				iconClass += "icon-plus";
			} else if(fieldDef.getVisibility() == "private") {
				iconClass += "icon-minus";
			} else if(fieldDef.getVisibility() == "protected") {
				iconClass += "icon-asterisk";
			}

			innerList.appendChild(jjvm.core.DOMUtil.create("li", [
				jjvm.core.DOMUtil.create("icon", {className: iconClass}),
				" ", 
				this._formatVisibility(fieldDef.getVisibility()),
				" ",
				this._formatType(fieldDef.getType()),
				" ",
				(fieldDef.isStatic() ? this._formatKeyword("static") : ""),
				" ",
				(fieldDef.isFinal() ? this._formatKeyword("final") : ""),
				" ",
				fieldDef.getName()
			]));
		}, this));

		$.each(classDef.getMethods(), _.bind(function(index, methodDef) {
			var cssClass = "method " + methodDef.getVisibility() + (index === 0 ? " first" : "");
			var iconClass = "icon-white ";

			if(methodDef.getVisibility() == "public") {
				iconClass += "icon-plus";
			} else if(methodDef.getVisibility() == "private") {
				iconClass += "icon-minus";
			} else if(methodDef.getVisibility() == "protected") {
				iconClass += "icon-asterisk";
			}

			var method = jjvm.core.DOMUtil.create("li", [
				jjvm.core.DOMUtil.create("icon", {className: iconClass}),
				" ", 
				this._formatVisibility(methodDef.getVisibility()),
				" ",
				(methodDef.isStatic() ? this._formatKeyword("static") : ""),
				" ",
				(methodDef.isFinal() ? this._formatKeyword("final") : ""),
				" ", 
				(methodDef.isSynchronized() ? this._formatKeyword("synchronized") : ""),
				" ",
				this._formatType(methodDef.getReturns()),
				" ",
				methodDef.getName(),
				"(",
				this._formatTypes(methodDef.getArgs()),
				")"
			]);

			innerList.appendChild(method);

			var instructionList = jjvm.core.DOMUtil.create("ul", {className: "instruction_list"});
			method.appendChild(instructionList);

			if(methodDef.getImplementation()) {
				jjvm.core.DOMUtil.append(jjvm.core.DOMUtil.create("li", "Native code", {className: "muted"}), instructionList);
			} else if(methodDef.getInstructions()) {
				$.each(methodDef.getInstructions(), function(index, instruction) {
					var checkbox = jjvm.core.DOMUtil.create("input", {
						type: "checkbox",
						checked: instruction.hasBreakpoint(),
						onChange: function() {
							instruction.setBreakpoint(this.value);
						}
					});

					var listItem = jjvm.core.DOMUtil.create("li", [
						checkbox,
						" ",
						instruction.getLocation().toString(),
						": ",
						instruction.toString()
					]);

					_listElements.push({listItem: listItem, instruction: instruction});

					instructionList.appendChild(listItem);
				});
			} else if(!classDef.isInterface()) {
				jjvm.core.DOMUtil.append(jjvm.core.DOMUtil.create("li", "Missing"), instructionList);
			}
		}, this));

		var link = jjvm.core.DOMUtil.create("a", [
			(classDef.getVisibility() == "public" ? this._formatKeyword("public") : ""),
			" ",
			(classDef.isAbstract() ? this._formatKeyword("abstract") : ""),
			" ",
			(classDef.isFinal() ? this._formatKeyword("final") : ""),
			" ",
			(classDef.isInterface() ? this._formatKeyword("interface") : this._formatKeyword("class")),
			" ",
			classDef.getName(),
			(classDef.getParent() ? [
				" ", this._formatKeyword("extends"), " ", classDef.getParent().getName()
			] : ""),
			(classDef.getInterfaces().length > 0 ? [
				" ", this._formatKeyword("implements"), " ", this._formatInterfaces(classDef)
			] : "")
		]);

		var classInfo = "";

		if(classDef.getSourceFile()) {
			classInfo = jjvm.core.DOMUtil.create("small", [
				classDef.getSourceFile(), " / ", classDef.getVersion()
			], {className: "muted"});
		}

		$(link).click(function(event) {
			event.preventDefault();
			innerList.style.display = innerList.style.display == "none" ? "block" : "none";
		});

		var listHolder = jjvm.core.DOMUtil.create("li", [
			classInfo,
			link,
			innerList
		]);

		if(!startExpanded) {
			innerList.style.display = "none";
		}

		list.appendChild(listHolder);
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

		return jjvm.core.DOMUtil.create("span", visibility, {className: cssClass});
	};

	this._formatKeyword = function(keyword) {
		return jjvm.core.DOMUtil.create("span", keyword, {className: "text-warning"});
	};

	this._formatType = function(type) {
		return jjvm.core.DOMUtil.create("span", type, {className: "text-info"});
	};

	this._formatTypes = function(types) {
		var output = [];

		$.each(types, _.bind(function(index, type) {
			output.push(this._formatType(type));

			if(index < (types.length - 1)) {
				output.push(", ");
			}
		}, this));

		return output;
	};

	this._formatInterfaces = function(classDef) {
		var output = [];

		for(var i = 0; i < classDef.getInterfaces().length; i++) {
			output.push(classDef.getInterfaces()[i].getClassDef().getName());
		}

		return output.join(", ");
	};

	jjvm.core.NotificationCentre.register("onClassDefined", _.bind(this._buildClassList, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._onBeforeInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._onExecutionComplete, this));
};
