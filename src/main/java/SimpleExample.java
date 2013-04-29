public class SimpleExample {
	private int iAmAPrivateInt = 293091;
	private float iAmAPrivateFloat = 1219082.38f;
	private long iAmAPrivateLong = 234029839120980183L;
	private double iAmAPrivateDouble = 2340298340283.280183D;
	private CharSequence iAmAPrivateString = "Hello world";

	public static void main(String[] args) {
		SimpleExample foo = new SimpleExample();
		int length = foo.iAmAPrivateString.length();

		System.out.println("String length was " + length);
	}
}