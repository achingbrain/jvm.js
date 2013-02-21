
describe("NotificationCentre test", function () {
	it("should register listener", function () {
		var array = [];

		NotificationCentre.register("onFoo", function() {
			array.push("bar");
		});

		expect(array.length).toEqual(0);
		NotificationCentre.dispatch(this, "onFoo");
		expect(array.length).toEqual(1);
	});

	it("should deregister listener", function () {
		var array = [];
		var listener =  function() {
			array.push("bar");
		};

		NotificationCentre.register("onFoo", listener);

		expect(array.length).toEqual(0);
		
		NotificationCentre.dispatch(this, "onFoo");
		
		expect(array.length).toEqual(1);

		NotificationCentre.deRegister("onFoo", listener);

		NotificationCentre.dispatch(this, "onFoo");
		
		expect(array.length).toEqual(1);
	});
});

