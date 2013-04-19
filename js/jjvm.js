jjvm = {
	core: {

	},
	compiler: {

	},
	runtime: {

	},
	types: {

	},
	ui: {

	},
	nativeMethods: {}
};

jjvm.Util = {
	createStringRef: function(string) {
		var chars = string.split("");

		return jjvm.Util.createObjectRef("java.lang.String", ["char[]"], [chars]);
	},

	createObjectRef: function(className, constructorSignature, constructorArgs) {
		var classDef = jjvm.core.ClassLoader.loadClass(className);
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		if(constructorArgs) {
			constructorArgs.unshift(objectRef);
		} else {
			constructorArgs = [objectRef];
		}

		var frame = new jjvm.runtime.Frame(classDef, classDef.getMethod("<init>", constructorSignature), constructorArgs);
		frame.setIsSystemFrame(true);
		var thread = new jjvm.runtime.Thread(frame);
		thread.run();
		jjvm.runtime.ThreadPool.reap();

		return objectRef;
	},

	parseArgs: function(string) {
		var args = [];
		var iterator = new jjvm.core.Iterator(string.split(""));

		while(iterator.hasNext()) {
			var character = iterator.peek();

			if(character == "(") {
				// discard (
				iterator.next();
				continue;
			}

			if(character == ")") {
				break;
			}

			if(character == "L") {
				args.push(jjvm.Util._readObjectArgument(iterator));
			} else if(character == "[") {
				args.push(jjvm.Util._readArrayArgument(iterator));
			} else {
				var primitive = jjvm.Util._readPrimitiveArgument(iterator);

				if(primitive) {
					args.push(primitive);
				}
			}
		}

		return args;
	},

	execute: function(target, methodName, args, argTypes) {
		if(!argTypes) {
			argTypes = [];
		}

		if(!args) {
			args = [];
		}

		var methodDef;

		if(target instanceof jjvm.types.ClassDefinition) {
			// a static method
			methodDef = target.getMethod(methodName, argTypes);
		} else if(target instanceof jjvm.runtime.ObjectReference) {
			args.unshift(target);
			methodDef = target.getClass().getMethod(methodName, argTypes);
		} else {
			throw "Please pass only ClassDefinition or ObjectReference types to jjvm.Util#execute";
		}

		var frame = new jjvm.runtime.Frame(
			target.getClass(), 
			methodDef,
			args
		);
		frame.setIsSystemFrame(true);
		var thread = new jjvm.runtime.Thread(frame);
		frame.execute(thread);

		return frame.getOutput();
	},

	_readPrimitiveArgument: function(iterator) {
		var character = iterator.next();

		return jjvm.types.Primitives.jvmTypesToPrimitive[character];
	},

	_readObjectArgument: function(iterator) {
		// discard L
		iterator.next();
		var className = "";

		while(true) {
			var classNameCharacter = iterator.next();

			if(classNameCharacter == ";") {
				className = className.replace(/\//g, ".");

				return className;
			} else {
				className += classNameCharacter;
			}
		}
	},

	_readArrayArgument: function(iterator) {
		// discard [
		iterator.next();

		var character = iterator.peek();

		if(character == "L") {
			return jjvm.Util._readObjectArgument(iterator) + "[]";
		} else {
			return jjvm.Util._readPrimitiveArgument(iterator) + "[]";
		}
	}
};

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
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},

		"getClass()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			return classDef.getObjectRef();
		},

		"hashCode()I": function(frame, classDef, methodDef, objectRef) {
			var output = "";

			for(var i = 0; i < classDef.getName().length; i++) {
				output += classDef.getName().charCodeAt(i);
			}

			return parseInt(output, 8);
		},

		"clone()Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			// yikes!
			return objectRef;
		},

		"notify()V": function(frame, classDef, methodDef, objectRef) {

		},

		"notifyAll()V": function(frame, classDef, methodDef, objectRef) {

		},

		"wait(J)V": function(frame, classDef, methodDef, objectRef, interval) {

		}
	},

	"java.lang.Class": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},

		"forName0(Ljava/lang/String;ZLjava/lang/ClassLoader;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, className, classLoader) {
			return jjvm.core.ClassLoader.loadClass(className).getObjectRef();
		},

		"isInstance(Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef, otherObjectRef) {
			return otherObjectRef.getClass().isChildOf(classDef);
		},

		"isAssignableFrom(Ljava/lang/Class;)Z": function(frame, classDef, methodDef, objectRef, otherClassDefObjectRef) {
			return classDef.isChildOf(otherClassDefObjectRef.getClass());
		},

		"isInterface()Z": function(frame, classDef, methodDef, objectRef) {
			return classDef.isInterface();
		},

		"isArray()Z": function(frame, classDef, methodDef, objectRef) {
			return false;
		},

		"isPrimitive()Z": function(frame, classDef, methodDef, objectRef) {
			return jjvm.types.Primitives.classToPrimitive[classDef.getName()] !== undefined;
		},

		"getName0()Ljava/lang/String;": function(frame, classDef, methodDef, objectRef) {
			var stringClassDef = jjvm.core.ClassLoader.loadClass("java.lang.String");
			var stringObjectRef = new jjvm.runtime.ObjectReference(stringClassDef);

			stringObjectRef.setField("hash32", 0);
			stringObjectRef.setField("value", classDef.getName().split(""));

			return stringObjectRef;

			//return jjvm.Util.createStringRef(classDef.getName());
		},

		"getClassLoader0()Ljava/lang/ClassLoader;": function(frame, classDef, methodDef, objectRef) {
			return classDef.getClassLoader().getObjectRef();
		},

		"getSuperclass()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			return classDef.getParent().getObjectRef();
		},

		"getInterfaces()[Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			var output = [];
			var iterator = new jjvm.core.Iterator(classDef.getInterfaces());

			while(iterator.hasNext()) {
				output.push(iterator.next().getClassDef().getObjectRef());
			}

			return output;
		},

		"getComponentType()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getComponentType()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getModifiers()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getModifiers()I invoked on " + classDef.getName() + "!");
		},

		"getSigners()[Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getSigners()[Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"setSigners([Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef, signersArray) {
			console.warn("setSigners([Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getEnclosingMethod0()[Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getEnclosingMethod0()[Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"getDeclaringClass()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDeclaringClass()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getProtectionDomain0()Ljava/security/ProtectionDomain;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getProtectionDomain0()Ljava/security/ProtectionDomain; invoked on " + classDef.getName() + "!");
		},

		"setProtectionDomain0(Ljava/security/ProtectionDomain;)V": function(frame, classDef, methodDef, objectRef, protectionDomainRef) {
			console.warn("setProtectionDomain0(Ljava/security/ProtectionDomain;)V invoked on " + classDef.getName() + "!");
		},

		"getPrimitiveClass(Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, stringRef) {
			var name = stringRef.getField("value").join("");
			var className = jjvm.types.Primitives.primitiveToClass[name];
			var primitiveClassDef = jjvm.core.ClassLoader.loadClass(className);

			return primitiveClassDef.getObjectRef();
		},

		"getGenericSignature()Ljava/lang/String;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getGenericSignature()Ljava/lang/String; invoked on " + classDef.getName() + "!");
		},

		"getRawAnnotations()[B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getRawAnnotations()[B invoked on " + classDef.getName() + "!");
		},

		"getConstantPool()Lsun/reflect/ConstantPool;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getConstantPool()Lsun/reflect/ConstantPool; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredFields0(Z)[Ljava/lang/reflect/Field;": function(frame, classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredFields0(Z)[Ljava/lang/reflect/Field; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredMethods0(Z)[Ljava/lang/reflect/Method;": function(frame, classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredMethods0(Z)[Ljava/lang/reflect/Method; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredConstructors0(Z)[Ljava/lang/reflect/Constructor;": function(frame, classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredConstructors0(Z)[Ljava/lang/reflect/Constructor; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredClasses0()[Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDeclaredClasses0()[Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"desiredAssertionStatus0(Ljava/lang/Class;)Z": function(frame, classDef, methodDef, objectRef, forClassRef) {
			return true;
		},

		"desiredAssertionStatus()Z": function(frame, classDef, methodDef, objectRef, stringRef) {
			return true;
		},

		"getClassLoader()Ljava/lang/ClassLoader;": function(frame, classDef, methodDef, objectRef, forClassRef) {
			return classDef.getClassLoader().getObjectRef();
		}
	},

	"java.lang.String": {
		"intern()Ljava/lang/String;": function(frame, classDef, methodDef, objectRef) {
			console.warn("intern()Ljava/lang/String; invoked on " + classDef.getName() + "!");
		}
	},

	"java.io.PrintStream": {
		"println(Ljava/lang/String;)V": function(frame, classDef, methodDef, objectRef, stringRef) {
			var line = stringRef.getField("value").join("");
			console.info(line);
		}
	},

	"java.lang.System": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {

		},
		"setIn0(Ljava/io/InputStream;)V": function(frame, classDef, methodDef, objectRef, inputStream) {
			classDef.setStaticField("in", inputStream);
		},
		"setOut0(Ljava/io/PrintStream;)V": function(frame, classDef, methodDef, objectRef, printStream) {
			classDef.setStaticField("out", printStream);
		},
		"setErr0(Ljava/io/PrintStream;)V": function(frame, classDef, methodDef, objectRef, printStream) {
			classDef.setStaticField("err", printStream);
		},
		"currentTimeMillis()J": function(frame, classDef, methodDef, objectRef) {
			return new Date().getTime();
		},
		"nanoTime()J": function(frame, classDef, methodDef, objectRef) {
			return new Date().getTime() * 1000;
		},
		"arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V": function(frame, classDef, methodDef, objectRef, src, srcPos, dest, destPos, length) {
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
		"identityHashCode(Ljava/lang/Object;)I": function(frame, classDef, methodDef, objectRef, otherObjectRef) {
			return otherObjectRef.getIndex();
		},
		"initProperties(Ljava/util/Properties;)Ljava/util/Properties;": function(frame, classDef, methodDef, objectRef, properties) {
			console.warn("initProperties(Ljava/util/Properties;)Ljava/util/Properties; invoked on " + classDef.getName() + "!");
		},
		"mapLibraryName(Ljava/lang/String;)Ljava/lang/String;": function(frame, classDef, methodDef, objectRef, libName) {
			console.warn("mapLibraryName(Ljava/lang/String;)Ljava/lang/String; invoked on " + classDef.getName() + "!");
		}
	},

	"java.lang.Throwable": {
		"fillInStackTrace(I)Ljava/lang/Throwable;": function(frame, classDef, methodDef, objectRef, x) {
			return objectRef;
		},

		"getStackTraceDepth()I": function(frame, classDef, methodDef, objectRef) {
			return 0;
		},

		"getStackTraceElement(I)Ljava/lang/StackTraceElement;": function(frame, classDef, methodDef, objectRef, index) {
			return null;
		}
	},

	"java.lang.Float": {
		"floatToRawIntBits(F)I": function(frame, classDef, methodDef, objectRef, f) {
			return f;
		},

		"intBitsToFloat(I)F": function(frame, classDef, methodDef, objectRef, i) {
			return i;
		}
	},

	"java.lang.Double": {
		"doubleToRawLongBits(D)J": function(frame, classDef, methodDef, objectRef, d) {
			return d;
		},

		"longBitsToDouble(J)D": function(frame, classDef, methodDef, objectRef, j) {
			return j;
		}
	},

	"java.lang.ClassLoader": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {

		},

		"defineClass0(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, name, bytes, offset, length, protectionDomain) {
			console.warn("defineClass0(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineClass1(Ljava/lang/String;[BIILjava/security/ProtectionDomain;Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, name, bytes, offset, length, protectionDomain, anotherString) {
			console.warn("defineClass1(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineClass2(Ljava/lang/String;Ljava/nio/ByteBuffer;IILjava/security/ProtectionDomain;Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, name, byteBuffer, offset, length, protectionDomain, anotherString) {
			console.warn("defineClass2(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"resolveClass0(Ljava/lang/Class;)V": function(frame, classDef, methodDef, objectRef, clazz) {
			console.warn("resolveClass0(Ljava/lang/Class;)V invoked on " + classDef.getName() + "!");
		},

		"findBootstrapClass(Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, className) {
			console.warn("findBootstrapClass(Ljava/lang/String;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"findLoadedClass0(Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, className) {
			console.warn("findLoadedClass0(Ljava/lang/String;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getCaller(I)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, index) {
			console.warn("getCaller(I)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"retrieveDirectives()Ljava/lang/AssertionStatusDirectives;": function(frame, classDef, methodDef, objectRef) {
			console.warn("retrieveDirectives()Ljava/lang/AssertionStatusDirectives; invoked on " + classDef.getName() + "!");
		}
	},

	"java.security.AccessController": {
		"doPrivileged(Ljava/security/PrivilegedAction;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef) {
			return jjvm.Util.execute(actionRef, "run");
		},

		"doPrivileged(Ljava/security/PrivilegedAction;Ljava/security/AccessControlContext;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef, contextRef) {
			return jjvm.Util.execute(actionRef, "run");
		},

		"doPrivileged(Ljava/security/PrivilegedExceptionAction;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef) {
			console.warn("doPrivileged(Ljava/security/PrivilegedExceptionAction;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"doPrivileged(Ljava/security/PrivilegedExceptionAction;Ljava/security/AccessControlContext;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef, contextRef) {
			console.warn("doPrivileged(Ljava/security/PrivilegedExceptionAction;Ljava/security/AccessControlContext;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"getStackAccessControlContext()Ljava/security/AccessControlContext;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getStackAccessControlContext()Ljava/security/AccessControlContext; invoked on " + classDef.getName() + "!");
		},

		"getInheritedAccessControlContext()Ljava/security/AccessControlContext;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getStackAccessControlContext()Ljava/security/AccessControlContext; invoked on " + classDef.getName() + "!");
		}
	},

	"sun.misc.Unsafe": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},
	
		"getInt(Ljava/lang/Object;J)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getInt(Ljava/lang/Object;J)I invoked on " + classDef.getName() + "!");
		},

		"putInt(Ljava/lang/Object;JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putInt(Ljava/lang/Object;JI)V invoked on " + classDef.getName() + "!");
		},

		"getObject(Ljava/lang/Object;J)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getObject(Ljava/lang/Object;J)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"putObject(Ljava/lang/Object;JLjava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putObject(Ljava/lang/Object;JLjava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getBoolean(Ljava/lang/Object;J)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("getBoolean(Ljava/lang/Object;J)Z invoked on " + classDef.getName() + "!");
		},

		"putBoolean(Ljava/lang/Object;JZ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putBoolean(Ljava/lang/Object;JZ)V invoked on " + classDef.getName() + "!");
		},

		"getByte(Ljava/lang/Object;J)B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getByte(Ljava/lang/Object;J)B invoked on " + classDef.getName() + "!");
		},

		"putByte(Ljava/lang/Object;JB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putByte(Ljava/lang/Object;JB)V invoked on " + classDef.getName() + "!");
		},

		"getShort(Ljava/lang/Object;J)S": function(frame, classDef, methodDef, objectRef) {
			console.warn("getShort(Ljava/lang/Object;J)S invoked on " + classDef.getName() + "!");
		},

		"putShort(Ljava/lang/Object;JS)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putShort(Ljava/lang/Object;JS)V invoked on " + classDef.getName() + "!");
		},

		"getChar(Ljava/lang/Object;J)C": function(frame, classDef, methodDef, objectRef) {
			console.warn("getChar(Ljava/lang/Object;J)C invoked on " + classDef.getName() + "!");
		},

		"putChar(Ljava/lang/Object;JC)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putChar(Ljava/lang/Object;JC)V invoked on " + classDef.getName() + "!");
		},

		"getLong(Ljava/lang/Object;J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLong(Ljava/lang/Object;J)J invoked on " + classDef.getName() + "!");
		},

		"putLong(Ljava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putLong(Ljava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"getFloat(Ljava/lang/Object;J)F": function(frame, classDef, methodDef, objectRef) {
			console.warn("getFloat(Ljava/lang/Object;J)F invoked on " + classDef.getName() + "!");
		},

		"putFloat(Ljava/lang/Object;JF)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putFloat(Ljava/lang/Object;JF)V invoked on " + classDef.getName() + "!");
		},

		"getDouble(Ljava/lang/Object;J)D": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDouble(Ljava/lang/Object;J)D invoked on " + classDef.getName() + "!");
		},

		"putDouble(Ljava/lang/Object;JD)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putDouble(Ljava/lang/Object;JD)V invoked on " + classDef.getName() + "!");
		},

		"getByte(J)B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getByte(J)B invoked on " + classDef.getName() + "!");
		},

		"putByte(JB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putByte(JB)V invoked on " + classDef.getName() + "!");
		},

		"getShort(J)S": function(frame, classDef, methodDef, objectRef) {
			console.warn("getShort(J)S invoked on " + classDef.getName() + "!");
		},

		"putShort(JS)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putShort(JS)V invoked on " + classDef.getName() + "!");
		},

		"getChar(J)C": function(frame, classDef, methodDef, objectRef) {
			console.warn("getChar(J)C invoked on " + classDef.getName() + "!");
		},

		"putChar(JC)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putChar(JC)V invoked on " + classDef.getName() + "!");
		},

		"getInt(J)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getInt(J)I invoked on " + classDef.getName() + "!");
		},

		"putInt(JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putInt(JI)V invoked on " + classDef.getName() + "!");
		},

		"getLong(J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLong(J)J invoked on " + classDef.getName() + "!");
		},

		"putLong(JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putLong(JJ)V invoked on " + classDef.getName() + "!");
		},

		"getFloat(J)F": function(frame, classDef, methodDef, objectRef) {
			console.warn("getFloat(J)F invoked on " + classDef.getName() + "!");
		},

		"putFloat(JF)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putFloat(JF)V invoked on " + classDef.getName() + "!");
		},

		"getDouble(J)D": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDouble(J)D invoked on " + classDef.getName() + "!");
		},

		"putDouble(JD)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putDouble(JD)V invoked on " + classDef.getName() + "!");
		},

		"getAddress(J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getAddress(J)J invoked on " + classDef.getName() + "!");
		},

		"putAddress(JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putAddress(JJ)V invoked on " + classDef.getName() + "!");
		},

		"allocateMemory(J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("allocateMemory(J)J invoked on " + classDef.getName() + "!");
		},

		"reallocateMemory(JJ)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("reallocateMemory(JJ)J invoked on " + classDef.getName() + "!");
		},

		"setMemory(Ljava/lang/Object;JJB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("setMemory(Ljava/lang/Object;JJB)V invoked on " + classDef.getName() + "!");
		},

		"copyMemory(Ljava/lang/Object;JLjava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("copyMemory(Ljava/lang/Object;JLjava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"freeMemory(J)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("freeMemory(J)V invoked on " + classDef.getName() + "!");
		},

		"staticFieldOffset(Ljava/lang/reflect/Field;)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("staticFieldOffset(Ljava/lang/reflect/Field;)J invoked on " + classDef.getName() + "!");
		},

		"objectFieldOffset(Ljava/lang/reflect/Field;)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("objectFieldOffset(Ljava/lang/reflect/Field;)J invoked on " + classDef.getName() + "!");
		},

		"staticFieldBase(Ljava/lang/reflect/Field;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("staticFieldBase(Ljava/lang/reflect/Field;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"ensureClassInitialized(Ljava/lang/Class;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("ensureClassInitialized(Ljava/lang/Class;)V invoked on " + classDef.getName() + "!");
		},

		"arrayBaseOffset(Ljava/lang/Class;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("arrayBaseOffset(Ljava/lang/Class;)I invoked on " + classDef.getName() + "!");
		},

		"arrayIndexScale(Ljava/lang/Class;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("arrayIndexScale(Ljava/lang/Class;)I invoked on " + classDef.getName() + "!");
		},

		"addressSize()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("addressSize()I invoked on " + classDef.getName() + "!");
		},

		"pageSize()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("pageSize()I invoked on " + classDef.getName() + "!");
		},

		"defineClass(Ljava/lang/String;[BIILjava/lang/ClassLoader;Ljava/security/ProtectionDomain;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("defineClass(Ljava/lang/String;[BIILjava/lang/ClassLoader;Ljava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineClass(Ljava/lang/String;[BII)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("defineClass(Ljava/lang/String;[BII)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineAnonymousClass(Ljava/lang/Class;[B[Ljava/lang/Object;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("defineAnonymousClass(Ljava/lang/Class;[B[Ljava/lang/Object;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"allocateInstance(Ljava/lang/Class;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("allocateInstance(Ljava/lang/Class;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"monitorEnter(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("monitorEnter(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"monitorExit(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("monitorExit(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"tryMonitorEnter(Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("tryMonitorEnter(Ljava/lang/Object;)Z invoked on " + classDef.getName() + "!");
		},

		"throwException(Ljava/lang/Throwable;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("hrowException(Ljava/lang/Throwable;)V invoked on " + classDef.getName() + "!");
		},

		"compareAndSwapObject(Ljava/lang/Object;JLjava/lang/Object;Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("compareAndSwapObject(Ljava/lang/Object;JLjava/lang/Object;Ljava/lang/Object;)Z invoked on " + classDef.getName() + "!");
		},

		"compareAndSwapInt(Ljava/lang/Object;JII)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("compareAndSwapInt(Ljava/lang/Object;JII)Z invoked on " + classDef.getName() + "!");
		},

		"compareAndSwapLong(Ljava/lang/Object;JJJ)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("compareAndSwapLong(Ljava/lang/Object;JJJ)Z invoked on " + classDef.getName() + "!");
		},

		"getObjectVolatile(Ljava/lang/Object;J)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getObjectVolatile(Ljava/lang/Object;J)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"putObjectVolatile(Ljava/lang/Object;JLjava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putObjectVolatile(Ljava/lang/Object;JLjava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getIntVolatile(Ljava/lang/Object;J)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getIntVolatile(Ljava/lang/Object;J)I invoked on " + classDef.getName() + "!");
		},

		"putIntVolatile(Ljava/lang/Object;JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putIntVolatile(Ljava/lang/Object;JI)V invoked on " + classDef.getName() + "!");
		},

		"getBooleanVolatile(Ljava/lang/Object;J)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("getBooleanVolatile(Ljava/lang/Object;J)Z invoked on " + classDef.getName() + "!");
		},

		"putBooleanVolatile(Ljava/lang/Object;JZ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putBooleanVolatile(Ljava/lang/Object;JZ)V invoked on " + classDef.getName() + "!");
		},

		"getByteVolatile(Ljava/lang/Object;J)B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getByteVolatile(Ljava/lang/Object;J)B invoked on " + classDef.getName() + "!");
		},

		"putByteVolatile(Ljava/lang/Object;JB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putByteVolatile(Ljava/lang/Object;JB)V invoked on " + classDef.getName() + "!");
		},

		"getShortVolatile(Ljava/lang/Object;J)S": function(frame, classDef, methodDef, objectRef) {
			console.warn("getShortVolatile(Ljava/lang/Object;J)S invoked on " + classDef.getName() + "!");
		},

		"putShortVolatile(Ljava/lang/Object;JS)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putShortVolatile(Ljava/lang/Object;JS)V invoked on " + classDef.getName() + "!");
		},

		"getCharVolatile(Ljava/lang/Object;J)C": function(frame, classDef, methodDef, objectRef) {
			console.warn("getCharVolatile(Ljava/lang/Object;J)C invoked on " + classDef.getName() + "!");
		},

		"putCharVolatile(Ljava/lang/Object;JC)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putCharVolatile(Ljava/lang/Object;JC)V invoked on " + classDef.getName() + "!");
		},

		"getLongVolatile(Ljava/lang/Object;J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLongVolatile(Ljava/lang/Object;J)J invoked on " + classDef.getName() + "!");
		},

		"putLongVolatile(Ljava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putLongVolatile(Ljava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"getFloatVolatile(Ljava/lang/Object;J)F": function(frame, classDef, methodDef, objectRef) {
			console.warn("getFloatVolatile(Ljava/lang/Object;J)F invoked on " + classDef.getName() + "!");
		},

		"putFloatVolatile(Ljava/lang/Object;JF)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("utFloatVolatile(Ljava/lang/Object;JF)V invoked on " + classDef.getName() + "!");
		},

		"getDoubleVolatile(Ljava/lang/Object;J)D": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDoubleVolatile(Ljava/lang/Object;J)D invoked on " + classDef.getName() + "!");
		},

		"putDoubleVolatile(Ljava/lang/Object;JD)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putDoubleVolatile(Ljava/lang/Object;JD)V invoked on " + classDef.getName() + "!");
		},

		"putOrderedObject(Ljava/lang/Object;JLjava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putOrderedObject(Ljava/lang/Object;JLjava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"putOrderedInt(Ljava/lang/Object;JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putOrderedInt(Ljava/lang/Object;JI)V invoked on " + classDef.getName() + "!");
		},

		"putOrderedLong(Ljava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putOrderedLong(Ljava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"unpark(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("unpark(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"park(ZJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("park(ZJ)V invoked on " + classDef.getName() + "!");
		},

		"getLoadAverage([DI)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLoadAverage([DI)I invoked on " + classDef.getName() + "!");
		}
	},

	"sun.reflect.Reflection" : {
		"getCallerClass(I)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, stackDepth) {
			for(var i = 0; i < stackDepth; i++) {
				frame = frame.getParent();
			}

			return frame.getClassDef().getObjectRef();
		},

		"getClassAccessFlags(Ljava/lang/Class;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getClassAccessFlags(Ljava/lang/Class;)I invoked on " + classDef.getName() + "!");
		}
	},

	"sun.misc.VM": {
		"initialize()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("initialize()V invoked on " + classDef.getName() + "!");
		}
	},

	"java.lang.SecurityManager": {
		"getClassContext()[Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getClassContext()[Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"currentClassLoader0()Ljava/lang/ClassLoader;": function(frame, classDef, methodDef, objectRef) {
			console.warn("currentClassLoader0()Ljava/lang/ClassLoader; invoked on " + classDef.getName() + "!");
		},

		"classDepth(Ljava/lang/String;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("classDepth(Ljava/lang/String;)I invoked on " + classDef.getName() + "!");
		},

		"classLoaderDepth0()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("classLoaderDepth0()I invoked on " + classDef.getName() + "!");
		},

		"currentLoadedClass0()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("currentLoadedClass0()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"checkPermission(Ljava/security/Permission;)V": function(frame, classDef, methodDef, objectRef) {
			// do nothing
		},

		"checkPermission(Ljava/security/Permission;Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			// do nothing
		}
	},

	"java.lang.Thread" : {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},

		"currentThread()Ljava/lang/Thread;": function(frame, classDef, methodDef, objectRef) {
			console.warn("currentThread()Ljava/lang/Thread; invoked on " + classDef.getName() + "!");
		},

		"yield()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("yield()V invoked on " + classDef.getName() + "!");
		},

		"sleep(J)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("sleep(J)V invoked on " + classDef.getName() + "!");
		},

		"start0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("start0()V invoked on " + classDef.getName() + "!");
		},

		"isInterrupted(Z)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("isInterrupted(Z)Z invoked on " + classDef.getName() + "!");
		},

		"isAlive()Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("isAlive()Z invoked on " + classDef.getName() + "!");
		},

		"countStackFrames()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("countStackFrames()I invoked on " + classDef.getName() + "!");
		},

		"holdsLock(Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("holdsLock(Ljava/lang/Object;)Z invoked on " + classDef.getName() + "!");
		},

		"dumpThreads([Ljava/lang/Thread;)[[Ljava/lang/StackTraceElement;": function(frame, classDef, methodDef, objectRef) {
			console.warn("dumpThreads([Ljava/lang/Thread;)[[Ljava/lang/StackTraceElement; invoked on " + classDef.getName() + "!");
		},

		"getThreads()[Ljava/lang/Thread;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getThreads()[Ljava/lang/Thread; invoked on " + classDef.getName() + "!");
		},

		"setPriority0(I)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("setPriority0(I)V invoked on " + classDef.getName() + "!");
		},

		"stop0(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("stop0(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"suspend0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("suspend0()V invoked on " + classDef.getName() + "!");
		},

		"resume0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("resume0()V invoked on " + classDef.getName() + "!");
		},

		"interrupt0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("interrupt0()V invoked on " + classDef.getName() + "!");
		},

		"setNativeName(Ljava/lang/String;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("setNativeName(Ljava/lang/String;)V invoked on " + classDef.getName() + "!");
		}
	}/*,

	"java.lang.AbstractStringBuilder": {
		"expandCapacity(I)V": function(frame, classDef, methodDef, objectRef, newCapacity) {
			var value = objectRef.getField("value");
			value.length = newCapacity;
		}
	}*/
};

