jjvm.ui.JJVM = {
	console: null,
	_frameWatcher: null,
	_classOutliner: null,
	_threadWatcher: null,
	_classDropper: null,

	init: function() {
		// no compilation while we do setup
		$("#button_compile").attr("disabled", true);

		// set up gui
		jjvm.ui.JJVM.console = new jjvm.ui.Console("#console");
		jjvm.ui.JJVM._frameWatcher = new jjvm.ui.FrameWatcher("#localVariables", "#stack", "#frame h3 small"),
		jjvm.ui.JJVM._classOutliner = new jjvm.ui.ClassOutliner("#classes"),
		jjvm.ui.JJVM._threadWatcher = new jjvm.ui.ThreadWatcher("#threads > ul"),
		jjvm.ui.JJVM._classDropper = new jjvm.ui.ClassDropper("#program_define");

		// initialy disabled debug buttons
		$("#button_resume").attr("disabled", true);
		$("#button_pause").attr("disabled", true);
		$("#button_step_over").attr("disabled", true);
		$("#button_drop_to_frame").attr("disabled", true);

		// set up debug button listeners
		$("#button_resume").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onResumeExecution");
		});
		$("#button_pause").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onSuspendExecution");
		});
		$("#button_step_over").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onStepOver");
		});
		$("#button_drop_to_frame").click(function() {
			jjvm.ui.JJVM._threadWatcher.getSelectedThread().dispatch("onDropToFrame");
		});

		// enable compile and run buttons when we have source code
		$("#source").bind("keyup", function() {
			if($("#source").val()) {
				$("#button_compile").removeAttr("disabled");
			} else {
				$("#button_compile").attr("disabled", true);
			}
		});

		// set up button listeners
		$("#button_run").click(jjvm.ui.JJVM.run);

		jjvm.core.NotificationCentre.register("onCompileSuccess", function() {
			jjvm.ui.JJVM.console.info("Compilation complete");
		});

		jjvm.core.NotificationCentre.register("onCompileError", function(sender, error) {
			jjvm.ui.JJVM.console.error("Compilation error!");
			jjvm.ui.JJVM.console.error(error);
		});

		jjvm.core.NotificationCentre.register("onCompileWarning", function(sender, warning) {
			jjvm.ui.JJVM.console.warn(warning);
		});

		jjvm.core.NotificationCentre.register("onBreakpointEncountered", function() {
			$("#button_run").attr("disabled", true);
			$("#button_resume").removeAttr("disabled");
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").removeAttr("disabled");
			$("#button_drop_to_frame").removeAttr("disabled");
		});

		jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
			// reset buttons
			$("#button_run").removeAttr("disabled");
			$("#button_resume").attr("disabled", true);
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);

			jjvm.ui.JJVM.console.info("Done");
		});

		// all done, enable input
		$("#source").removeAttr("disabled");

		// if we've already got input, enable the compile button
		if($("#source").val()) {
			$("#button_compile").removeAttr("disabled");
		}
	},

	run: function(event) {
		event.preventDefault();

		// find something to execute
		var mainClass;
		var mainMethod;

		$.each(jjvm.core.ClassLoader.getClassDefinitions(), function(index, classDef) {
			$.each(classDef.getMethods(), function(index, methodDef) {
				if(methodDef.getName() == "main" && methodDef.isStatic() && methodDef.getReturns() == "void") {
					mainClass = classDef;
					mainMethod = methodDef;
				}
			});
		});

		if(!mainMethod) {
			// nothing to execute, abort!
			jjvm.ui.JJVM.console.warn("No main method present.");

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
			jjvm.ui.JJVM.console.info("Executing...");
			var thread = new jjvm.runtime.Thread(new jjvm.runtime.Frame(mainClass, mainMethod, args));
			thread.register("onExecutionComplete", function() {
				thread.deRegister("onExecutionComplete", this);

				$("#button_run").removeAttr("disabled");
				$("#button_resume").removeAttr("disabled");
				$("#button_pause").attr("disabled", true);
				$("#button_step_over").removeAttr("disabled");
				$("#button_drop_to_frame").removeAttr("disabled");

				jjvm.runtime.ThreadPool.reap();
			});
			jjvm.ui.JJVM._threadWatcher.setSelectedThread(thread);
			thread.run();
		} catch(error) {
			jjvm.ui.JJVM.console.error(error);
		}
	}
};