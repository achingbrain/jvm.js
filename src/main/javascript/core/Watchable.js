jjvm.core.Watchable = {

	register: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
	},

	registerOneTimeListener: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
		listener.____oneTime = true;
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

		if(args === undefined) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.Watchable#dispatch as args";
		}

		if(this._observers[eventType] !== undefined) {
			var observerArgs = [this];
			observerArgs = observerArgs.concat(args);

			// copy the array in case the listener deregisters itself as part of the callback
			var observers = this._observers[eventType].concat([]);

			for(var i = 0; i < observers.length; i++) {
				observers[i].apply(observers[i], observerArgs);

				if(observers[i].____oneTime === true) {
					this.deRegister(eventType, observers[i]);
				}
			}
		}

		// inform global listeners
		jjvm.core.NotificationCentre.dispatch(this, eventType, args);
	}
};