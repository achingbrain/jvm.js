console = {
	debug: function(string) {
		self.postMessage({
			action: "consoleDebug",
			args: JSON.stringify([string])
		});
	},

	info: function(string) {
		self.postMessage({
			action: "consoleInfo",
			args: JSON.stringify([string])
		});
	},

	warn: function(string) {
		self.postMessage({
			action: "consoleWarn",
			args: JSON.stringify([string])
		});
	},

	error: function(string) {
		if(string.stack) {
			_.each(string.stack.split("\n"), function(line) {
				self.postMessage({
					action: "consoleError",
					args: JSON.stringify([line])
				});
			});
		} else if(_.isString(string)) {
			self.postMessage({
				action: "consoleError",
				args: JSON.stringify([string])
			});
		}
	}
};

self.addEventListener("message", function(event) {
	var actions = {
		"compile": function(bytes, isSystemClass) {
			var compiler = new jjvm.compiler.Compiler();
			compiler.compileBytes(bytes);
		},
		"run": function(args) {
			// find something to execute
			var mainClass;
			var mainMethod;

			_.each(jjvm.core.ClassLoader.getClassDefinitions(), function(classDef) {
				_.each(classDef.getMethods(), function(methodDef) {
					if(methodDef.getName() == "main" && methodDef.isStatic() && methodDef.getReturns() == "void") {
						mainClass = classDef;
						mainMethod = methodDef;
					}
				});
			});

			if(!mainMethod) {
				// nothing to execute, abort!
				console.warn("No main method present.");

				return;
			}

			var stringArgs = [];

			_.each(args, function(arg) {
				arg = _.str.trim(arg);

				stringArgs.push(jjvm.Util.createStringRef(arg));
			});

			try {
				console.info("Executing...");
				var thread = new jjvm.runtime.Thread(new jjvm.runtime.Frame(mainClass, mainMethod, args));
				thread.register("onExecutionComplete", function() {
					thread.deRegister("onExecutionComplete", this);

					jjvm.runtime.ThreadPool.reap();
				});
				jjvm.core.NotificationCentre.dispatch(this, "onExecutionStarted");

				thread.run();
			} catch(error) {
				console.error(error);
				console.error(error.stack);
			}
		},
		"setBreakpoint": function(className, methodSignature, instructionIndex, setBreakpoint) {
			var classDef = jjvm.core.ClassLoader.loadClass(className);

			_.each(classDef.getMethods(), function(method) {
				if(method.getSignature() == methodSignature) {
					_.each(method.getInstructions(), function(instruction) {
						if(instruction.getLocation() == instructionIndex) {
							instruction.setBreakpoint(setBreakpoint);

							console.debug("Breakpoint " + (setBreakpoint ? "" : "un") + "set in " + className + "#" + methodSignature + " at location " + instructionIndex);
							jjvm.core.NotificationCentre.dispatch(this, "onBreakpointSet", [className, methodSignature, instructionIndex, setBreakpoint]);
						}
					});
				}
			});
		},
		"resumeExecution": function() {
			jjvm.core.NotificationCentre.dispatch(this, "onResumeExecution");
		},
		"suspendExecution": function() {
			jjvm.core.NotificationCentre.dispatch(this, "onSuspendExecution");
		},
		"stepOver": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					thread.dispatch("onStepOver");
				}
			});
		},
		"stepInto": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					thread.dispatch("onStepInto");
				}
			});
		},
		"dropToFrame": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					thread.dispatch("onDropToFrame");
				}
			});
		},
		"getThreads": function() {
			self.postMessage({
				action: "getThreads",
				args: JSON.stringify([jjvm.runtime.ThreadPool.getData()])
			});
		}
	};

	if(actions[event.data.action]) {
		actions[event.data.action].apply(actions[event.data.action], event.data.args);
	} else {
		console.error("Unknown action from main thread " + event.data.action);
	}
}, false);

// set up System.out & System.err
var system = jjvm.core.ClassLoader.loadClass("java.lang.System");
var voidClass = jjvm.core.ClassLoader.loadClass("java.lang.Void");
system.setStaticField("in", new jjvm.runtime.ObjectReference(voidClass));
system.setStaticField("out", new jjvm.runtime.ObjectReference(voidClass));
system.setStaticField("err", new jjvm.runtime.ObjectReference(voidClass));