jjvm.core.ByteIterator = function(iterable) {
	_.extend(this, new jjvm.core.Iterator(iterable));

	this.readU8 = function() {
		return this.next();
	};

	this.read8 = function() {
		return this._checkSign(this.readU8(), 8);
	};

	this.readU16 = function() {

		// Under 32 bits so can use bitwise operators
		return ((this.readU8() & 0xFF) << 8) + ((this.readU8() & 0xFF) << 0);
	};

	this.read16 = function() {
		return this._checkSign(this.readU16(), 16);
	};

	this.readU32 = function() {

		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU16() * Math.pow(2, 16)) + this.readU16();
	};

	this.read32 = function() {
		return this._checkSign(this.readU32(), 32);
	};

	this.readU64 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU32() * Math.pow(2, 32)) + this.readU32();
	};

	this.read64 = function() {
		return this._checkSign(this.readU64(), 64);
	};

	this.readFloat = function() {
		var bits = this.readU32();

		if(bits == 0x7f800000) {
			return Infinity;
		} else if(bits == 0xff800000) {
			return -Infinity;
		} else if(bits >= 0x7f800001 && bits <= 0x7fffffff) {
			return NaN;
		} else if(bits >= 0xff800001 && bits <= 0xffffffff) {
			return NaN;
		}

		var s = ((bits >> 31) === 0) ? 1 : -1;
		var e = ((bits >> 23) & 0xff);
		var m = (e === 0) ?
				(bits & 0x7fffff) << 1 :
				(bits & 0x7fffff) | 0x800000;

		return s * m * Math.pow(2, e - 150);
	};

	this.readDouble = function() {
		var bits = this.readU64();

		if(bits == 0x7ff0000000000000) {
			return Infinity;
		} else if(bits == 0xfff0000000000000) {
			return -Infinity;
		} else if(bits >= 0x7ff0000000000001 && bits <= 0x7fffffffffffffff) {
			return NaN;
		} else if(bits >= 0xfff0000000000001 && bits <= 0xffffffffffffffff) {
			return NaN;
		}

		var s = (this._shiftRight(bits, 63) === 0) ? 1 : -1;
		var e = (this._shiftRight(bits, 52) & 0x7ff);
		var m = (e === 0) ?
			this._shiftLeft(this._64bitAnd(bits, 0xfffffffffffff), 1) :
			this._64bitOr(this._64bitAnd(bits, 0xfffffffffffff), 0x10000000000000);
		
		return s * m * Math.pow(2, e - 1075);
	};

	this._checkSign = function(value, bits) {
		var max = Math.pow(2, bits - 1);

		// if most significant bit is set, number is negative
		if(Math.abs(value & max) == max) {
			return value - Math.pow(2, bits);
		}

		return value;
	};

	this._shiftLeft = function(value, bits) {
		return parseInt(value * Math.pow(2, bits), 10);
	};

	this._shiftRight = function(value, bits) {
		return parseInt(value / Math.pow(2, bits), 10);
	};

	this._64bitSplit = function(value) {
		value = value.toString(16);
		var low_bytes = parseInt(value.substring(value.length - 8), 16);
		var high_bytes = parseInt(value.substring(0, value.length - 8), 16);

		return [high_bytes, low_bytes];
	};

	this._64bitJoin = function(value) {
		return (value[0] * Math.pow(16, 8)) + value[1];
	};

	this._64bitAnd = function(value, n) {
		var valueBits = this._64bitSplit(value);
		var nBits = this._64bitSplit(n);

		valueBits[0] = valueBits[0] & nBits[0];
		valueBits[1] = valueBits[1] & nBits[1];

		return this._64bitJoin(valueBits);
	};

	this._64bitOr = function(value, n) {
		var valueBits = this._64bitSplit(value);
		var nBits = this._64bitSplit(n);

		valueBits[0] = valueBits[0] | nBits[0];
		valueBits[1] = valueBits[1] | nBits[1];

		return this._64bitJoin(valueBits);
	};
};
jjvm.core.ClassCache = {
	/*load: function(className) {
		if(!localStorage) {
			return null;
		}

		if(!localStorage["jjvm_" + className]) {
			return null;
		}

		console.info("loading " + className);
		var data = JSON.parse(localStorage["jjvm_" + className]);

		var classDef = new jjvm.types.ClassDefinition(data);

		jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef, true]);
		jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);

		return classDef;
	},

	store: function(classDef) {
		if(!localStorage) {
			return;
		}

		var data = JSON.stringify(classDef.getData());

		localStorage["jjvm_" + classDef.getName()] = data;
	},

	empty: function(className) {
		if(!localStorage) {
			return;
		}

		for(var key in localStorage) {
			if(key.substr(0, 5) == "jjvm_") {
				delete localStorage[key];
			}
		}
	},

	evict: function(className) {
		if(!localStorage) {
			return;
		}

		if(className instanceof jjvm.types.ClassDefinition) {
			className = className.getName();
		}

		delete localStorage["jjvm_" + className];
	}*/
};
jjvm.core.ClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.ClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.ClassLoader);

		// haven't seen this class before
		jjvm.core.ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.ClassLoader._classes;
	},

	loadClass: function(className) {
		if(!className) {
			var sdfoij = "asdf9j";
		}

		className = className.replace(/\//g, ".");

		var output;

		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == className) {
				output = jjvm.core.ClassLoader._classes[i];
				break;
			}
		}

		if(!output) {
			output = jjvm.core.SystemClassLoader.loadClass(className);
		}

		if(output.hasMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER) && !output.getInitialized()) {
			// has class initializer so execute it
			output.setInitialized(true);
			var frame = new jjvm.runtime.Frame(output, output.getMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER));
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			thread.run();
		}

		return output;
	},

	getObjectRef: function() {
		if(!jjvm.core.ClassLoader._objectRef) {
			jjvm.core.ClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.ClassLoader._objectRef.getClass(), 
				jjvm.core.ClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, ["java.lang.ClassLoader"]), 
				[jjvm.core.SystemClassLoader.getObjectRef()]
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return jjvm.core.ClassLoader._objectRef;
	}
};
jjvm.core.DOMUtil = {
	create: function(type, content, attributes) {
		// if we've been passed two arguments, see if the second is content or attributes
		if(!attributes && _.isObject(content) && !_.isString(content) && !_.isArray(content) && !_.isElement(content)) {
			attributes = content;
			content = null;
		}

		if(type && content && attributes) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && content) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && attributes) {
			return jjvm.core.DOMUtil._createEmpty(type, attributes);
		} else {
			return jjvm.core.DOMUtil._createEmpty(type);
		}

		//console.error("jjvm.core.DOMUtil.create passed wrong number of arguments.  Expected 1, 2 or 3, was " + arguments.length);
	},

	_create: function(type, content, attributes) {
		var output = jjvm.core.DOMUtil._createEmpty(type, attributes);

		jjvm.core.DOMUtil.append(content, output);

		return output;
	},

	_createEmpty: function(type, attributes) {
		var output = document.createElement(type);

		if(attributes) {
			for(var key in attributes) {
				output[key] = attributes[key];
			}
		}

		return output;
	},

	append: function(content, node) {
		if(_.isString(content)) {
			jjvm.core.DOMUtil._appendText(content, node);
		} else if(_.isArray(content)) {
			for(var i = 0; i < content.length; i++) {
				jjvm.core.DOMUtil.append(content[i], node);
			}
		} else if(_.isElement(content)) {
			node.appendChild(content);
		}
	},

	_appendText: function(content, node) {
		node.appendChild(document.createTextNode(content));
	}
};
jjvm.core.Iterator = function(iterable) {
	var index = 0;

	if(!iterable) {
		throw "Cannot iterrate over falsy value!";	
	}

	this.next = function() {
		var output = iterable[index];
		index++;

		return output;
	};

	this.hasNext = function() {
		return index < iterable.length;
	};

	this.peek = function() {
		return iterable[index];
	};

	this.skip = function() {
		index++;
	};

	this.rewind = function() {
		index--;
	};

	this.reset = function() {
		index = 0;
	};

	this.jump = function(location) {
		index = location;
	};

	this.consume = function() {
		index = iterable.length;
	};

	this.getLocation = function() {
		return index;
	};

	this.getIterable = function() {
		return iterable;
	};
};
jjvm.core.SystemClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.SystemClassLoader);

		// haven't seen this class before
		jjvm.core.SystemClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.SystemClassLoader._classes;
	},

	loadClass: function(className) {
		if(jjvm.types.Primitives.primitiveToClass[className]) {
			// convert int to java.lang.Integer
			var className2 = jjvm.types.Primitives.primitiveToClass[className];
		}

		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[i];
			}
		}

		if(_.string.startsWith(className, "[")) {
			var clazz = new jjvm.types.ClassDefinition({
				getValue: function() {
					return className;
				}
			}, {
				getValue: function() {
					return "java.lang.Object";
				}
			});

			jjvm.core.SystemClassLoader.addClassDefinition(clazz);

			return clazz;
		}

		/*var cached = jjvm.core.ClassCache.load(className);

		if(cached) {
			jjvm.core.SystemClassLoader._classes.push(cached);

			return cached;
		}*/

		console.info("Downloading " + className);

		// Have to use synchronous request here and as such can't use html5
		// response types as they make the UI unresponsive even though
		// we're in a non-UI thread.  Thanks for nothing W3C.
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "/rt/" + className.replace(/\./g, "/") + ".json", false);
		xhr.send();

		if(xhr.status == 200) {
			var bytes = JSON.parse(xhr.responseText);

			var compiler = new jjvm.compiler.Compiler();
			compiler.compileSystemBytes(bytes);
		}

		for(var n = 0; n < jjvm.core.SystemClassLoader._classes.length; n++) {
			if(jjvm.core.SystemClassLoader._classes[n].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[n];
			}
		}

		throw "NoClassDefFound: " + className;
	},

	getObjectRef: function() {
		if(!jjvm.core.SystemClassLoader._objectRef) {
			jjvm.core.SystemClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.SystemClassLoader._objectRef.getClass(), 
				jjvm.core.SystemClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, [])
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return jjvm.core.SystemClassLoader._objectRef;
	}
};

