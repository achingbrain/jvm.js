
public class Runner {
	
	public static void main(String[] args) {
		int arg1 = 10;
		int arg2 = 5;

		Example example = new Example();

		int result = example.addition(arg1, arg2);

		System.out.println("Total was " + result);
	}
}