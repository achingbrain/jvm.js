
describe("Iterator test", function () {
	it("should have next", function () {
		var array = [1, 2, 3];
		var iterable = new Iterator(array);

		expect(iterable.hasNext()).toBeTruthy();
	});

	it("should still have next after peeking", function () {
		var array = [1];
		var iterable = new Iterator(array);
		var peek = iterable.peek();

		expect(iterable.hasNext()).toBeTruthy();
	});

	it("should give the next item", function () {
		var array = [1];
		var iterable = new Iterator(array);

		expect(iterable.next()).toEqual(1);
	});
});

