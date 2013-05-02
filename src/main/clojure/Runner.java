
public class Runner {
	
	public static void main(String[] args) {
		int arg1 = 10;
		int arg2 = 5;

		Example$addition example = new Example$addition();

		Object result = example.invoke(arg1, arg2);

		System.out.println("Total was " + result);
	}
}