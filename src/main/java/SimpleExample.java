public class SimpleExample {
	private int privateInt = 293091;
	private float privateFloat = 1219082.38f;
	private long privateLong = 234029839120980183L;
	private double privateDouble = 2340298340283.280183D;
	private CharSequence privateString = "Hello world";

	public static void main(String[] args) {
		SimpleExample foo = new SimpleExample();
		int length = foo.privateString.length();

		System.out.println("String length was " + length);
	}
}