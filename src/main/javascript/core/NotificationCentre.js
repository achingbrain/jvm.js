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

		if(!args) {
			args = [];
		}

		if(!(args instanceof Array)) {
			args = [args];
		}

		args.unshift(sender);

		for(var i = 0; i < jjvm.core.NotificationCentre._listeners[eventType].length; i++) {
			jjvm.core.NotificationCentre._listeners[eventType][i].apply(this, args);
		}
	}
};
