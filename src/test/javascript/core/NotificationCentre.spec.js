describe("NotificationCentre test", function () {
	it("should register listener", function () {
		var array = [];

		jjvm.core.NotificationCentre.register("onFoo", function() {
			array.push("bar");
		});

		expect(array.length).toEqual(0);

		jjvm.core.NotificationCentre.dispatch(this, "onFoo");

		expect(array.length).toEqual(1);
	});

	it("should deregister listener", function () {
		var array = [];
		var listener =  function() {
			array.push("bar");
		};

		jjvm.core.NotificationCentre.register("onFoo", listener);

		expect(array.length).toEqual(0);

		jjvm.core.NotificationCentre.dispatch(this, "onFoo");

		expect(array.length).toEqual(1);

		jjvm.core.NotificationCentre.deRegister("onFoo", listener);

		jjvm.core.NotificationCentre.dispatch(this, "onFoo");

		expect(array.length).toEqual(1);
	});
});
