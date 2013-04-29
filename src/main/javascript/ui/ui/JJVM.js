jjvm.ui.JJVM = {
	console: null,
	_frameWatcher: null,
	_classOutliner: null,
	_threadWatcher: null,
	_classDropper: null,
	jvm: null,

	init: function() {
		// no compilation while we do setup
		$("#button_compile").attr("disabled", true);

		jjvm.ui.JJVM.jvm = new jjvm.ui.JVM();

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
		$("#button_step_into").attr("disabled", true);
		$("#button_step_out").attr("disabled", true);
		$("#button_drop_to_frame").attr("disabled", true);

		// set up debug button listeners
		$("#button_resume").click(function() {
			jjvm.ui.JJVM.jvm.resumeExecution(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_pause").click(function() {
			jjvm.ui.JJVM.jvm.suspendExecution(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_over").click(function() {
			jjvm.ui.JJVM.jvm.stepOver(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_into").click(function() {
			jjvm.ui.JJVM.jvm.stepInto(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_out").click(function() {
			jjvm.ui.JJVM.jvm.stepOut(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_drop_to_frame").click(function() {
			jjvm.ui.JJVM.jvm.dropToFrame(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
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
			if(window.webkitNotifications && window.webkitNotifications.checkPermission() === 0) {
				var notification = window.webkitNotifications.createNotification("icon.png", "JJVM", "Compilation complete");
				notification.show();
			}
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
			$("#button_step_into").removeAttr("disabled");
			$("#button_step_out").removeAttr("disabled");
			$("#button_drop_to_frame").removeAttr("disabled");
		});

		jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
			// reset buttons
			$("#button_run").removeAttr("disabled");
			$("#button_resume").attr("disabled", true);
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").attr("disabled", true);
			$("#button_step_into").attr("disabled", true);
			$("#button_step_out").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);
		});

		jjvm.core.NotificationCentre.register("onExecutionStarted", function() {
			$("#button_run").attr("disabled", true);
			$("#button_resume").attr("disabled", true);
			$("#button_pause").removeAttr("disabled");
			$("#button_step_over").attr("disabled", true);
			$("#button_step_into").attr("disabled", true);
			$("#button_step_out").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);
		});

		// all done, enable input
		$("#source").removeAttr("disabled");

		// if we've already got input, enable the compile button
		if($("#source").val()) {
			$("#button_compile").removeAttr("disabled");
		}

		// html5 notifications!
		if(window.webkitNotifications) {
			var permissions = window.webkitNotifications.checkPermission();

			if(permissions === 0) {
				// granted
			} else if(permissions === 1) {
				// not yet granted
				window.webkitNotifications.requestPermission();
			} else if(permissions === 2) {
				// blocked
			}
		}
	},

	run: function(event) {
		event.preventDefault();

		jjvm.ui.JJVM.jvm.run([$("#program_run input").val().split(",")]);
	}
};