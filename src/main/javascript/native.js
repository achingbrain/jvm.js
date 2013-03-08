// Methods specified here will override any specified in bytecode.
//
// If you compile bytecode with native methods, you should specify
// an implementation of the method here, otherwise a compile time
// warning will be generated and your code will likely fail at
// run time.
//
// When exectuted, the this keyword will have a value of the passed
// objectRef, unless the method is static, in which case it will
// be the passed classDef
jjvm.nativeMethods = {

	"java.lang.Object": {
		"registerNatives()V": function(classDef, methodDef, objectRef) {
			
		},

		"getClass()Ljava/lang/Class;": function(classDef, methodDef, objectRef) {
			return classDef.getObjectRef();
		},

		"hashCode()I": function(classDef, methodDef, objectRef) {
			var output = "";

			for(var i = 0; i < classDef.getName().length; i++) {
				output += classDef.getName().charCodeAt(i);
			}

			return parseInt(output, 8);
		},

		"clone()Ljava/lang/Object;": function(classDef, methodDef, objectRef) {
			// yikes!
			return objectRef;
		},

		"notify()V": function(classDef, methodDef, objectRef) {

		},

		"notifyAll()V": function(classDef, methodDef, objectRef) {

		},

		"wait(J)V": function(classDef, methodDef, objectRef, interval) {

		}
	},

	"java.lang.Class": {
		"registerNatives()V": function(classDef, methodDef, objectRef) {
			
		},

		"forName0(Ljava/lang/String;ZLjava/lang/ClassLoader;)Ljava/lang/Class;": function(classDef, methodDef, objectRef, className, classLoader) {
			return jjvm.core.ClassLoader.loadClass(className).getObjectRef();
		},

		"isInstance(Ljava/lang/Object;)Z": function(classDef, methodDef, objectRef, otherObjectRef) {
			return otherObjectRef.getClass().isChildOf(classDef);
		},

		"isAssignableFrom(Ljava/lang/Class;)Z": function(classDef, methodDef, objectRef, otherClassDefObjectRef) {
			return classDef.isChildOf(otherClassDefObjectRef.getClass());
		},

		"isInterface()Z": function(classDef, methodDef, objectRef) {
			return classDef.isInterface();
		},

		"isArray()Z": function(classDef, methodDef, objectRef) {
			return false;
		},

		"isPrimitive()Z": function(classDef, methodDef, objectRef) {
			return jjvm.types.Primitives.classToPrimitive[classDef.getName()] !== undefined;
		},

		"getName0()Ljava/lang/String;": function(classDef, methodDef, objectRef) {
			var stringClassDef = jjvm.core.ClassLoader.loadClass("java.lang.String");
			var stringObjectRef = new jjvm.runtime.ObjectReference(stringClassDef);

			stringObjectRef.setField("hash32", 0);
			stringObjectRef.setField("value", classDef.getName().split(""));

			return stringObjectRef;

			//return jjvm.Util.createStringRef(classDef.getName());
		},

		"getClassLoader0()Ljava/lang/ClassLoader;": function(classDef, methodDef, objectRef) {
			console.warn("getClassLoader0()Ljava/lang/ClassLoader; invoked on " + classDef.getName() + "!");
		},

		"getSuperclass()Ljava/lang/Class;": function(classDef, methodDef, objectRef) {
			return classDef.getParent().getObjectRef();
		},

		"getInterfaces()[Ljava/lang/Class;": function(classDef, methodDef, objectRef) {
			var output = [];
			var iterator = new jjvm.core.Iterator(classDef.getInterfaces());

			while(iterator.hasNext()) {
				output.push(iterator.next().getClassDef().getObjectRef());
			}

			return output;
		},

		"getComponentType()Ljava/lang/Class;": function(classDef, methodDef, objectRef) {
			console.warn("getComponentType()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getModifiers()I": function(classDef, methodDef, objectRef) {
			console.warn("getModifiers()I invoked on " + classDef.getName() + "!");
		},

		"getSigners()[Ljava/lang/Object;": function(classDef, methodDef, objectRef) {
			console.warn("getSigners()[Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"setSigners([Ljava/lang/Object;)V": function(classDef, methodDef, objectRef, signersArray) {
			console.warn("setSigners([Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getEnclosingMethod0()[Ljava/lang/Object;": function(classDef, methodDef, objectRef) {
			console.warn("getEnclosingMethod0()[Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"getDeclaringClass()Ljava/lang/Class;": function(classDef, methodDef, objectRef) {
			console.warn("getDeclaringClass()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getProtectionDomain0()Ljava/security/ProtectionDomain;": function(classDef, methodDef, objectRef) {
			console.warn("getProtectionDomain0()Ljava/security/ProtectionDomain; invoked on " + classDef.getName() + "!");
		},

		"setProtectionDomain0(Ljava/security/ProtectionDomain;)V": function(classDef, methodDef, objectRef, protectionDomainRef) {
			console.warn("setProtectionDomain0(Ljava/security/ProtectionDomain;)V invoked on " + classDef.getName() + "!");
		},

		"getPrimitiveClass(Ljava/lang/String;)Ljava/lang/Class;": function(classDef, methodDef, objectRef, stringRef) {
			var name = stringRef.getField("value").join("");
			var className = jjvm.types.Primitives.primitiveToClass[name];
			var primitiveClassDef = jjvm.core.ClassLoader.loadClass(className);

			return primitiveClassDef.getObjectRef();
		},

		"getGenericSignature()Ljava/lang/String;": function(classDef, methodDef, objectRef) {
			console.warn("getGenericSignature()Ljava/lang/String; invoked on " + classDef.getName() + "!");
		},

		"getRawAnnotations()[B": function(classDef, methodDef, objectRef) {
			console.warn("getRawAnnotations()[B invoked on " + classDef.getName() + "!");
		},

		"getConstantPool()Lsun/reflect/ConstantPool;": function(classDef, methodDef, objectRef) {
			console.warn("getConstantPool()Lsun/reflect/ConstantPool; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredFields0(Z)[Ljava/lang/reflect/Field;": function(classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredFields0(Z)[Ljava/lang/reflect/Field; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredMethods0(Z)[Ljava/lang/reflect/Method;": function(classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredMethods0(Z)[Ljava/lang/reflect/Method; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredConstructors0(Z)[Ljava/lang/reflect/Constructor;": function(classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredConstructors0(Z)[Ljava/lang/reflect/Constructor; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredClasses0()[Ljava/lang/Class;": function(classDef, methodDef, objectRef) {
			console.warn("getDeclaredClasses0()[Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"desiredAssertionStatus0(Ljava/lang/Class;)Z": function(classDef, methodDef, objectRef, forClassRef) {
			console.warn("desiredAssertionStatus0(Ljava/lang/Class;)Z invoked on " + classDef.getName() + "!");

			return true;
		}
	},

	"java.lang.String": {
		"intern()Ljava/lang/String;": function(classDef, methodDef, objectRef) {
			
		}
	},

	"java.io.PrintStream": {
		"println(Ljava/lang/String;):V": function(classDef, methodDef, objectRef, line) {
			jjvm.ui.JJVM.console.info(line);
		}
	},

	"java.lang.System": {
		"registerNatives()V": function(classDef, methodDef, objectRef) {

		},
		"setIn0(Ljava/io/InputStream;)V": function(classDef, methodDef, objectRef, inputStream) {

		},
		"setOut0(Ljava/io/PrintStream;)V": function(classDef, methodDef, objectRef, printStream) {

		},
		"setErr0(Ljava/io/PrintStream;)V": function(classDef, methodDef, objectRef, printStream) {

		},
		"currentTimeMillis()J": function(classDef, methodDef, objectRef) {
			return new Date().getTime();
		},
		"nanoTime()J": function(classDef, methodDef, objectRef) {
			return new Date().getTime() * 1000;
		},
		"arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V": function(classDef, methodDef, objectRef, src, srcPos, dest, destPos, length) {
			if(!dest) {
				throw "NullPointerException";
			}

			if(!src) {
				throw "NullPointerException";
			}

			if(!_.isArray(src) || !_.isArray(dest)) {
				throw "ArrayStoreException";
			}

			if(srcPos < 0 || destPos < 0 || length < 0 || (srcPos + length > src.length) || (destPos + length > dest.length)) {
				throw "IndexOutOfBoundsException";
			}

			for(var i = 0; i < length; i++) {
				dest[destPos + i] = src[srcPos + i];
			}
		},
		"identityHashCode(Ljava/lang/Object;)I": function(classDef, methodDef, objectRef, x) {
			
		},
		"initProperties(Ljava/util/Properties;)Ljava/util/Properties;": function(classDef, methodDef, objectRef, properties) {
			
		},
		"mapLibraryName(Ljava/lang/String;)Ljava/lang/String;": function(classDef, methodDef, objectRef, libName) {
			
		}
	},

	"java.lang.Throwable": {
		"fillInStackTrace(I)Ljava/lang/Throwable;": function(classDef, methodDef, objectRef, x) {
			return objectRef;
		},

		"getStackTraceDepth()I": function(classDef, methodDef, objectRef) {
			return 0;
		},

		"getStackTraceElement(I)Ljava/lang/StackTraceElement;": function(classDef, methodDef, objectRef, index) {
			return null;
		}
	},

	"java.lang.Float": {
		"floatToRawIntBits(F)I": function(classDef, methodDef, objectRef, f) {
			return f;
		},

		"intBitsToFloat(I)F": function(classDef, methodDef, objectRef, i) {
			return i;
		}
	},

	"java.lang.Double": {
		"doubleToRawLongBits(D)J": function(classDef, methodDef, objectRef, d) {
			return d;
		},

		"longBitsToDouble(J)D": function(classDef, methodDef, objectRef, j) {
			return j;
		}
	}
};
