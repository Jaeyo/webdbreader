var precondition = function(data) {
	this.data = data;
};

precondition.prototype.stringNotByEmpty = function(keyName, msg) {
	var checkFn = function(keyName) {
		if(this.data[keyName] == null) throw msg;
		if(typeof this.data[keyName] !== 'string') throw msg;
		if(this.data[keyName].trim().length === 0) throw msg;
	}.bind(this);

	if(Array.isArray(keyName) === true) {
		keyName.forEach(checkFn);
	} else {
		checkFn(keyName);
	}

	return this;
};

precondition.prototype.check = function(callback, msg) {
	if(callback(this.data) === false) throw msg;
	return this;
};

module.exports = {
	instance: function(data) {
		return new precondition(data);
	}
};