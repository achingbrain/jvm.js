
describe("Console test", function () {
	var div;
	var console;

	beforeEach(function() {
		div = $("<div id=\"console\"><button /><ul></ul></div>");
		console = new Console(div);
	});

	it("should show info", function () {
		var spy = spyOn(console, "info").andCallThrough();

		console.info("hello");

		expect(spy).toHaveBeenCalled();
	});

	it("should show warn", function () {
		var spy = spyOn(console, "warn").andCallThrough();

		console.warn("hello");

		expect(spy).toHaveBeenCalled();
	});

	it("should show error", function () {
		var spy = spyOn(console, "error").andCallThrough();

		console.error("hello");

		expect(spy).toHaveBeenCalled();
	});

	it("should clear", function () {
		console.error("hello");

		expect($(div).find("ul").children().size()).toEqual(1);

		console.clear();

		expect($(div).find("ul").children().size()).toEqual(0);
	});
});