jjvm.core.Watchable = {

	register: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
	},

	registerOneTimeListener: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
		listener.____oneTime = true;
	},

	deRegister: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};

			return false;
		}

		if(this._observers[eventType] === undefined) {
			return false;
		}

		var lengthBefore = this._observers[eventType].length;

		this._observers[eventType] = _.without(this._observers[eventType], listener);

		var lengthAfter = this._observers[eventType].length;

		var deregistered = lengthBefore != lengthAfter;

		if(!deregistered) {
			throw "Failed to deregister " + listener + " for event type " + eventType;
		}

		return deregistered;
	},

	dispatch: function(eventType, args) {
		if(!this._observers) {
			this._observers = {};
		}

		if(args === undefined) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.Watchable#dispatch as args";
		}

		if(this._observers[eventType] !== undefined) {
			var observerArgs = [this];
			observerArgs = observerArgs.concat(args);

			// copy the array in case the listener deregisters itself as part of the callback
			var observers = this._observers[eventType].concat([]);

			for(var i = 0; i < observers.length; i++) {
				observers[i].apply(observers[i], observerArgs);

				if(observers[i].____oneTime === true) {
					this.deRegister(eventType, observers[i]);
				}
			}
		}

		// inform global listeners
		//console.info("dispatching " + eventType + " with args " + args);
		jjvm.core.NotificationCentre.dispatch(this, eventType, args);
	}
};
jjvm.core.NotificationCentre = {
	_listeners: {},

	register: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			jjvm.core.NotificationCentre._listeners[eventType] = [];
		}

		jjvm.core.NotificationCentre._listeners[eventType].push(listener);
	},

	deRegister: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		for(var i = 0; i < jjvm.core.NotificationCentre._listeners[eventType].length; i++) {
			if(jjvm.core.NotificationCentre._listeners[eventType][i] == listener) {
				jjvm.core.NotificationCentre._listeners[eventType].splice(i, 1);
				i--;
			}
		}
	},

	dispatch: function(sender, eventType, args) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		if(!args) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.NotificationCentre#dispatch as args";
		}

		var observerArgs = [sender];
		observerArgs = observerArgs.concat(args);

		// copy the array in case the listener deregisters itself as part of the callback
		var observers = jjvm.core.NotificationCentre._listeners[eventType].concat([]);

		for(var i = 0; i < observers.length; i++) {
			observers[i].apply(observers[i], observerArgs);
		}
	}
};

