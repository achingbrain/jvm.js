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
