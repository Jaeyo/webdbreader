var Promise = require('promise'),
	request = require('superagent'),
	util = require('util');

// var checkResponse = function(err, resp) {
// 	var rejectTarget = null;
// 	if(err) rejectTarget = err;
// 	else if(!resp.ok) rejectTarget = resp.error;
// 	else if(resp.body.success !==  1) rejectTarget = resp.body.errmsg;

// 	return {
// 		fail: function(callback) {
// 			if(rejectTarget != null) callback(rejectTarget);
// 			return this;
// 		},
// 		then: function(callback) {
// 			if(rejectTarget == null) callback(resp.body);
// 			return this;
// 		}
// 	};
// };




var handleResp = function(err, resp, resolve, reject, callback) {
	if(err) {
		console.error(err.stack);
		reject(err);
		return;
	}
	if(!resp.ok) {
		reject(resp.error);
		return;
	}
	if(resp.body.success !== 1) {
		reject(resp.body.errmsg);
		return;
	}
	var resolveData = callback(resp.body);
	resolve(resolveData);
	return;
};

var get = function(url, args, callback) {
	return new Promise((resolve, reject) => {
		var req = request.get(url);
		if(args != null) req.query(args);
		req.end((err, resp) {
			handleResp(err, resp, resolve, reject, callback);
		});
	});
};

var post = function(url, args, callback) {
	return new Promise((resolve, reject) => {
		var req = request.post(url);
		req.type('form');
		if(args != null) req.send(args);
		req.end((err, resp) => {
			handleResp(err, resp, resolve, reject, callback);
		});
	});
};




module.exports = {
	chartTotal: () => { return get('/REST/Chart/ScriptScoreStatistics/Total/', null, (body) => { return body.data; }) },
	//args: scriptName
	chartScript: (args) => { return get('/REST/Chart/ScriptScoreStatistics/script/', args, (body) => { return body.data; }) },
};


// ## chart



exports.chartTotal = function() {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Chart/ScriptScoreStatistics/Total/')
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.data);
					});
			});
	});
};

//args: scriptName
exports.chartScript = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Chart/ScriptScoreStatistics/script/')
			.query({
				scriptName: args.scriptName
			})
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.data);
					});
			});
	});
};

// args: scriptName, period
exports.lastStatistics = function(args) {
	args.scriptName = encodeURI(args.scriptName);

	return new Promise(function(resolve, reject) {
		request
			.get(util.format('/REST/Chart/ScriptScoreStatistics/LastStatistics/%s/', args.scriptName))
			.query({
				period: args.period
			})
			.end(function(err, resp) {
				checkResponse(err, resp)
						.fail(function(err) {
							console.error(err);
							reject(err);
						}).then(function(body) {
							resolve(body.data);
						});
			});
	});
};















//args: jdbc, table
exports.loadColumns = function(args) {
	args.title = encodeURI(args.title);

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
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/New/%s/', args.title))
			.type('form')
			.send({
				script: args.script
			}).end(function(err, resp) {
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

//args: period, dbVendor, dbIp, dbPort, dbSid, jdbcDriver, jdbcConnUrl, 
// 			jdbcUsername, jdbcPassword, columns, table, bindingType, bindingColumn,
//			delimiter, charset, outputPath
exports.generateDb2FileScript = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Script/generate/db2file')
			.query({
				period: args.period,
				dbVendor: args.dbVendor,
				dbIp: args.dbIp,
				dbPort: args.dbPort,
				dbSid: args.dbSid,
				jdbcDriver: args.jdbcDriver,
				jdbcConnUrl: args.jdbcConnUrl,
				jdbcUsername: args.jdbcUsername,
				jdbcPassword: args.jdbcPassword,
				columns: args.columns,
				table: args.table,
				bindingType: args.bindingType,
				bindingColumn: args.bindingColumn,
				delimiter: args.delimiter,
				charset: args.charset,
				outputPath: args.outputPath
			})
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.script);
					});
			});
	});
};

