jjvm.core.NotificationCentre = {
	_listeners: {},

	register: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			jjvm.core.NotificationCentre._listeners[eventType] = [];
		}

		jjvm.core.NotificationCentre._listeners[eventType].push(listener);
	},

	deRegister: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		for(var i = 0; i < jjvm.core.NotificationCentre._listeners[eventType].length; i++) {
			if(jjvm.core.NotificationCentre._listeners[eventType][i] == listener) {
				jjvm.core.NotificationCentre._listeners[eventType].splice(i, 1);
				i--;
			}
		}
	},

	dispatch: function(sender, eventType, args) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		if(args === undefined) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.NotificationCentre#dispatch as args";
		}

		var observerArgs = [sender];
		observerArgs = observerArgs.concat(args);

		// copy the array in case the listener deregisters itself as part of the callback
		var observers = jjvm.core.NotificationCentre._listeners[eventType].concat([]);

		for(var i = 0; i < observers.length; i++) {
			observers[i].apply(observers[i], observerArgs);
		}
	}
};
