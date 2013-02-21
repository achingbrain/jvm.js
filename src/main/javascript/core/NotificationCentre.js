NotificationCentre = {
	_listeners: {},

	register: function(eventType, listener) {
		if(NotificationCentre._listeners[eventType] === undefined) {
			NotificationCentre._listeners[eventType] = [];
		}

		NotificationCentre._listeners[eventType].push(listener);
	},

	deRegister: function(eventType, listener) {
		if(NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		for(var i = 0; i < NotificationCentre._listeners[eventType].length; i++) {
			if(NotificationCentre._listeners[eventType][i] == listener) {
				NotificationCentre._listeners[eventType].splice(i, 1);
				i--;
			}
		}
	},

	dispatch: function(sender, eventType, args) {
		if(NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		if(!args) {
			args = [];
		}

		if(!(args instanceof Array)) {
			args = [args];
		}

		args.unshift(sender);

		for(var i = 0; i < NotificationCentre._listeners[eventType].length; i++) {
			NotificationCentre._listeners[eventType][i].apply(this, args);
		}
	}
};
