
public class Another {
	
	public static void main(String[] args) {
		int l = args.length;
		catcha();
	}

	public static int catcha() {
		try {
			throwa();
		} catch(Throwable t) {
			return 1; 
		}

		return 2;
	}

	public static void throwa() throws Throwable {
		throw new Exception("");
	}
}