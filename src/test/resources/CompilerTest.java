import java.io.Serializable;

public class CompilerTest implements Serializable {
	public static int A_STATIC_FIELD;
	public static final int A_FINAL_STATIC_FIELD = 0;
	public int aPublicField;
	protected int aProtectedField;
	private int aPrivateField;

	public static void aPublicVoidMethodThatThrows() throws Exception {
		A_STATIC_FIELD = 0;
		A_STATIC_FIELD++;
	}

	public static void main(String[] args) {
		CompilerTest test = new CompilerTest();
	}

	public CompilerTest() {

	}

	public CompilerTest(String foo) {

	}

	public int addition(int i, int n) {
		return i + n;
	}

	public int methodWithBranch() {
		if(aPublicField > 0) {
			aProtectedField++;
		} else {
			aProtectedField++;
		}

		return aPrivateField;
	}

	public void methodWithTryCatch(String arg) {
		try {
			int foo = Integer.parseInt(arg);
		} catch(NumberFormatException e) {
			e.getMessage();
		} finally {
			System.out.println("finally");
		}
	}
}