var Promise = require('promise'),
	util = require('util');

exports.loadColumns = function(jdbc, table) {
	return new Promise(function(resolve, reject) {
		$.getJSON(util.format('/REST/Database/Columns/%s/', table), jdbc)
		.fail(function(err) {
			console.error(err);
			reject(err);
		}).done(function(resp) {
			if(resp.success !== 1) {
				console.error(resp.errmsg);
				reject(resp.errmsg);
			} else {
				resolve(resp.columns);
			}
		});
	});
};

exports.loadTables = function(jdbc) {
	return new Promise(function(resolve, reject) {
		$.getJSON('/REST/Database/Tables/', jdbc)
		.fail(function(err) {
			console.error(err);
			reject(err);
		}).done(function(resp) {
			if(resp.success !== 1) {
				console.error(resp.errmsg);
				reject(resp.errmsg);
			} else {
				resolve(resp.tables)
			}
		});
	});
};