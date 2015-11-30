var Promise = require('promise'),
	request = require('superagent'),
	util = require('util');

var checkResponse = function(err, resp) {
	var rejectTarget = null;
	if(err) rejectTarget = err;
	else if(!resp.ok) rejectTarget = resp.error;
	else if(resp.body.success !==  1) rejectTarget = resp.body.errmsg;

	return {
		fail: function(callback) {
			if(rejectTarget != null) callback(rejectTarget);
			return this;
		},
		then: function(callback) {
			if(rejectTarget == null) callback(resp.body);
			return this;
		}
	};
};

//args: jdbc, table
exports.loadColumns = function(args) {
	args.jdbc = JSON.parse(decodeURI(JSON.stringify(args.jdbc)));
	args.table = decodeURI(args.table);

	return new Promise(function(resolve, reject) {
		request
			.get(util.format('/REST/Database/Columns/%s/', args.table))
			.query(args.jdbc)
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.columns);
					});
			});
	});
};

//args: jdbc
exports.loadTables = function(args) {
	args.jdbc = JSON.parse(decodeURI(JSON.stringify(args.jdbc)));

	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Database/Tables/')
			.query(args.jdbc)
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.tables);
					});
			});
	});
};

exports.querySampleData = function(params) {
	params = JSON.parse(decodeURI(JSON.stringify(params)));

	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Database/QuerySampleData/')
			.query(params)
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.sampleData);
					});
			});
	});
};

//args: title, script
exports.postScript = function(args) {
	args.title = decodeURI(args.title);

	console.log(args); //DEBUG
	console.log({ script: args.script }); //DEBUG

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/New/%s/', args.title))
			.send({
				test: 'blabla test',
				script: args.script
			}).end(function(err, resp) {
				console.log({ err: err, resp: resp }); //DEBUG
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.success);
					});
			});
	});
};

//return { SCRIPT_NAME, REGDATE, IS_RUNNING }
exports.loadScripts = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Script/Info/')
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.scriptInfos);
					});
			});
	});
};