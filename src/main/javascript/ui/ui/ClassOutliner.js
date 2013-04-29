jjvm.ui.ClassOutliner = function(element) {
	var _userList = $(element).find("ul.user").get(0);
	var _systemList = $(element).find("ul.system").get(0);
	var _listElements = {};

	this._onExecutionComplete = function() {
		$(_userList).find("li").removeClass("executing");
		$(_systemList).find("li").removeClass("executing");
	};

	this._onBeforeInstructionExecution = function(__, frame) {
		if(frame.isSystemFrame || !frame.isCurrentFrame || !frame.isExecutionSuspended) {
			return;
		}

		this._highlight(frame.className, frame.methodSignature, frame.currentInstruction);
	};

	this._onAfterInstructionExecution = function(__, frame) {
		if(frame.isSystemFrame || !frame.isCurrentFrame || !frame.isExecutionSuspended) {
			return;
		}

		// if there's no next instruction we are returning so don't remove the highlight
		if(frame.nextInstruction) {
			this._highlight(frame.nextInstruction.className, frame.nextInstruction.methodSignature, frame.nextInstruction.instruction);
		}
	};

	this._onBreakpointEncountered = function(__, frame) {
		if(frame.isSystemFrame || !frame.isCurrentFrame || !frame.isExecutionSuspended) {
			return;
		}

		this._highlight(frame.className, frame.methodSignature, frame.currentInstruction);
	};

	this._highlight = function(className, methodSignature, instruction) {
		$(element + " li").removeClass("executing");

		if(!instruction) {
			return;
		}
		
		var listElement = _listElements[className][methodSignature][instruction.location];

		$(listElement).addClass("executing");

		if(_.string.endsWith(instruction.mnemonic, "return")) {
			$(listElement).addClass("return");
		}

		// ensure whatever's highlighted is visible are expanded
		var parent = listElement.parentNode;

		while(parent) {
			if(parent.style && parent.style.display == "none") {
				parent.style.display = "block";
			}

			parent = parent.parentNode;
		}

		// stop previous scroll animation
		$(element).stop(true, false);
		$(element).scrollTo(listElement, 200, {"axis": "y", "offset": -100});
	};

	this._buildClassList = function(sender, classDef, isSystemClass) {
		if(isSystemClass) {
			this._buildClassOutline(classDef, _systemList, false);
		} else {
			this._buildClassOutline(classDef, _userList, true);
		}
	};

	this._buildClassOutline = function(classDef, list, startExpanded) {
		var innerList = jjvm.core.DOMUtil.create("ul");

		this._buildFieldList(innerList, classDef.name, classDef.fields);
		this._buildMethodList(innerList, classDef.name, classDef.methods);

		var link = jjvm.core.DOMUtil.create("a", [
			(classDef.visibility == "public" ? this._formatKeyword("public") : ""),
			" ",
			(classDef.isAbstract ? this._formatKeyword("abstract") : ""),
			" ",
			(classDef.isFinal ? this._formatKeyword("final") : ""),
			" ",
			(classDef.isInterface ? this._formatKeyword("interface") : this._formatKeyword("class")),
			" ",
			classDef.name,
			(classDef.parent ? [
				" ", this._formatKeyword("extends"), " ", classDef.parent
			] : ""),
			(classDef.interfaces.length > 0 ? [
				" ", this._formatKeyword("implements"), " ", this._formatInterfaces(classDef.interfaces)
			] : "")
		]);

		var classInfo = "";

		if(classDef.sourceFile) {
			classInfo = jjvm.core.DOMUtil.create("small", [
				classDef.sourceFile, " / ", this._formatVersion(classDef.majorVersion, classDef.minorVersion)
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

	this._buildFieldList = function(list, className, fields) {
		var index = 0;

		for(var name in fields) {
			var field = fields[name];
			var cssClass = "field " + field.visibility + (index === 0 ? " first" : "");
			var iconClass = "icon-white ";

			if(field.visibility == "public") {
				iconClass += "icon-plus";
			} else if(field.visibility == "private") {
				iconClass += "icon-minus";
			} else if(field.visibility == "protected") {
				iconClass += "icon-asterisk";
			}

			list.appendChild(jjvm.core.DOMUtil.create("li", [
				jjvm.core.DOMUtil.create("icon", {className: iconClass}),
				" ", 
				this._formatVisibility(field.visibility),
				" ",
				this._formatType(field.type),
				" ",
				(field.isStatic ? this._formatKeyword("static") : ""),
				" ",
				(field.isFinal ? this._formatKeyword("final") : ""),
				" ",
				field.name
			]));

			index++;
		}
	};

	this._buildMethodList = function(list, className, methods) {
		var index = 0;

		for(var name in methods) {
			var method = methods[name];
			var cssClass = "method " + method.visibility + (index === 0 ? " first" : "");
			var iconClass = "icon-white ";

			if(method.visibility == "public") {
				iconClass += "icon-plus";
			} else if(method.visibility == "private") {
				iconClass += "icon-minus";
			} else if(method.visibility == "protected") {
				iconClass += "icon-asterisk";
			}

			var methodSignature = jjvm.core.DOMUtil.create("li", [
				jjvm.core.DOMUtil.create("icon", {className: iconClass}),
				" ", 
				this._formatVisibility(method.visibility),
				" ",
				(method.isStatic ? this._formatKeyword("static") : ""),
				" ",
				(method.isFinal ? this._formatKeyword("final") : ""),
				" ", 
				(method.isSynchronized ? this._formatKeyword("synchronized") : ""),
				" ",
				this._formatType(method.returns),
				" ",
				method.name,
				"(",
				this._formatTypes(method.args),
				")"
			]);

			list.appendChild(methodSignature);

			var instructionList = jjvm.core.DOMUtil.create("ul", {className: "instruction_list"});
			methodSignature.appendChild(instructionList);

			if(method.isNative) {
				jjvm.core.DOMUtil.append(jjvm.core.DOMUtil.create("li", "Native code", {className: "muted"}), instructionList);
			} else if(method.instructions.length > 0) {
				for(var i = 0; i < method.instructions.length; i++) {
					var instruction = method.instructions[i];
					var checkbox = jjvm.core.DOMUtil.create("input", {
						type: "checkbox",
						onchange: this._getBreakpointCallback(className, method.signature, instruction)
					});

					var listItem = jjvm.core.DOMUtil.create("li", [
						checkbox,
						" ",
						instruction.location + ": " + instruction.description
					]);

					if(!_listElements[className]) {
						_listElements[className] = {};
					}

					if(!_listElements[className][method.signature]) {
						_listElements[className][method.signature] = [];
					}

					_listElements[className][method.signature][instruction.location] = listItem;

					instructionList.appendChild(listItem);
				}
			} else if(!method.isAbstract) {
				jjvm.core.DOMUtil.append(jjvm.core.DOMUtil.create("li", "Missing"), instructionList);
			}

			index++;
		}
	};

	this._getBreakpointCallback = function(className, methodSignature, instruction) {
		return function() {
			jjvm.ui.JJVM.jvm.setBreakpoint(className, methodSignature, instruction.location, this.checked);
		};
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

	this._formatInterfaces = function(interfaces) {
		var output = [];

		for(var i = 0; i < interfaces.length; i++) {
			output.push(interfaces[i]);
		}

		return output.join(", ");
	};

	this._formatVersion = function(majorVersion, minorVersion) {
		var versions = {
			0x2D: "Java 1.1",
			0x2E: "Java 1.2",
			0x2F: "Java 1.3",
			0x30: "Java 1.4",
			0x31: "Java 5",
			0x32: "Java 6",
			0x33: "Java 7",
			0x34: "Java 8"
		};

		return versions[majorVersion];
	};

	jjvm.core.NotificationCentre.register("onClassDefined", _.bind(this._buildClassList, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(this._onBeforeInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onAfterInstructionExecution", _.bind(this._onAfterInstructionExecution, this));
	jjvm.core.NotificationCentre.register("onBreakpointEncountered", _.bind(this._onBreakpointEncountered, this));
	jjvm.core.NotificationCentre.register("onExecutionComplete", _.bind(this._onExecutionComplete, this));
};
