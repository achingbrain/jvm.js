jjvm.core.ClassCache = {
	/*load: function(className) {
		if(!localStorage) {
			return null;
		}

		if(!localStorage["jjvm_" + className]) {
			return null;
		}

		jjvm.console.info("loading " + className);
		var data = JSON.parse(localStorage["jjvm_" + className]);

		var classDef = new jjvm.types.ClassDefinition(data);

		jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef, true]);
		jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);

		return classDef;
	},

	store: function(classDef) {
		if(!localStorage) {
			return;
		}

		var data = JSON.stringify(classDef.getData());

		localStorage["jjvm_" + classDef.getName()] = data;
	},

	empty: function(className) {
		if(!localStorage) {
			return;
		}

		for(var key in localStorage) {
			if(key.substr(0, 5) == "jjvm_") {
				delete localStorage[key];
			}
		}
	},

	evict: function(className) {
		if(!localStorage) {
			return;
		}

		if(className instanceof jjvm.types.ClassDefinition) {
			className = className.getName();
		}

		delete localStorage["jjvm_" + className];
	}*/
};