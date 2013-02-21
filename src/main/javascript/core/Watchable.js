Watchable = {

	register: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
	},

	deRegister: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};

			return false;
		}

		if(this._observers[eventType] === undefined) {
			return false;
		}

		var lengthBefore = this._observers[eventType].length;

		this._observers[eventType] = _.without(this._observers[eventType], listener);

		var lengthAfter = this._observers[eventType].length;

		var deregistered = lengthBefore != lengthAfter;

		if(!deregistered) {
			console.debug("Failed to deregister " + listener + " for event type " + eventType);
		}

		return deregistered;
	},

	dispatch: function(eventType, args) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] !== undefined) {
			var otherArgs = [this];

			if(args) {
				if(args instanceof Array) {
					otherArgs = otherArgs.concat(args);
				} else {
					otherArgs.push(args);
				}
			}

			var observers = this._observers[eventType].concat([]);

			for(var i = 0; i < observers.length; i++) {
				observers[i].apply(observers[i], otherArgs);
			}
		}

		// inform global listeners
		NotificationCentre.dispatch(this, eventType, args);
	}
};