jjvm.ui.ClassDropper = function(element) {
	
	this.onDragEnter = function(event) {
		event.preventDefault();

		$(element).addClass("dragging");
	};

	this.onDragExit = function(event) {
		event.preventDefault();	

		$(element).removeClass("dragging");
	};

	this.onDragOver = function(event) {
		event.preventDefault();
	};

	this.onDrop = function(event) {
		event.preventDefault();

		$(element).removeClass("dragging");

		var files = event.originalEvent.dataTransfer.files;

		for(var i = 0; i < files.length; i++) {
			jjvm.ui.JJVM.jvm.compile(files[i]);
		}
	};

	$(element).on("dragenter", _.bind(this.onDragEnter, this));
	$(element).on("dragexit", _.bind(this.onDragExit, this));
	$(element).on("dragover", _.bind(this.onDragOver, this));
	$(element).on("drop", _.bind(this.onDrop, this));
};

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

jjvm.ui.Console = function(element) {
	$(element).find("button").click(_.bind(function(event) {
		event.preventDefault();
		this.clear();
	}, this));

	this.debug = function(message) {
		console.debug(message);
		this._addLogLine(message, "muted", "icon-wrench");
	};

	this.info = function(message) {
		console.info(message);
		this._addLogLine(message, "text-info", "icon-info-sign");
	};

	this.warn = function(message) {
		console.warn(message);
		this._addLogLine(message, "text-warning", "icon-exclamation-sign");
	};

	this.error = function(message) {
		console.error(message);
		this._addLogLine(message, "text-error", "icon-remove-sign");
	};

	this.clear = function() {
		$(element).find("ul").empty();
	};

	this._addLogLine = function(message, cssClass, iconClass) {
		var icon = document.createElement("i");
		icon.className = "icon-white " + iconClass;

		var logLine = document.createElement("li");
		logLine.className = cssClass;
		logLine.appendChild(icon);
		logLine.appendChild(document.createTextNode(" " + message));

		$(element).find("ul").append(logLine);

		$(element).scrollTop($(element)[0].scrollHeight);
	};
};

