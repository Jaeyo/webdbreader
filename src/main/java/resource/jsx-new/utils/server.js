var Promise = require('promise'),
	util = require('util');

exports.loadColumns = function(jdbc, table) {
	jdbc = JSON.parse(decodeURI(JSON.stringify(jdbc)));
	table = decodeURI(table);

	return new Promise(function(resolve, reject) {
		$.getJSON(util.format('/REST/Database/Columns/%s/', table), jdbc)
		.fail(function(err) {
			console.error({ err: err });
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
	jdbc = JSON.parse(decodeURI(JSON.stringify(jdbc)));

	return new Promise(function(resolve, reject) {
		$.getJSON('/REST/Database/Tables/', jdbc)
		.fail(function(err) {
			console.error({ err: err });
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

exports.querySampleData = function(params) {
	params = JSON.parse(decodeURI(JSON.stringify(params)));

	return new Promise(function(resolve, reject) {
		$.getJSON('/REST/Database/QuerySampleData/', params)
		.fail(function(err) {
			console.error({ err: err });
			reject(err);
		}).done(function(resp) {
			if(resp.success !== 1) {
				console.error(resp.errmsg);
				reject(resp.errmsg);
			} else {
				resolve(resp.sampleData);
			}
		});
	});
};