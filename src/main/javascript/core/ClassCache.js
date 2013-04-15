jjvm.core.ClassCache = {
	load: function(className) {
		if(!window.localStorage) {
			return null;
		}

		if(!window.localStorage["jjvm_" + className]) {
			return null;
		}

		console.info("loading " + className);
		var data = JSON.parse(window.localStorage["jjvm_" + className]);

		var classDef = new jjvm.types.ClassDefinition(data);

		jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef, true]);
		jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);

		return classDef;
	},

	store: function(classDef) {
		if(!window.localStorage) {
			return;
		}

		var data = JSON.stringify(classDef.getData());

		window.localStorage["jjvm_" + classDef.getName()] = data;
	},

	empty: function(className) {
		if(!window.localStorage) {
			return;
		}

		for(var key in window.localStorage) {
			if(key.substr(0, 5) == "jjvm_") {
				delete window.localStorage[key];
			}
		}
	},

	evict: function(className) {
		if(!window.localStorage) {
			return;
		}

		if(className instanceof jjvm.types.ClassDefinition) {
			className = className.getName();
		}

		delete window.localStorage["jjvm_" + className];
	}
};