jjvm.ui.FrameWatcher = function(localVariableTable, stackTable, title) {
	
	this._update = function(frame) {
		if(frame.isSystemFrame) {
			return;
		}

		this._updateLocalVariableTable(frame.localVariables);
		this._updateStackTable(frame.stack);

		$(title).empty();
		$(title).append(_.escape(frame.className + "#" + frame.methodSignature));
	};

	this._updateLocalVariableTable = function(localVariables) {
		$(localVariableTable).empty();
		var topRow = $("<tr></tr>");
		var bottomRow = $("<tr></tr>");
		var thead = $("<thead></thead>");
		$(thead).append(topRow);
		var tbody = $("<tbody></tbody>");
		$(tbody).append(bottomRow);
		$(localVariableTable).append(thead);
		$(localVariableTable).append(tbody);

		$.each(localVariables, function(index, entry) {
			$(topRow).append("<th>" + index + "</th>");
			$(bottomRow).append("<td>" + entry + "</td>");
		});
	};

	this._updateStackTable = function(stack) {
		$(stackTable).empty();
		
		var tbody = $("<tbody></tbody>");
		$(stackTable).append(tbody);

		var minItems = 5 - stack.length;

		for(var i = 0; i < minItems; i++) {
			$(tbody).append("<tr><td>&nbsp;</td></tr>");
		}

		for(var n = (stack.length -1); n >= 0; n--) {
			$(tbody).append("<tr><td>" + stack[n] + "</td></tr>");
		}
	};

	jjvm.core.NotificationCentre.register("onInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onBeforeInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onAfterInstructionExecution", _.bind(function(_, frame) {
		this._update(frame);
	}, this));
	jjvm.core.NotificationCentre.register("onCurrentFrameChanged", _.bind(function(_, thread, frame) {
		this._update(frame);
	}, this));
};

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
		$("#button_drop_to_frame").attr("disabled", true);

		// set up debug button listeners
		$("#button_resume").click(function() {
			jjvm.ui.JJVM.jvm.resumeExecution();
		});
		$("#button_pause").click(function() {
			jjvm.ui.JJVM.jvm.suspendExecution();
		});
		$("#button_step_over").click(function() {
			jjvm.ui.JJVM.jvm.stepOver(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
		});
		$("#button_step_into").click(function() {
			jjvm.ui.JJVM.jvm.stepInto(jjvm.ui.JJVM._threadWatcher.getSelectedThread().name);
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
			console.info("encountered breakpoint");

			$("#button_run").attr("disabled", true);
			$("#button_resume").removeAttr("disabled");
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").removeAttr("disabled");
			$("#button_step_into").removeAttr("disabled");
			$("#button_drop_to_frame").removeAttr("disabled");
		});

		jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
			// reset buttons
			$("#button_run").removeAttr("disabled");
			$("#button_resume").attr("disabled", true);
			$("#button_pause").attr("disabled", true);
			$("#button_step_over").attr("disabled", true);
			$("#button_step_into").attr("disabled", true);
			$("#button_drop_to_frame").attr("disabled", true);
		});

		jjvm.core.NotificationCentre.register("onExecutionStarted", function() {
			$("#button_run").attr("disabled", true);
			$("#button_resume").attr("disabled", true);
			$("#button_pause").removeAttr("disabled");
			$("#button_step_over").attr("disabled", true);
			$("#button_step_into").attr("disabled", true);
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
jjvm.ui.JVM = function() {
	var _worker = new Worker("js/jjvm_compiler_worker.js");

	_worker.onmessage = function(event) {
		var actions = {
			"postNotification": function(type, args) {
				jjvm.core.NotificationCentre.dispatch(this, type, args);
			},
			"consoleError": function(message) {
				jjvm.ui.JJVM.console.error(message);
			},
			"consoleWarn": function(message) {
				jjvm.ui.JJVM.console.warn(message);
			},
			"consoleInfo": function(message) {
				jjvm.ui.JJVM.console.info(message);
			},
			"consoleDebug": function(message) {
				jjvm.ui.JJVM.console.debug(message);
			},
			"getThreads": function(threads) {
				jjvm.core.NotificationCentre.dispatch(this, "onGotThreads", [threads]);
			}
		};

		var args = JSON.parse(event.data.args);

		if(actions[event.data.action]) {
			actions[event.data.action].apply(actions[event.data.action], args);
		} else {
			console.error("Unknown action from worker " + event.data.action);
		}
	};

	// takes a File or Blob object
	this.compile = function(file) {
		var reader = new FileReader();

		// init the reader event handlers
		reader.onload = _.bind(this._onFileLoaded, this, file);

		// begin the read operation
		reader.readAsArrayBuffer(file);
	};

	this._onFileLoaded = function(file, event) {
		_worker.postMessage({
			action: "compile",
			args: [new Uint8Array(event.target.result)]
		});
	};

	this.run = function(args) {
		_worker.postMessage({
			action: "run",
			args: [args]
		});
	};

	this.setBreakpoint = function(className, methodSignature, instructionIndex, setBreakpoint) {
		_worker.postMessage({
			action: "setBreakpoint",
			args: [className, methodSignature, instructionIndex, setBreakpoint]
		});
	};

	this.resumeExecution = function() {
		_worker.postMessage({
			action: "resumeExecution",
			args: []
		});	
	};

	this.suspendExecution = function() {
		_worker.postMessage({
			action: "suspendExecution",
			args: []
		});	
	};

	this.stepOver = function(threadName) {
		_worker.postMessage({
			action: "stepOver",
			args: [threadName]
		});	
	};

	this.stepInto = function(threadName) {
		_worker.postMessage({
			action: "stepInto",
			args: [threadName]
		});	
	};

	this.dropToFrame = function(threadName) {
		_worker.postMessage({
			action: "dropToFrame",
			args: [threadName]
		});	
	};

	this.getThreads = function() {
		_worker.postMessage({
			action: "getThreads",
			args: []
		});	
	};
};

jjvm.ui.ThreadWatcher = function(list) {
	var _selectedThread;

	this.getSelectedThread = function() {
		return _selectedThread;
	};

	this.setSelectedThread = function(thread) {
		_selectedThread = thread;
	};

	this._update = function(sender, threads) {
		$(list).empty();

		_.each(threads, _.bind(function(thread) {
			if(!_selectedThread) {
				_selectedThread = thread;
			}

			this._addThread(thread);
		}, this));
	};

	this._addThread = function(thread) {
		var threadName;

		if(_selectedThread == thread) {
			threadName = jjvm.core.DOMUtil.create("span", 
				jjvm.core.DOMUtil.create("i", thread.name, {className: "icon-arrow-right icon-white"})
			);
		} else {
			threadName = jjvm.core.DOMUtil.create("a", thread.name);

			threadName.onclick = _.bind(function(event) {
				event.preventDefault();

				_selectedThread = thread;
				//this._update();
			}, this);
		}

		var li = jjvm.core.DOMUtil.create("li", threadName);

		if(thread.status == "RUNNABLE") {
			threadName.className += " text-success";
		} else if(thread.status == "TERMINATED") {
			threadName.className += " muted";
		} else if(thread.status == "NEW") {
			threadName.className += " text-info";
		} else if(thread.status == "BLOCKED") {
			threadName.className += " text-error";
		} else if(thread.status == "WAITING") {
			threadName.className += " text-warn";
		} else if(thread.status == "TIMED_WAITING") {
			threadName.className += " text-warn";
		}

		var frameList = jjvm.core.DOMUtil.create("ul");

		_.each(thread.frames, function(frame) {
			frameList.appendChild(jjvm.core.DOMUtil.create("li", frame.className + "#" + frame.methodSignature));
		});

		li.appendChild(frameList);
		$(list).append(li);
	};

	jjvm.core.NotificationCentre.register("onGotThreads", _.bind(this._update, this));
	jjvm.core.NotificationCentre.register("onBreakpointEncountered", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onExecutionStarted", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onExecutionComplete", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
	jjvm.core.NotificationCentre.register("onThreadGC", function() {
		jjvm.ui.JJVM.jvm.getThreads();
	});
};

jjvm.compiler.AttributesParser = function(iterator, constantPool) {
	
	this.parse = function(iterator, constantPool) {
		var attributeCount = iterator.readU16();

		this.onAttributeCount(attributeCount);

		for(var n = 0; n < attributeCount; n++) {
			var attributeName = constantPool.load(iterator.readU16()).getValue();
			var attributeLength = iterator.readU32();
			var attributeStart = iterator.getLocation();

			var nextPosition = iterator.getLocation() + attributeLength;

			if(this["on" + attributeName]) {
				this["on" + attributeName](iterator, constantPool);
			} else {
				this.onUnrecognisedAttribute(attributeName);
			}

			// make sure we've consumed the attribute
			var read = iterator.getLocation() - attributeStart;

			if(read != attributeLength) {
				//jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Short read of " + attributeName + " read " + read + " of " + attributeLength + " bytes"]);
			}

			iterator.jump(nextPosition);
		}
	};

	this.onAttributeCount = function(attributeCount) {

	};

	this.onUnrecognisedAttribute = function(attributeName) {

	};

	this.toString = function() {
		return "AttributesParser";
	};
};
jjvm.compiler.BlockParser = function() {

	this.parseBlock = function(iterator, constantsPool, length, parser) {
		//console.info("parsing block of length " + length + " with " + parser);
		var block = iterator.getIterable().subarray(iterator.getLocation(), iterator.getLocation() + length);
		var blockIterator = new jjvm.core.ByteIterator(block);

		// skip to end of block
		iterator.jump(iterator.getLocation() + length);

		// parse block
		return parser.parse(blockIterator, constantsPool);
	};

	this.readEmptyBlock = function(attributeName, iterator, expectedLength) {
		if(expectedLength === undefined) {
			expectedLength = 0;
		}

		var attributeLength = iterator.readU32();

		if(attributeLength !== expectedLength) {
			throw attributeName + " attribute should have length " + expectedLength + "! found " + attributeLength;
		}
	};

	this.toString = function() {
		return "BlockParser";
	};
};
jjvm.compiler.ByteCodeParser = function() {

	var _bytecode_mapping = {
		0x00: {
			mnemonic: "nop",
			operation: "nop",
			args: []
		},
		0x01: {
			mnemonic: "aconst_null",
			operation: "push",
			args: [null]
		},
		0x02: {
			mnemonic: "iconst_m1",
			operation: "push",
			args: [-1]
		},
		0x03: {
			mnemonic: "iconst_0",
			operation: "push",
			args: [0]
		},
		0x04: {
			mnemonic: "iconst_1",
			operation: "push",
			args: [1]
		},
		0x05: {
			mnemonic: "iconst_2",
			operation: "push",
			args: [2]
		},
		0x06: {
			mnemonic: "iconst_3",
			operation: "push",
			args: [3]
		},
		0x07: {
			mnemonic: "iconst_4",
			operation: "push",
			args: [4]
		},
		0x08: {
			mnemonic: "iconst_5",
			operation: "push",
			args: [5]
		},
		0x09: {
			mnemonic: "lconst_0",
			operation: "push",
			args: [0]
		},
		0x0A: {
			mnemonic: "lconst_1",
			operation: "push",
			args: [1]
		},
		0x0B: {
			mnemonic: "fconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0C: {
			mnemonic: "fconst_1",
			operation: "push",
			args: [1.0]
		},
		0x0D: {
			mnemonic: "fconst_2",
			operation: "push",
			args: [2.0]
		},
		0x0E: {
			mnemonic: "dconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0F: {
			mnemonic: "dconst_1",
			operation: "push",
			args: [1.0]
		},
		0x10: {
			mnemonic: "bipush",
			operation: "push",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x11: {
			mnemonic: "sipush",
			operation: "push",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x12: {
			mnemonic: "ldc",
			operation: "push_constant",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				var value = constantPool.load(args[0]).getValue();

				return this.mnemonic + "\t\t// #" + args[0] + " " + constantPool.load(args[0]).getValue();
			}
		},
		0x13: {
			mnemonic: "ldc_w",
			operation: "push_constant",
			index: null,
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + "\t\t// #" + args[0] + " " + constantPool.load(args[0]).getValue();
			}
		},
		0x14: {
			mnemonic: "ldc2_w",
			operation: "push_constant",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + "\t\t// #" + args[0] + " " + constantPool.load(args[0]).getValue();
			}
		},
		0x15: {
			mnemonic: "iload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x16: {
			mnemonic: "lload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x17: {
			mnemonic: "fload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x18: {
			mnemonic: "dload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x19: {
			mnemonic: "aload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x1A: {
			mnemonic: "iload_0",
			operation: "load",
			args: [0]
		},
		0x1B: {
			mnemonic: "iload_1",
			operation: "load",
			args: [1]
		},
		0x1C: {
			mnemonic: "iload_2",
			operation: "load",
			args: [2]
		},
		0x1D: {
			mnemonic: "iload_3",
			operation: "load",
			args: [3]
		},
		0x1E: {
			mnemonic: "lload_0",
			operation: "load",
			args: [0]
		},
		0x1F: {
			mnemonic: "lload_1",
			operation: "load",
			args: [1]
		},
		0x20: {
			mnemonic: "lload_2",
			operation: "load",
			args: [2]
		},
		0x21: {
			mnemonic: "lload_3",
			operation: "load",
			args: [3]
		},
		0x22: {
			mnemonic: "fload_0",
			operation: "load",
			args: [0.0]
		},
		0x23: {
			mnemonic: "fload_1",
			operation: "load",
			args: [1.0]
		},
		0x24: {
			mnemonic: "fload_2",
			operation: "load",
			args: [2.0]
		},
		0x25: {
			mnemonic: "fload_3",
			operation: "load",
			args: [3.0]
		},
		0x26: {
			mnemonic: "dload_0",
			operation: "load",
			args: [0.0]
		},
		0x27: {
			mnemonic: "dload_1",
			operation: "load",
			args: [1.0]
		},
		0x28: {
			mnemonic: "dload_2",
			operation: "load",
			args: [2.0]
		},
		0x29: {
			mnemonic: "dload_3",
			operation: "load",
			args: [3.0]
		},
		0x2A: {
			mnemonic: "aload_0",
			operation: "load",
			args: [0]
		},
		0x2B: {
			mnemonic: "aload_1",
			operation: "load",
			args: [1]
		},
		0x2C: {
			mnemonic: "aload_2",
			operation: "load",
			args: [2]
		},
		0x2D: {
			mnemonic: "aload_3",
			operation: "load",
			args: [3]
		},
		0x2E: {
			mnemonic: "iaload",
			operation: "array_load",
			args: []
		},
		0x2F: {
			mnemonic: "laload",
			operation: "array_load",
			args: []
		},
		0x30: {
			mnemonic: "faload",
			operation: "array_load",
			args: []
		},
		0x31: {
			mnemonic: "daload",
			operation: "array_load",
			args: []
		},
		0x32: {
			mnemonic: "aaload",
			operation: "array_load",
			args: []
		},
		0x33: {
			mnemonic: "baload",
			operation: "array_load",
			args: []
		},
		0x34: {
			mnemonic: "caload",
			operation: "array_load_character",
			args: []
		},
		0x35: {
			mnemonic: "saload",
			operation: "array_load",
			args: []
		},
		0x36: {
			mnemonic: "istore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x37: {
			mnemonic: "lstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x38: {
			mnemonic: "fstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x39: {
			mnemonic: "dstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x3A: {
			mnemonic: "dstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x3B: {
			mnemonic: "istore_0",
			operation: "store",
			args: [0]
		},
		0x3C: {
			mnemonic: "istore_1",
			operation: "store",
			args: [1]
		},
		0x3D: {
			mnemonic: "istore_2",
			operation: "store",
			args: [2]
		},
		0x3E: {
			mnemonic: "istore_3",
			operation: "store",
			args: [3]
		},
		0x3F: {
			mnemonic: "lstore_0",
			operation: "store",
			args: [0]
		},
		0x40: {
			mnemonic: "lstore_1",
			operation: "store",
			args: [1]
		},
		0x41: {
			mnemonic: "lstore_2",
			operation: "store",
			args: [2]
		},
		0x42: {
			mnemonic: "lstore_3",
			operation: "store",
			args: [3]
		},
		0x43: {
			mnemonic: "fstore_0",
			operation: "store",
			args: [0.0]
		},
		0x44: {
			mnemonic: "fstore_1",
			operation: "store",
			args: [1.0]
		},
		0x45: {
			mnemonic: "fstore_2",
			operation: "store",
			args: [2.0]
		},
		0x46: {
			mnemonic: "fstore_3",
			operation: "store",
			args: [3.0]
		},
		0x47: {
			mnemonic: "dstore_0",
			operation: "store",
			args: [0.0]
		},
		0x48: {
			mnemonic: "dstore_1",
			operation: "store",
			args: [1.0]
		},
		0x49: {
			mnemonic: "dstore_2",
			operation: "store",
			args: [2.0]
		},
		0x4A: {
			mnemonic: "dstore_3",
			operation: "store",
			args: [3.0]
		},
		0x4B: {
			mnemonic: "astore_0",
			operation: "store",
			args: [0.0]
		},
		0x4C: {
			mnemonic: "astore_1",
			operation: "store",
			args: [1.0]
		},
		0x4D: {
			mnemonic: "astore_2",
			operation: "store",
			args: [2.0]
		},
		0x4E: {
			mnemonic: "astore_3",
			operation: "store",
			args: [3.0]
		},
		0x4F: {
			mnemonic: "iastore",
			operation: "array_store",
			args: []
		},
		0x50: {
			mnemonic: "lastore",
			operation: "array_store",
			args: []
		},
		0x51: {
			mnemonic: "fastore",
			operation: "array_store",
			args: []
		},
		0x52: {
			mnemonic: "dastore",
			operation: "array_store",
			args: []
		},
		0x53: {
			mnemonic: "aastore",
			operation: "array_store",
			args: []
		},
		0x54: {
			mnemonic: "bastore",
			operation: "array_store",
			args: []
		},
		0x55: {
			mnemonic: "castore",
			operation: "array_store_character",
			args: []
		},
		0x56: {
			mnemonic: "sastore",
			operation: "array_store",
			args: []
		},
		0x57: {
			mnemonic: "pop",
			operation: "pop",
			args: []
		},
		0x58: {
			mnemonic: "pop2",
			operation: "pop2",
			args: []
		},
		0x59: {
			mnemonic: "dup",
			operation: "dup",
			args: []
		},
		0x5A: {
			mnemonic: "dup_x1",
			operation: "dup_x1",
			args: []
		},
		0x5B: {
			mnemonic: "dup_x2",
			operation: "dup_x2",
			args: []
		},
		0x5C: {
			mnemonic: "dup2",
			operation: "dup2",
			args: []
		},
		0x5D: {
			mnemonic: "dup2_x1",
			operation: "dup2_x1",
			args: []
		},
		0x5E: {
			mnemonic: "dup2_x2",
			operation: "dup2_x2",
			args: []
		},
		0x5F: {
			mnemonic: "swap",
			operation: "swap",
			args: []
		},
		0x60: {
			mnemonic: "iadd",
			operation: "add",
			args: []
		},
		0x61: {
			mnemonic: "ladd",
			operation: "add",
			args: []
		},
		0x62: {
			mnemonic: "fadd",
			operation: "add",
			args: []
		},
		0x63: {
			mnemonic: "dadd",
			operation: "add",
			args: []
		},
		0x64: {
			mnemonic: "isub",
			operation: "sub",
			args: []
		},
		0x65: {
			mnemonic: "lsub",
			operation: "sub",
			args: []
		},
		0x66: {
			mnemonic: "fsub",
			operation: "sub",
			args: []
		},
		0x67: {
			mnemonic: "dsub",
			operation: "sub",
			args: []
		},
		0x68: {
			mnemonic: "imul",
			operation: "mul",
			args: []
		},
		0x69: {
			mnemonic: "lmul",
			operation: "mul",
			args: []
		},
		0x6A: {
			mnemonic: "fmul",
			operation: "mul",
			args: []
		},
		0x6B: {
			mnemonic: "dmul",
			operation: "mul",
			args: []
		},
		0x6C: {
			mnemonic: "idiv",
			operation: "div",
			args: []
		},
		0x6D: {
			mnemonic: "ldiv",
			operation: "div",
			args: []
		},
		0x6E: {
			mnemonic: "fdiv",
			operation: "div",
			args: []
		},
		0x6F: {
			mnemonic: "ddiv",
			operation: "div",
			args: []
		},
		0x70: {
			mnemonic: "irem",
			operation: "rem",
			args: []
		},
		0x71: {
			mnemonic: "lrem",
			operation: "rem",
			args: []
		},
		0x72: {
			mnemonic: "frem",
			operation: "rem",
			args: []
		},
		0x73: {
			mnemonic: "drem",
			operation: "rem",
			args: []
		},
		0x74: {
			mnemonic: "ineg",
			operation: "neg",
			args: []
		},
		0x75: {
			mnemonic: "lneg",
			operation: "neg",
			args: []
		},
		0x76: {
			mnemonic: "fneg",
			operation: "neg",
			args: []
		},
		0x77: {
			mnemonic: "dneg",
			operation: "neg",
			args: []
		},
		0x78: {
			mnemonic: "ishl",
			operation: "shift_left",
			args: []
		},
		0x79: {
			mnemonic: "lshl",
			operation: "shift_left",
			args: []
		},
		0x7A: {
			mnemonic: "ishr",
			operation: "arithmetic_shift_right",
			args: []
		},
		0x7B: {
			mnemonic: "lshr",
			operation: "arithmetic_shift_right",
			args: []
		},
		0x7C: {
			mnemonic: "iushr",
			operation: "logical_shift_right",
			args: []
		},
		0x7D: {
			mnemonic: "lushr",
			operation: "logical_shift_right",
			args: []
		},
		0x7E: {
			mnemonic: "iand",
			operation: "and",
			args: []
		},
		0x7F: {
			mnemonic: "land",
			operation: "and",
			args: []
		},
		0x80: {
			mnemonic: "ior",
			operation: "or",
			args: []
		},
		0x81: {
			mnemonic: "lor",
			operation: "or",
			args: []
		},
		0x82: {
			mnemonic: "ixor",
			operation: "xor",
			args: []
		},
		0x83: {
			mnemonic: "lxor",
			operation: "xor",
			args: []
		},
		0x84: {
			mnemonic: "iinc",
			operation: "increment",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8(), iterator.read8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1];
			}
		},
		0x85: {
			mnemonic: "i2l",
			operation: "convert",
			args: []
		},
		0x86: {
			mnemonic: "i2f",
			operation: "convert",
			args: []
		},
		0x87: {
			mnemonic: "i2d",
			operation: "convert",
			args: []
		},
		0x88: {
			mnemonic: "l2i",
			operation: "convert",
			args: []
		},
		0x89: {
			mnemonic: "l2f",
			operation: "convert",
			args: []
		},
		0x8A: {
			mnemonic: "l2d",
			operation: "convert",
			args: []
		},
		0x8B: {
			mnemonic: "f2i",
			operation: "convert",
			args: []
		},
		0x8C: {
			mnemonic: "f2l",
			operation: "convert",
			args: []
		},
		0x8D: {
			mnemonic: "f2d",
			operation: "convert",
			args: []
		},
		0x8E: {
			mnemonic: "d2i",
			operation: "convert",
			args: []
		},
		0x8F: {
			mnemonic: "d2l",
			operation: "convert",
			args: []
		},
		0x90: {
			mnemonic: "d2f",
			operation: "convert",
			args: []
		},
		0x91: {
			mnemonic: "i2b",
			operation: "convert_to_boolean",
			args: []
		},
		0x92: {
			mnemonic: "i2c",
			operation: "convert",
			args: []
		},
		0x93: {
			mnemonic: "i2s",
			operation: "convert",
			args: []
		},
		0x94: {
			mnemonic: "lcmp",
			operation: "compare",
			args: []
		},
		0x95: {
			mnemonic: "fcmpl",
			operation: "compare",
			args: []
		},
		0x96: {
			mnemonic: "fcmpg",
			operation: "compare",
			args: []
		},
		0x97: {
			mnemonic: "dcmpl",
			operation: "compare",
			args: []
		},
		0x98: {
			mnemonic: "dcmpg",
			operation: "compare",
			args: []
		},
		0x99: {
			mnemonic: "ifeq",
			operation: "if_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9A: {
			mnemonic: "ifne",
			operation: "if_not_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9B: {
			mnemonic: "iflt",
			operation: "if_less_than_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9C: {
			mnemonic: "ifge",
			operation: "if_greater_than_or_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9D: {
			mnemonic: "ifgt",
			operation: "if_greater_than_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9E: {
			mnemonic: "ifle",
			operation: "if_less_than_or_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9F: {
			mnemonic: "if_icmpeq",
			operation: "if_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA0: {
			mnemonic: "if_icmpne",
			operation: "if_not_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA1: {
			mnemonic: "if_icmplt",
			operation: "if_less_than",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA2: {
			mnemonic: "if_icmpge",
			operation: "if_greater_than_or_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA3: {
			mnemonic: "if_icmpgt",
			operation: "if_greater_than",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA4: {
			mnemonic: "if_icmple",
			operation: "if_less_than_or_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA5: {
			mnemonic: "if_acmpeq",
			operation: "if_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA6: {
			mnemonic: "if_acmpne",
			operation: "if_not_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA7: {
			mnemonic: "goto",
			operation: "goto",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA8: {
			mnemonic: "jsr",
			operation: "jsr",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA9: {
			mnemonic: "ret",
			operation: "ret",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xAA: {
			mnemonic: "tableswitch",
			operation: "tableswitch",
			args: function(iterator, constantPool, location) {
				var default_offset;

				// there are 0-3 bytes of padding before default_offset
				for(var i = 0; i < 3; i++) {
					default_offset = iterator.readU8();

					// fewer than three bytes!
					if(default_offset !== 0) {
						break;
					}
				}

				if(default_offset === 0 || default_offset === undefined) {
					default_offset = iterator.readU32();
				}

				var low = iterator.readU32();
				var high = iterator.readU32();
				var table = [];

				for(var n = 0; n < (low - high) + 1; i++) {
					table.push(iterator.readU32());
				}

				return [
					low,
					high,
					table
				];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1] + " " + args[2];
			}
		},
		0xAB: {
			mnemonic: "lookupswitch",
			operation: "lookupswitch",
			args: function(iterator, constantPool, location) {
				var default_offset;

				// there are 0-3 bytes of padding before default_offset
				for(var i = 0; i < 3; i++) {
					default_offset = iterator.readU8();

					// fewer than three bytes!
					if(default_offset !== 0) {
						break;
					}
				}

				if(default_offset === 0 || default_offset === undefined) {
					default_offset = iterator.readU32();
				}

				var keys = iterator.readU32();
				var table = {};

				for(var n = 0; n < keys; i++) {
					table[iterator.readU32()] = iterator.readU32();
				}

				return [table];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xAC: {
			mnemonic: "ireturn",
			operation: "return_value",
			args: []
		},
		0xAD: {
			mnemonic: "lreturn",
			operation: "return_value",
			args: []
		},
		0xAE: {
			mnemonic: "flreturn",
			operation: "return_value",
			args: []
		},
		0xAF: {
			mnemonic: "dreturn",
			operation: "return_value",
			args: []
		},
		0xB0: {
			mnemonic: "areturn",
			operation: "return_value",
			args: []
		},
		0xB1: {
			mnemonic: "return",
			operation: "return_void",
			args: []
		},
		0xB2: {
			mnemonic: "getstatic",
			operation: "get_static",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + "; // " + constantPool.load(args[0]);
			}
		},
		0xB3: {
			mnemonic: "putstatic",
			operation: "put_static",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + "; // " + constantPool.load(args[0]);
			}
		},
		0xB4: {
			mnemonic: "getfield",
			operation: "get_field",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + "; // " + constantPool.load(args[0]);
			}
		},
		0xB5: {
			mnemonic: "putfield",
			operation: "put_field",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB6: {
			mnemonic: "invokevirtual",
			operation: "invoke_virtual",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB7: {
			mnemonic: "invokespecial",
			operation: "invoke_special",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB8: {
			mnemonic: "invokestatic",
			operation: "invoke_static",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB9: {
			mnemonic: "invokeinterface",
			operation: "invoke_interface",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16(), iterator.readU8(), iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				var method = constantPool.load(args[0]);
				var numArgs = args[1];

				return this.mnemonic + " // " + method;
			}
		},
		0xBA: {
			mnemonic: "invokedynamic",
			operation: "invoke_dynamic",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xBB: {
			mnemonic: "new",
			operation: "new",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xBC: {
			mnemonic: "newarray",
			operation: "array_create",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				var types = [];
				types[4] = "boolean";
				types[5] = "char";
				types[6] = "float";
				types[7] = "double";
				types[8] = "byte";
				types[9] = "short";
				types[10] = "int";
				types[11] = "long";

				return this.mnemonic + " " + types[args[0]];
			}
		},
		0xBD: {
			mnemonic: "anewarray",
			operation: "array_create",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xBE: {
			mnemonic: "arraylength",
			operation: "array_length",
			args: []
		},
		0xBF: {
			mnemonic: "athrow",
			operation: "throw",
			args: []
		},
		0xC0: {
			mnemonic: "checkcast",
			operation: "check_cast",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xC1: {
			mnemonic: "instanceof",
			operation: "instance_of",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xC2: {
			mnemonic: "monitorenter",
			operation: "monitor_enter",
			args: []
		},
		0xC3: {
			mnemonic: "monitorexit",
			operation: "monitor_exit",
			args: []
		},
		0xC4: {
			mnemonic: "wide",
			operation: "wide",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8(), iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1];
			}
		},
		0xC5: {
			mnemonic: "multianewarray",
			operation: "multi_dimensional_array_create",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16(), iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1];
			}
		},
		0xC6: {
			mnemonic: "ifnull",
			operation: "if_null",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xC7: {
			mnemonic: "ifnonnull",
			operation: "if_non_null",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xC8: {
			mnemonic: "goto_w",
			operation: "goto",
			args: function(iterator, constantPool, location) {
				return [iterator.read32() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xC9: {
			mnemonic: "jsr_w",
			operation: "jsr",
			args: function(iterator, constantPool, location) {
				return [iterator.readU32() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xCA: {
			mnemonic: "breakpoint",
			operation: "nop",
			args: []
		},
		0xFE: {
			mnemonic: "impdep1",
			operation: "nop",
			args: []
		},
		0xFF: {
			mnemonic: "impdep2",
			operation: "nop",
			args: []
		}
	};

	this._createArgFunction = function(code, args, constantPool) {
		return function() {
			return _bytecode_mapping[code].args(args, constantPool);
		};
	};

	this._createDefaultArgFunction = function(code) {
		return function() {
			return _bytecode_mapping[code].args;
		};
	};

	this.parse = function(iterator, constantPool) {
		var instructions = [];

		while(iterator.hasNext()) {
			var location = iterator.getLocation();
			var code = iterator.readU8();

			if(!_bytecode_mapping[code]) {
				console.warn("No bytecode mapping for " + code.toString(16) + " mapping to nop");

				_bytecode_mapping[code] = {
					mnemonic: "undefined " + code.toString(16),
					operation: "nop",
					args: []
				};
			}

			var args = _bytecode_mapping[code].args;

			if(_bytecode_mapping[code].args instanceof Function) {
				args = _bytecode_mapping[code].args(iterator, constantPool, location);
			}

			var description = _bytecode_mapping[code].mnemonic;

			if(_bytecode_mapping[code].description instanceof Function) {
				// read any values from the iterator as necessary
				description = _bytecode_mapping[code].description(args, constantPool, location);
			}

			var byteCode = new jjvm.types.ByteCode();
			byteCode.setMnemonic(_bytecode_mapping[code].mnemonic);
			byteCode.setArgs(args);
			byteCode.setLocation(location);
			byteCode.setDescription(description);
			byteCode.setOperation(_bytecode_mapping[code].operation);

			instructions.push(byteCode);
		}

		return instructions;
	};

	this.toString = function() {
		return "ByteCodeParser";
	};
};

jjvm.compiler.ClassDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var constantPoolParser = new jjvm.compiler.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.MethodDefinitionParser();
	var innerClassesParser = new jjvm.compiler.InnerClassesParser();
	var enclosingMethodParser = new jjvm.compiler.EnclosingMethodParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator) {
		var classDef = new jjvm.types.ClassDefinition();
		classDef.setMinorVersion(iterator.readU16());
		classDef.setMajorVersion(iterator.readU16());

		var constantPool = constantPoolParser.parse(iterator);
		classDef.setConstantPool(constantPool);

		var accessFlags = iterator.readU16();

		if(accessFlags & 0x0001) {
			classDef.setVisibility("public");
		}

		classDef.setIsFinal(accessFlags & 0x0010);
		classDef.setIsSuper(accessFlags & 0x0020);
		classDef.setIsInterface(accessFlags & 0x0200);
		classDef.setIsAbstract(accessFlags & 0x0400);
		classDef.setName(this._loadClassName(iterator, constantPool));
		classDef.setParent(this._loadClassName(iterator, constantPool));

		var interfaceCount = iterator.readU16();

		for(var i = 0; i < interfaceCount; i++) {
			classDef.addInterface(this._loadClassName(iterator, constantPool));
		}

		this.parseFields(iterator, classDef, constantPool);
		this.parseMethods(iterator, classDef, constantPool);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("class " + name + " has " + attributeCount + " attribtues");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Class " + name + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onSourceFile = function(iterator, constantPool) {
			var sourceFileName = constantPool.load(iterator.readU16()).getValue();
			classDef.setSourceFile(sourceFileName);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Deprecated", iterator);
			classDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Synthetic", iterator);
			classDef.setSynthetic(true);
		};
		attributesParser.onInnerClasses = function(iterator, constantPool) {
			blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, innerClassesParser);
		};
		attributesParser.onEnclosingMethod = function(iterator, constantPool) {
			var enclosingMethod = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), enclosingMethodParser);
			classDef.setEnclosingMethod(enclosingMethod);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return classDef;
	};

	this.parseFields = function(iterator, classDef, constantPool) {
		var fieldCount = iterator.readU16();

		for(var i = 0; i < fieldCount; i++) {
			classDef.addField(fieldDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.parseMethods = function(iterator, classDef, constantPool) {
		var methodCount = iterator.readU16();

		for(var i = 0; i < methodCount; i++) {
			classDef.addMethod(methodDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.toString = function() {
		return "ClassDefinitionParser";
	};
};

jjvm.compiler.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.ClassDefinitionParser();

	this.compileSystemBytes = function(buffer) {
		this._compileBytes(buffer, true);
	};

	this.compileBytes = function(buffer) {
		this._compileBytes(buffer);
	};

	this._compileBytes = function(buffer, isSystemClass) {
		try {
			if(!(buffer instanceof Uint8Array)) {
				buffer = new Uint8Array(buffer);				
			}

			var iterator = new jjvm.core.ByteIterator(buffer);

			if(!this._isClassFile(iterator)) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["No bytecode found"]);

				return;
			}

			var classDef = classDefinitionParser.parse(iterator);

			if(isSystemClass) {
				jjvm.core.SystemClassLoader.addClassDefinition(classDef);

				// jjvm.core.ClassCache.store(classDef);
			} else {
				jjvm.core.ClassLoader.addClassDefinition(classDef);
			}

			jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef.getData(), isSystemClass]);
			jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			console.error(error);

			jjvm.core.NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};

	this._isClassFile = function(iterator) {
		var value = iterator.readU32();

		return value == 0xCAFEBABE;
	};
};

jjvm.compiler.ConstantPoolParser = function() {

	this.parse = function(iterator) {
		var poolSize = iterator.readU16();
		var pool = new jjvm.types.ConstantPool();
		var table = new jjvm.core.ByteIterator(iterator.getIterable().subarray(10));

		var nameAndTypeValues = [];
		var classValues = [];
		var methodValues = [];
		var fieldValues = [];
		var stringReferenceValues = [];

		// pass 1, populate all primitive values
		for(var i = 1; i < poolSize; i++) {
			var tag = iterator.next();
			var value;

			if(tag == 0x01) {
				value = this._createStringValue(iterator, pool);
			} else if(tag == 0x03) {
				value = this._createIntValue(iterator, pool);
			} else if(tag == 0x04) {
				value =this._createFloatValue(iterator, pool);
			} else if(tag == 0x05) {
				value = this._createLongValue(iterator, pool);
			} else if(tag == 0x06) {
				value = this._createDoubleValue(iterator, pool);
			} else if(tag == 0x07) {
				value = this._createClassValue(iterator, pool);

				classValues.push(value);
			} else if(tag == 0x08) {
				value = this._createStringReferenceValue(iterator, pool);

				stringReferenceValues.push(value);
			} else if(tag == 0x09) {
				value = this._createFieldValue(iterator, pool);

				fieldValues.push(value);
			} else if(tag == 0x0A || tag == 0x0B) {
				value = this._createMethodValue(iterator, pool);

				methodValues.push(value);
			} else if(tag == 0x0C) {
				value = this._createNameAndTypeValue(iterator, pool);

				nameAndTypeValues.push(value);
			} else {
				throw "ConstantPoolParser cannot parse " + tag;
			}

			value.setIndex(i);

			pool.store(i, value);

			if(tag == 0x05 || tag == 0x06) {
				// longs and doubles take two slots in the table
				i++;
			}
		}

		// pass 2, populate all complex values
		_.each(nameAndTypeValues, _.bind(function(nameAndTypeValue) {
			this._populateNameAndTypeValue(nameAndTypeValue, pool);
		}, this));

		_.each(classValues, _.bind(function(classValue) {
			this._populateClassValue(classValue, pool);
		}, this));

		_.each(methodValues, _.bind(function(methodValue) {
			this._populateMethodValue(methodValue, pool);
		}, this));

		_.each(fieldValues, _.bind(function(fieldValue) {
			this._populateFieldValue(fieldValue, pool);
		}, this));

		_.each(stringReferenceValues, _.bind(function(stringReferenceValue) {
			this._populateStringReferenceValue(stringReferenceValue, pool);
		}, this));

		return pool;
	};

	this._createStringValue = function(iterator) {
		var length = iterator.readU16();
		var stringValue = "";

		for(var n = 0; n < length; n++) {
			stringValue += String.fromCharCode(parseInt(iterator.next(), 10));
		}

		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.S);
		value.setValue(stringValue);

		return value;
	};

	this._createIntValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.I);
		value.setValue(iterator.read32());

		return value;
	};

	this._createFloatValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.F);
		value.setValue(iterator.readFloat());

		return value;
	};

	this._createLongValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.J);
		value.setValue(iterator.read64());

		return value;
	};

	this._createDoubleValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.D);
		value.setValue(iterator.readDouble());

		return value;
	};

	this._createClassValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolClassValue();
		value.setClassIndex(iterator.readU16());

		return value;
	};

	this._populateClassValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();

		value.setValue(className);
	};

	this._createStringReferenceValue = function(iterator) {
		var stringIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolStringReferenceValue();
		value.setStringIndex(stringIndex);

		return value;
	};

	this._populateStringReferenceValue = function(value, constantPool) {
		var string = constantPool.load(value.getStringIndex()).getValue();

		value.setValue(string);
	};

	this._createFieldValue = function(iterator) {
		var classIndex = iterator.readU16();
		var nameAndTypeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolFieldValue();
		value.setClassIndex(classIndex);
		value.setNameAndTypeIndex(nameAndTypeIndex);

		return value;
	};

	this._populateFieldValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();
		var nameAndType = constantPool.load(value.getNameAndTypeIndex());

		value.setClassName(className);
		value.setFieldName(nameAndType.getName());
		value.setFieldType(nameAndType.getNameType());
	};

	this._createMethodValue = function(iterator) {
		var classIndex = iterator.readU16();
		var nameAndTypeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolMethodValue();
		value.setClassIndex(classIndex);
		value.setNameAndTypeIndex(nameAndTypeIndex);

		return value;
	};

	this._populateMethodValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();
		var nameAndType = constantPool.load(value.getNameAndTypeIndex());

		value.setClassName(className);
		value.setMethodName(nameAndType.getName());
		value.setMethodType(nameAndType.getNameType());
	};

	this._createNameAndTypeValue = function(iterator) {
		var nameIndex = iterator.readU16();
		var typeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolNameAndTypeValue();
		value.setNameIndex(nameIndex);
		value.setNameTypeIndex(typeIndex);

		return value;
	};

	this._populateNameAndTypeValue = function(value, constantPool) {
		var name = constantPool.load(value.getNameIndex()).getValue();
		var type = constantPool.load(value.getNameTypeIndex()).getValue();

		value.setName(name);
		value.setNameType(type);
	};

	this.toString = function() {
		return "ConstantPoolParser";
	};
};

