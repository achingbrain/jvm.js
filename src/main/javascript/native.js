// Methods specified here will override any specified in bytecode.
//
// If you compile bytecode with native methods, you should specify
// an implementation of the method here, otherwise a compile time
// warning will be generated and your code will likely fail at
// run time.
jjvm.nativeMethods = {

	"java.lang.Object": {
		"registerNatives()V": function() {
			
		}
	},

	"java.io.PrintStream": {
		"println(Ljava/lang/String;):V": function(line) {
			jjvm.ui.JJVM.console.info(line);
		}
	}
};
