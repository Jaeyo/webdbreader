var precondition = function(data) {
	this.data = data;
};

precondition.prototype.stringNotByEmpty = function(keyName, msg) {
	if(this.data[keyName] == null) throw msg;
	if(typeof this.data[keyName] !== 'string') throw msg;
	if(this.data[keyName].trim().length === 0) throw msg;
};

module.exports = {
	instance: function(data) {
		return new precondition(data);
	}
};