jjvm.compiler.EnclosingMethodParser = function() {

	this.parse = function(iterator, constantsPool) {
		var classEntry = this._loadEntry(iterator, constantsPool);
		var methodEntry = this._loadEntry(iterator, constantsPool);

		var enclosingMethod = new jjvm.types.EnclosingMethod(classEntry, methodEntry);
		enclosingMethod.setClassName(classEntry);
		enclosingMethod.setMethodName(methodEntry);

		return enclosingMethod;
	};

	this._loadEntry = function(iterator, constantsPool) {
		var index = iterator.readU16();

		if(index !== 0) {
			return constantsPool.load(index);
		}
	};

	this.toString = function() {
		return "EnclosingMethodParser";
	};
};

jjvm.compiler.ExceptionTableParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var table = [];

		// default catch type is all exceptions
		var type = {
			getClassDef: function() {
				return jjvm.core.ClassLoader.loadClass("java.lang.Throwable");
			}
		};

		while(iterator.hasNext()) {
			var from = iterator.readU16();
			var to = iterator.readU16();
			var target = iterator.readU16();
			var typeIndex = iterator.readU16();

			if(typeIndex !== 0) {
				// catch only specific type
				type = constantsPool.load(typeIndex);
			}

			table.push({
				from: from,
				to: to,
				target: target,
				type: type
			});
		}

		if(table.length === 0) {
			return null;
		}

		return new jjvm.types.ExceptionTable(table);
	};

	this.toString = function() {
		return "ExceptionTableParser";
	};
};

