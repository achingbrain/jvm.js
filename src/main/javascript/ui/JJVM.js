jjvm = {
	_compiler: new Compiler(),
	_console: null,
	_frameWatcher: null,
	_classOutliner: null,
	_threadWatcher: null,

	init: function() {
		// no compilation while we do setup
		$("#button_compile").attr("disabled", true);

		// set up gui
		jjvm._console = new Console("#console");
		jjvm._frameWatcher = new FrameWatcher("#localVariables", "#stack", "#frame h3 small"),
		jjvm._classOutliner = new ClassOutliner("#classes"),
		jjvm._threadWatcher = new ThreadWatcher("#threads > ul"),

		jjvm._showCompile();

		// initialy disabled debug buttons
		$("#button_resume").attr("disabled", true);
		$("#button_pause").attr("disabled", true);
		$("#button_step_over").attr("disabled", true);
		$("#button_drop_to_frame").attr("disabled", true);

		// set up debug button listeners
		$("#button_resume").click(function() {
			jjvm._threadWatcher.getSelectedThread().dispatch("onResumeExecution");
		});
		$("#button_pause").click(function() {
			jjvm._threadWatcher.getSelectedThread().dispatch("onSuspendExecution");
		});
		$("#button_step_over").click(function() {
			jjvm._threadWatcher.getSelectedThread().dispatch("onStepOver");
		});
		$("#button_drop_to_frame").click(function() {
			jjvm._threadWatcher.getSelectedThread().dispatch("onDropToFrame");
		});

		$("#button_back").click(jjvm._showCompile);

		// enable compile and run buttons when we have source code
		$("#source").bind("keyup", function() {
			if($("#source").val()) {
				$("#button_compile").removeAttr("disabled");
			} else {
				$("#button_compile").attr("disabled", true);
			}
		});

		// set up button listeners
		$("#button_compile").click(jjvm.compile);
		
		$("#button_run").removeAttr("disabled");
		$("#button_run").click(jjvm.run);

		NotificationCentre.register("onCompileSuccess", function() {
			jjvm._console.info("Compilation complete");
			jjvm._showRun();
		});

		NotificationCentre.register("onCompileError", function(sender, error) {
			jjvm._console.error("Compilation error!");
			jjvm._console.error(error);
		});

		NotificationCentre.register("onBreakpointEncountered", function() {
			$("#button_run").attr("disabled", true);
			$("#button_resume").removeAttr("disabled");
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").removeAttr("disabled");
			$("#button_drop_to_frame").removeAttr("disabled");
		});

		NotificationCentre.register("onExecutionComplete", function() {
			// reset buttons
			$("#button_run").removeAttr("disabled");
			$("#button_resume").attr("disabled", true);
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);

			jjvm._console.info("Done");
		});

		// all done, enable input
		$("#source").removeAttr("disabled");

		// if we've already got input, enable the compile button
		if($("#source").val()) {
			$("#button_compile").removeAttr("disabled");
		}
	},

	_showCompile: function() {
		$("#program_define").show();
		$("#program_run").hide();
		$("#threads").hide();
		$("#frame").hide();
		$("#console").addClass("compile");
		$("#console").removeClass("run");
	},

	_showRun: function() {
		$("#program_define").hide();
		$("#program_run").show();
		$("#threads").show();
		$("#frame").show();
		$("#console").addClass("run");
		$("#console").removeClass("compile");
	},

	compile: function(event) {
		event.preventDefault();

		jjvm._compiler.compile($("#source").val());
	},

	run: function(event) {
		event.preventDefault();

		// find something to execute
		var mainClass;
		var mainMethod;

		$.each(ClassLoader.getClassDefinitions(), function(index, classDef) {
			$.each(classDef.getMethods(), function(index, methodDef) {
				if(methodDef.getName() == "main" && methodDef.isStatic() && methodDef.getReturns() == "void") {
					mainClass = classDef;
					mainMethod = methodDef;
				}
			});
		});

		if(!mainMethod) {
			// nothing to execute, abort!
			jjvm._console.warn("No main method present.");

			return;
		}

		// parse program arguments
		var args = $("#program_run input").val().split(",");

		$.each(args, function(index, arg) {
			args[index] = _.str.trim(arg);
		});

		args = [null, args];

		$("#button_run").attr("disabled", true);
		$("#button_resume").attr("disabled", true);
		$("#button_pause").removeAttr("disabled");
		$("#button_step_over").attr("disabled", true);
		$("#button_drop_to_frame").attr("disabled", true);

		try {
			jjvm._console.info("Executing...");
			var thread = new Thread(new Frame(mainClass, mainMethod, args));
			thread.register("onExecutionComplete", function() {
				thread.deRegister("onExecutionComplete", this);

				$("#button_run").removeAttr("disabled");
				$("#button_resume").removeAttr("disabled");
				$("#button_pause").attr("disabled", true);
				$("#button_step_over").removeAttr("disabled");
				$("#button_drop_to_frame").removeAttr("disabled");

				ThreadPool.reap();
			});
			jjvm._threadWatcher.setSelectedThread(thread);
			thread.run();
		} catch(error) {
			jjvm._console.error(error);
		}
	}
};