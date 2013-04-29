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
				jjvm.console.warn("No main method present.");

				return;
			}

			var stringArgs = [];

			_.each(args, function(arg) {
				arg = _.str.trim(arg);

				stringArgs.push(jjvm.Util.createStringRef(arg));
			});

			try {
				jjvm.console.info("Executing...");
				var thread = new jjvm.runtime.Thread(new jjvm.runtime.Frame(mainClass, mainMethod, args));
				thread.registerOneTimeListener("onExecutionComplete", function() {
					jjvm.runtime.ThreadPool.reap();
				});
				jjvm.core.NotificationCentre.dispatch(this, "onExecutionStarted");

				thread.run();
			} catch(error) {
				jjvm.console.error(error);
				jjvm.console.error(error.stack);
			}
		},
		"setBreakpoint": function(className, methodSignature, instructionIndex, setBreakpoint) {
			var classDef = jjvm.core.ClassLoader.loadClass(className);

			_.each(classDef.getMethods(), function(method) {
				if(method.getSignature() == methodSignature) {
					_.each(method.getInstructions(), function(instruction) {
						if(instruction.getLocation() == instructionIndex) {
							instruction.setBreakpoint(setBreakpoint);

							jjvm.console.debug("Breakpoint " + (setBreakpoint ? "" : "un") + "set in " + className + "#" + methodSignature + " at location " + instructionIndex);
							jjvm.core.NotificationCentre.dispatch(this, "onBreakpointSet", [className, methodSignature, instructionIndex, setBreakpoint]);
						}
					});
				}
			});
		},
		"resumeExecution": function(threadName) {
			//jjvm.core.NotificationCentre.dispatch(this, "onResumeExecution");
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					//thread.dispatch("onResumeExecution");
					thread.resumeExecution();
				}
			});
		},
		"suspendExecution": function(threadName) {
			//jjvm.core.NotificationCentre.dispatch(this, "onSuspendExecution");
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					//thread.dispatch("onSuspendExecution");
					thread.suspendExecution();
				}
			});
		},
		"stepOver": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					//thread.dispatch("onStepOver");
					thread.stepOver();
				}
			});
		},
		"stepInto": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					//thread.dispatch("onStepInto");
					thread.stepInto();
				}
			});
		},
		"stepOut": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					//thread.dispatch("onStepOut");
					thread.stepOut();
				}
			});
		},
		"dropToFrame": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					//thread.dispatch("onDropToFrame");
					thread.dropToFrame();
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
		jjvm.console.error("Unknown action from main thread " + event.data.action);
	}
}, false);

// set up System.out & System.err
var system = jjvm.core.ClassLoader.loadClass("java.lang.System");
var inputStreamClass = jjvm.core.ClassLoader.loadClass("java.io.InputStream");
var printStreamClass = jjvm.core.ClassLoader.loadClass("java.io.PrintStream");
system.setStaticField("in", new jjvm.runtime.ObjectReference(inputStreamClass));
system.setStaticField("out", new jjvm.runtime.ObjectReference(printStreamClass));
system.setStaticField("err", new jjvm.runtime.ObjectReference(printStreamClass));