jjvm.compiler.FieldDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var accessFlags = iterator.readU16();
		
		var fieldDef = new jjvm.types.FieldDefinition();
		fieldDef.setName(this._loadString(iterator, constantPool));
		fieldDef.setType(this._loadClassName(iterator, constantPool));

		if(accessFlags & 0x0001) {
			fieldDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			fieldDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			fieldDef.setVisibility("protected");
		}

		fieldDef.setIsStatic(accessFlags & 0x0008);
		fieldDef.setIsFinal(accessFlags & 0x0010);
		fieldDef.setIsVolatile(accessFlags & 0x0040);
		fieldDef.setIsTransient(accessFlags & 0x0080);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("field " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Field " + name + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onConstantValue = function(iterator, constantPool) {
			var value = constantPool.load(iterator.readU16());
			fieldDef.setConstantValue(value);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			//blockParser.readEmptyBlock("onSynthetic", iterator);
			fieldDef.setSynthetic(true);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			//blockParser.readEmptyBlock("onDeprecated", iterator);
			fieldDef.setDeprecated(true);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return fieldDef;
	};

	this.toString = function() {
		return "FieldDefinitionParser";
	};
};
jjvm.compiler.InnerClassesParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var innerClasses = [];

		while(iterator.hasNext()) {
			var innerClass = this._loadEntry(iterator, constantsPool);
			var outerClass = this._loadEntry(iterator, constantsPool);
			var innerClassName = this._loadEntry(iterator, constantsPool);

			var accessFlags = iterator.readU16();

			var isPublic = accessFlags & 0x0001 ? true : false;
			var isPrivate = accessFlags & 0x0002 ? true : false;
			var isProtected = accessFlags & 0x0004 ? true : false;
			var isStatic = accessFlags & 0x0008 ? true : false;
			var isFinal = accessFlags & 0x0010 ? true : false;
			var isInterface = accessFlags & 0x0200 ? true : false;
			var isAbstract = accessFlags & 0x0400 ? true : false;

			innerClasses.push({
				innerClass: innerClass,
				outerClass: outerClass,
				innerClassName: innerClassName,
				isPublic: isPublic,
				isPrivate: isPrivate,
				isProtected: isProtected,
				isStatic: isStatic,
				isFinal: isFinal,
				isInterface: isInterface,
				isAbstract: isAbstract
			});
		}

		//console.dir(innerClasses);
	};

	this._loadEntry = function(iterator, constantsPool) {
		var index = iterator.readU16();

		if(index !== 0) {
			return constantsPool.load(index);
		}
	};

	this.toString = function() {
		return "InnerClassesParser";
	};
};

