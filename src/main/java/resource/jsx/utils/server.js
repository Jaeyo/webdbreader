var Promise = require('promise'),
	request = require('superagent'),
	util = require('util');

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
	// ### chart
	chartTotal: () => { 
		return get(
			'/REST/Chart/ScriptScoreStatistics/Total/', 
			// /REST/Chart/total-chart
			null, 
			(body) => { return body.data; }
		);
	},
	//args: scriptName
	chartScript: (args) => { 
		return get(
			'/REST/Chart/ScriptScoreStatistics/script/', 
			// /REST/Chart/script-chart/script-name/{scriptName}
			args, 
			(body) => { return body.data; }
		);
	},
	//args: scriptName, period
	lastStatistics: (args) => { 
		return get(
			util.format('/REST/Chart/ScriptScoreStatistics/LastStatistics/%s/', args.scriptName), 
			// /REST/Chart/last-statistics/script-name/{scriptName}
			args, 
			(body) => { return body.data; }
		);
	},
	// ### chart end


	// ### database
	//args: jdbc, table
	loadColumns: (args) => { 
		return get(
			util.format('/REST/Database/Columns/%s/', encodeURI(args.scriptName)),
			// /REST/Database/table/{table}/columns
			args.jdbc,
			(body) => { return body.columns; }
		);
	},
	//args: jdbc
	loadTables: (args) => {
		return get(
			'/REST/Database/Tables/',
			// /REST/Database/tables
			args.jdbc,
			(body) => { return body.tables; }
		);
	},
	// args: jdbc, query, rowCount
	querySampleData: (args) => {
		return get(
			'/REST/Database/QuerySampleData/', 
			// /REST/Database/table/{table}/datas
			args, 
			(body) => { return body.sampleData; }
		);
	},
	// ### database end


	// ### script
	//args: title, script
	postScript: (args) => {
		return post(
			util.format('/REST/Script/New/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}
			{ script: args.script },
			(body) => { return body.success; }
		);
	},
	//args: period, dbVendor, dbIp, dbPort, dbSid, jdbcDriver, jdbcConnUrl, 
	// 		jdbcUsername, jdbcPassword, columns, table, bindingType, bindingColumn,
	//		delimiter, charset, outputPath
	generateDb2FileScript: (args) => {
		return get(
			'/REST/Script/generate/db2file', 
			// /REST/Script/db2file
			args,
			(body) => { return body.script }
		);
	},
	//args: srcDbVendor, srcDbIp, srcDbPort, srcDbSid, srcJdbcDriver, srcJdbcConnUrl
	// 			srcJdbcUsername, srcJdbcPassword, srcTable, srcColumns, destDbVendor
	// 			destDbIp, destDbPort, destDbSid, destJdbcDriver, destJdbcConnUrl, destJdbcUsername
	// 			destJdbcPassword, destTable, destColumns, bindingType, srcBindingColumn, period, deleteAllBeforeInsert
	generateDb2DbScript: (args) => {
		return get(
			'/REST/Script/generate/db2db',
			// /REST/Script/db2db
			args, 
			(body) => { return body.script; }
		);
	},
	//args: title, script, dbName, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword
	importVer1Script: (args) => {
		return post(
			util.format('/REST/Script/ImportVer1Script/%s/', encodeURI(args.title)),
			// /REST/Script/ver1-script/script-name/{title}
			{
				script: args.script,
				dbName: args.dbName,
				jdbcDriver: args.jdbcDriver,
				jdbcConnUrl: args.jdbcConnUrl,
				jdbcUsername: args.jdbcUsername,
				jdbcPassword: args.jdbcPassword
			},
			(body) => { return body.success; }
		);
	},
	//args: title, script
	editScript: (args) => {
		return post(
			util.format('/REST/Script/Edit/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}/edit
			{ script: args.script },
			(body) => { return body.success; }
		);
	},
	//args: title
	loadScript: (args) => {
		return get(
			util.format('/REST/Script/Load/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}
			null,
			(body) => { return body.script; }
		);
	},
	//args: title
	loadScriptParams: (args) => {
		return get(
			util.format('/REST/Script/LoadParams/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}/params
			null,
			(body) => {
				if(body.parsable === 1) return { parsable: 1, params: body.params };
				else return { parsable: 0, msg: body.msg };
			}
		);
	}
	loadScriptTitles: () => {
		return get(
			'/REST/Script/Titles/',
			// /REST/Script/script-titles
			null,
			(body) => { return body.titles; }
		);
	},
	//args: title, newTitle
	renameScript: (args) => {
		return post(
			util.format('/REST/Script/Rename/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}/rename
			{ newTitle: args.newTitle },
			(body) => { return body.success; }
		);
	},
	//args: title
	startScript: (args) => {
		return post(
			util.format('/REST/Script/Start/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}/start
			null,
			(body) => {
				return body.success;
			}
		);
	},
	//args: title
	stopScript: (args) => {
		return post(
			util.format('/REST/Script/Stop/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}/stop
			null,
			(body) => { return body.success; }
		);
	},
	//args: title
	removeScript: (args) => {
		return post(
			util.format('/REST/Script/Remove/%s/', encodeURI(args.title)),
			// /REST/Script/script/{title}/remove
			null,
			(body) => { return body.success; }
		);
	},
	// ### script end


	// ### config
	getHomePath: () => {
		return get(
			'/REST/Config/homepath',
			// /REST/Config/homepath
			null,
			(body) => { return body.homepath; }
		);
	},
	getSimpleRepoAll: () => {
		return get(
			'/REST/Config/SimpleRepo/',
			// /REST/Config/simple-repos
			null,
			(body) = > { return body.data; }
		);
	},
	//args: scriptName, key
	getSimpleRepo: (args) => {
		return get(
			'/REST/Config/SimpleRepo/',
			// /REST/Config/simple-repos/script/{scriptName}/key/{key}
			{ scriptName: args.scriptName, key: args.key },
			(body) => { return body.value; }
		);
	},
	//args: scriptName, key, value
	addSimpleRepo: (args) => {
		return post(
			'/REST/Config/AddSimpleRepo/',
			// /REST/Config/simple-repo/script/{scriptName}/key/{key}
			args,
			(body) => { return true; }
		);
	},
	//args: scriptName, key, newKey, newValue
	updateSimpleRepo: (args) => {
		return post(
			'/REST/Config/UpdateSimpleRepo/',
			// /REST/Config/simple-repo/script/{scriptName}/key/{key}/update
			args,
			(body) => { return true; }
		);
	},
	//args: scriptName, key
	removeSimpleRepo: (args) => {
		return post(
			'/REST/Config/RemoveSimpleRepo/'
			// /REST/Config/simple-repo/script/{scriptName}/key/{key}/remove
			args,
			(body) => { return true; }
		);
	},
	//args: threshold
	updateLog4jThreshold: (args) => {
		return post(
			'/REST/Config/update/log4j/threshold',
			// /REST/Config/log4j/threshold/update
			args, 
			(body) => { return true; }
		);
	},
	loadLog4jThreshold: () => {
		return get(
			'/REST/Config/log4j/threshold',
			// /REST/Config/log4j/threshold
			null,
			(body) => { return body.threshold; }
		);
	},
	// ### config end


	// ### embed
	//args: query
	embedDbQuery: (args) => {
		return get(
			'/REST/EmbedDb/query',
			// /RESET/EmbedDB/datas
			args, 
			(body) => { return body.result; }
		);
	}
};