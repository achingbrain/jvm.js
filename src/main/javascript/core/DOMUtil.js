jjvm.core.DOMUtil = {
	create: function(type, content, attributes) {
		if(_.isObject(content) && !_.isArray(content) && !attributes) {
			attributes = content;
			content = null;
		}

		if(type && content && attributes) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && content) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && attributes) {
			return jjvm.core.DOMUtil._createEmpty(type, attributes);
		} else {
			return jjvm.core.DOMUtil._createEmpty(type);
		}

		console.error("jjvm.core.DOMUtil.create passed wrong number of arguments.  Expected 1, 2 or 3, was " + arguments.length);
	},

	_create: function(type, content, attributes) {
		var output = jjvm.core.DOMUtil._createEmpty(type, attributes);

		jjvm.core.DOMUtil.append(content, output);

		return output;
	},

	_createEmpty: function(type, attributes) {
		var output = document.createElement(type);

		if(attributes) {
			for(var key in attributes) {
				output[key] = attributes[key];
			}
		}

		return output;
	},

	append: function(content, node) {
		if(_.isString(content)) {
			jjvm.core.DOMUtil._appendText(content, node);
		} else if(_.isArray(content)) {
			for(var i = 0; i < content.length; i++) {
				jjvm.core.DOMUtil.append(content[i], node);
			}
		} else if(_.isElement(content)) {
			node.appendChild(content);
		} else {
			console.warn("what is " + content);
		}
	},

	_appendText: function(content, node) {
		node.appendChild(document.createTextNode(content));
	}
};