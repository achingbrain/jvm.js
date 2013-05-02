import java.util.concurrent.atomic.AtomicInteger;

public class WithInner {
	private AtomicInteger n = new AtomicInteger(10);

	public Runnable foo(final AtomicInteger i) {
		return new Runnable() {
			public void run() {
				n.addAndGet(i.get());
			}
		};
	}
}