//args: srcDbVendor, srcDbIp, srcDbPort, srcDbSid, srcJdbcDriver, srcJdbcConnUrl
// 			srcJdbcUsername, srcJdbcPassword, srcTable, srcColumns, destDbVendor
// 			destDbIp, destDbPort, destDbSid, destJdbcDriver, destJdbcConnUrl, destJdbcUsername
// 			destJdbcPassword, destTable, destColumns, bindingType, srcBindingColumn, period, deleteAllBeforeInsert
exports.generateDb2DbScript = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Script/generate/db2db')
			.query({
				srcDbVendor: args.srcDbVendor,
				srcDbIp: args.srcDbIp,
				srcDbPort: args.srcDbPort,
				srcDbSid: args.srcDbSid,
				srcJdbcDriver: args.srcJdbcDriver,
				srcJdbcConnUrl: args.srcJdbcConnUrl,
				srcJdbcUsername: args.srcJdbcUsername,
				srcJdbcPassword: args.srcJdbcPassword,
				srcTable: args.srcTable,
				srcColumns: args.srcColumns,
				destDbVendor: args.destDbVendor,
				destDbIp: args.destDbIp,
				destDbPort: args.destDbPort,
				destDbSid: args.destDbSid,
				destJdbcDriver: args.destJdbcDriver,
				destJdbcConnUrl: args.destJdbcConnUrl,
				destJdbcUsername: args.destJdbcUsername,
				destJdbcPassword: args.destJdbcPassword,
				destTable: args.destTable,
				destColumns: args.destColumns,
				bindingType: args.bindingType,
				srcBindingColumn: args.srcBindingColumn,
				period: args.period,
				deleteAllBeforeInsert: args.deleteAllBeforeInsert
			})
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.script);
					});
			});
	});
};

//args: title, script, dbName, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword
exports.importVer1Script = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/ImportVer1Script/%s/', args.title))
			.type('form')
			.send({
				script: args.script,
				dbName: args.dbName,
				jdbcDriver: args.jdbcDriver,
				jdbcConnUrl: args.jdbcConnUrl,
				jdbcUsername: args.jdbcUsername,
				jdbcPassword: args.jdbcPassword
			}).end(function(err, resp) {
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

//args: title, script
exports.editScript = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/Edit/%s/', args.title))
			.type('form')
			.send({
				script: args.script
			}).end(function(err, resp) {
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

//args: title
exports.loadScript = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.get(util.format('/REST/Script/Load/%s/', args.title))
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.script);
					});
			});
	});
};

//args: title
exports.loadScriptParams = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.get(util.format('/REST/Script/LoadParams/%s/', args.title))
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						if(body.parsable === 1) {
							resolve({
								parsable: 1,
								params: body.params
							});
						} else {
							resolve({
								parsable: 0,
								msg: body.msg
							});
						}
					});
			});
	});
};

exports.loadScriptTitles = function() {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Script/Titles/')
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.titles);
					});
			});
	});
};

//args: title, newTitle
exports.renameScript = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/Rename/%s/', args.title))
			.type('form')
			.send({
				newTitle: args.newTitle
			})
			.end(function(err, resp) {
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

//args: title
exports.startScript = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/Start/%s/', args.title))
			.end(function(err, resp) {
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

//args: title
exports.stopScript = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/Stop/%s/', args.title))
			.end(function(err, resp) {
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

//args: title
exports.removeScript = function(args) {
	args.title = encodeURI(args.title);

	return new Promise(function(resolve, reject) {
		request
			.post(util.format('/REST/Script/Remove/%s/', args.title))
			.end(function(err, resp) {
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



exports.getHomePath = function() {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Config/homepath')
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.homepath);
					});
			});
	});
};

exports.getSimpleRepoAll = function() {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Config/SimpleRepo/')
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.data);
					});
			});
	});
};

// args: scriptName, key
exports.getSimpleRepo = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Config/SimpleRepo/')
			.query({
				scriptName: args.scriptName,
				key: args.key
			})
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.value);
					});
			});
	});
};

//args: scriptName, key, value
exports.addSimpleRepo = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.post('/REST/Config/AddSimpleRepo/')
			.type('form')
			.send({
				scriptName: args.scriptName,
				key: args.key,
				value: args.value
			}).end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(true);
					});
			});
	});
};

//args: scriptName, key, newKey, newValue
exports.updateSimpleRepo = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.post('/REST/Config/UpdateSimpleRepo/')
			.type('form')
			.send({
				scriptName: args.scriptName,
				key: args.key,
				newKey: args.newKey,
				newValue: args.newValue
			}).end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(true);
					});
			});
	});
};

//args: scriptName, key
exports.removeSimpleRepo = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.post('/REST/Config/RemoveSimpleRepo/')
			.type('form')
			.send({
				scriptName: args.scriptName,
				key: args.key
			}).end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(true);
					});
			});
	});
};

//args: threshold
exports.updateLog4jThreshold = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.post('/REST/Config/update/log4j/threshold')
			.type('form')
			.send({
				threshold: args.threshold
			}).end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(true);
					});
			});
	});
};

exports.loadLog4jThreshold = function() {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/Config/log4j/threshold')
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.threshold);
					});
			});
	});
};

exports.embedDbQuery = function(args) {
	return new Promise(function(resolve, reject) {
		request
			.get('/REST/EmbedDb/query')
			.query({
				query: args.query
			})
			.end(function(err, resp) {
				checkResponse(err, resp)
					.fail(function(err) {
						console.error(err);
						reject(err);
					}).then(function(body) {
						resolve(body.result);
					});
			});
	});
};