jjvm.compiler.LineNumberTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table[iterator.readU16()] = iterator.readU16();
		}

		return new jjvm.types.LineNumberTable(table);
	};

	this.toString = function() {
		return "LineNumberTableParser";
	};
};

jjvm.compiler.MethodDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var byteCodeParser = new jjvm.compiler.ByteCodeParser();
	var exceptionTableParser = new jjvm.compiler.ExceptionTableParser();
	var lineNumberTableParser = new jjvm.compiler.LineNumberTableParser();
	var stackMapTableParser = new jjvm.compiler.StackMapTableParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();
	var codeAttributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var methodDef = new jjvm.types.MethodDefinition();

		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16()).getValue();
		var descriptor = constantPool.load(iterator.readU16());
		var type = descriptor.getValue();

		var typeRegex = /\((.*)?\)(\[+)?(L[a-zA-Z\/$]+;|Z|B|C|S|I|J|F|D|V)/;
		var match = type.match(typeRegex);

		var returnsArray = match[2] ? true : false;
		var returns = match[3];

		if(returns.length > 1) {
			// returns an object type, remove the L and ;
			returns = returns.substring(1, returns.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives.jvmTypesToPrimitive[returns]) {
			// convert I to int, Z to boolean, etc
			returns = jjvm.types.Primitives.jvmTypesToPrimitive[returns];
		}

		if(returnsArray) {
			returns += "[]";
		}

		var args = [];

		if(match[1]) {
			args = jjvm.Util.parseArgs(match[1]);
		}

		
		methodDef.setName(name);
		methodDef.setArgs(args);
		methodDef.setReturns(returns);
		methodDef.setSignature(methodDef.getName() + type);
		methodDef.setClassDef(classDef);

		if(accessFlags & 0x0001) {
			methodDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			methodDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			methodDef.setVisibility("protected");
		}

		if(accessFlags & 0x0008) {
			methodDef.setIsStatic(true);
		}
		
		if(accessFlags & 0x0010) {
			methodDef.setIsFinal(true);
		}
		
		if(accessFlags & 0x0020) {
			methodDef.setIsSynchronized(true);
		}

		if(jjvm.nativeMethods[classDef.getName()] && jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]) {
			// we've overriden the method implementation
			methodDef.setImplementation(jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]);
		}

		if(accessFlags & 0x0100) {
			methodDef.setIsNative(true);

			if(!methodDef.getImplementation()) {
				// method marked as native but no implementation supplied - make a fuss
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]"]);
				//throw "Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]";
			}
		}

		if(accessFlags & 0x0400) {
			methodDef.setIsAbstract(true);
		}

		if(accessFlags & 0x0800) {
			methodDef.setIsStrict(true);
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("method " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onCode = function(iterator, constantPool) {
			methodDef.setMaxStackSize(iterator.readU16());
			methodDef.setMaxLocalVariables(iterator.readU16());

			// read bytecode instructions
			methodDef.setInstructions(blockParser.parseBlock(iterator, constantPool, iterator.readU32(), byteCodeParser));

			// read exception table
			methodDef.setExceptionTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, exceptionTableParser));

			codeAttributesParser.onAttributeCount = function(attributeCount) {
				//console.info("Code block has " + attributeCount + " attributes");
			};
			codeAttributesParser.onUnrecognisedAttribute = function(attributeName) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " has unrecognised attribute " + attributeName + " on code block"]);
			};
			codeAttributesParser.onLineNumberTable = function() {
				methodDef.setLineNumberTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 4, lineNumberTableParser));
			};
			codeAttributesParser.onStackMapTable = function(iterator, constantPool) {
				// can be variable length
				//var statckMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), stackMapTableParser);
				//methodDef.setStackMapTable(statckMapTable);
			};
			codeAttributesParser.onLocalVariableTable = function(iterator, constantPool) {
				// can be variable length
				//var statckMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), stackMapTableParser);
				//methodDef.setStackMapTable(statckMapTable);
			};
			codeAttributesParser.parse(iterator, constantPool);
		};
		attributesParser.onExceptions = function(iterator, constantPool) {
			var numExceptions = iterator.readU16();
			var exceptions = [];

			for(var m = 0; m < numExceptions; m++) {
				exceptions.push(constantPool.load(iterator.readU16()));
			}

			methodDef.setThrows(exceptions);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			methodDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			methodDef.setSynthetic(true);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return methodDef;
	};

	this.toString = function() {
		return "MethodDefinitionParser";
	};
};

jjvm.compiler.Parser = function() {

	this._loadClassName = function(iterator, constantPool) {
		var string = this._loadString(iterator, constantPool);

		if(jjvm.types.Primitives.jvmTypesToPrimitive[string]) {
			return jjvm.types.Primitives.jvmTypesToPrimitive[string];
		}

		if(string) {
			string = string.replace(/\//g, ".");

			if(_.string.startsWith(string, "L") && _.string.endsWith(string, ";")) {
				string = string.substring(1, string.length - 1);
			}

			return string;
		}

		return undefined;
	};

	this._loadString = function(iterator, constantPool) {
		var index = iterator.readU16();

		if(index > 0) {
			return constantPool.load(index).getValue();
		}

		return undefined;
	};
};

jjvm.compiler.StackMapTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		// not implemented yet...
		while(iterator.hasNext()) {
			
		}
	};

	this.toString = function() {
		return "StackMapTableParser";
	};
};
