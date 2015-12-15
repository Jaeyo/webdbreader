var util = require('util');

//args: period, dbVendor, dbIp, dbPort, dbSid, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword, 
//		columns, table, bindingType, bindingColumn, delimiter, charset, outputPath
exports.get = function(args) {
	var script = '';

	script += [
		util.format("var type = 'db2file-%s';", args.bindingType),
		util.format("var period = %s;", args.period),
		util.format("var dbVendor = '%s';", args.dbVendor),
		util.format("var dbIp = '%s';", args.dbIp),
		util.format("var dbPort = '%s';", args.dbPort),
		util.format("var dbSid = '%s';", args.dbSid),
		util.format("var jdbcDriver = '%s';", args.jdbcDriver),
		util.format("var jdbcConnUrl = '%s';", args.jdbcConnUrl),
		util.format("var jdbcUsername = '%s';", args.jdbcUsername),
		util.format("var jdbcPassword = '%s';", args.jdbcPassword),
		util.format("var columns = '%s';", args.columns),
		util.format("var table = '%s';", args.table),
		util.format("var bindingType = '%s';", args.bindingType)
	].join('\n');

	if(args.bindingType !== 'simple')
		script += util.format("var bindingColumn = '%s';", args.bindingColumn);

	script += [
		util.format("var delimiter = '%s';", args.delimiter),
		util.format("var charset = '%s';", args.charset),
		util.format("var outputPath = '%s';", args.outputPath)
	].join('\n');

};



var ScriptMaker = function() {
	var variable;
	var maxQueryVariable;
	var minMaxVariable;
	var mainQueryVariable;
	var storeMax2Min;

	return {
		//args: period, dbVendor, dbIp, dbPort, dbSid, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword, 
		//		columns, table, bindingType, bindingColumn, delimiter, charset, outputPath
		variable: function(args) {
			variable = util.format([
				"var type = 'db2file'; ",
				"var period = %s; ",
				"var dbVendor = '%s'; ",
				"var dbIp = '%s'; ",
				"var dbPort = '%s'; ",
				"var dbSid = '%s'; ",
				"var jdbcDriver = '%s'; ",
				"var jdbcConnUrl= '%s'; ",
				"var jdbcUsername = '%s'; ",
				"var jdbcPassword = '%s'; ",
				"var columns = '%s'; ",
				"var table = '%s'; ",
				"var bindingType = '%s'; ",
				"var bindingColumn = '%s'; ",
				"var delimiter = '%s'; ",
				"var charset = '%s'; ",
				"var outputPath = '%s'; ",
				"/************************************/",
				"var jdbc = { driver: jdbcDriver, connUrl: jdbcConnUrl, username: jdbcUsername, password: jdbcPassword };"
			].join('\n'), args.period, args.dbVendor, args.dbIp, args.dbPort, args.dbSid, 
			args.jdbcDriver, args.jdbcConnUrl, args.jdbcUsername, args.jdbcPassword, 
			args.columns, args.table, args.bindingType, args.bindingColumn, 
			args.delimiter, args.charset, args.outputPath);
			return this;
		},

		//args: bindingType
		maxQueryVariable: function(args) {
			if(args.bindingType !== 'date') return this;

			maxQueryVariable = [
				"var maxQuery = format( ",
				"	'select max(${bindingColumn}) \\",
				"	from ${table}', ",
				"	{ bindingColumn: bindingColumn, table: table} ",
				"); "
			].join('\n');

			return this;
		},

		//args: bindingType
		minMaxVariable: function(args) {
			switch(args.bindingType) {
				case 'date':
					minMaxVariable = [
						"	var min = repo('min');",
						"	var max = now().format('yyyy-MM-dd HH:mm:ss');"
					].join('\n');
				break;
				case 'sequence':
					minMaxVariable = [
						"	var min = repo('min');",
						"	var max = database(jdbc).select(maxQuery).get();"
					].join('\n');
				break;
			}
			return this;
		},

		//args: bindingType, dbVendor
		mainQueryVariable: function(args) {
			switch(args.bindingType) {
				case 'simple':
					mainQueryVariable = [
						"	var mainQuery = format( ",
						"		'SELECT ${columns} \\",
						"		FROM ${table}',",
						"		{ columns: columns, table: table }",
						"	);"
					].join('\n');
				break;
				case 'date':
					if(args.dbVendor === 'mysql') {
						mainQueryVariable = [
							"	var mainQuery = format( ", 
							"		'SELECT ${columns} \\", 
							"		FROM ${table} \\", 
							"		WHERE ${bindingColumn} > str_to_date(\\'${min}\\', \\'%Y-%m-%d %H:%i:%s\\') \\", 
							"		AND ${bindingColumn} <= str_to_date(\\'${max}\\', \\'%Y-%m-%d %H:%i:%s\\')',", 
							"		{ columns: columns, table: table, ", 
							"		bindingColumn: bindingColumn, ", 
							"		min: min, max: max } ", 
							"	);"
						].join('\n');
					} else if(args.dbVendor === 'mssql') {
						mainQueryVariable = [
							"	var mainQuery = format( ",
							"		'SELECT ${columns} \\",
							"		FROM ${table} \\",
							"		WHERE ${bindingColumn} > ${min} \\",
							"		AND ${bindingColumn} <= ${max}', ",
							"		{ columns: columns, table: table, ", 
							"		bindingColumn: bindingColumn, ", 
							"		min: min, max: max } ", 
							"	);"
						].join('\n');
					} else {
						mainQueryVariable = [
							"	var mainQuery = format( ", 
							"		'SELECT ${columns} \\", 
							"		FROM ${table} \\", 
							"		WHERE ${bindingColumn} > to_date(\\'${min}\\', \\'YYYY-MM-DD HH24:MI:SS\\') \\", 
							"		AND ${bindingColumn} <= to_date(\\'${max}\\', \\'YYYY-MM-DD HH24:MI:SS\\')',", 
							"		{ columns: columns, table: table, ", 
							"		bindingColumn: bindingColumn, ", 
							"		min: min, max: max } ", 
							"	);"
						].join('\n');
					}
				break;
				case 'sequence':
					mainQueryVariable = [
						"	var mainQuery = format( ",
						"		'SELECT ${columns} \\",
						"		FROM ${table} \\",
						"		WHERE ${bindingColumn} > ${min} \\",
						"		AND ${bindingColumn} < ${max}', ",
						"		{ columns: columns, table: table, ", 
						"		bindingColumn: bindingColumn, ", 
						"		min: min, max: max } ", 
						"	);"
					].join('\n');
				break;
			}

			return this;
		},

		//args: bindingType
		storeMax2Min: function(args) {
			if(args.bindingType === 'simple') return this;
			storeMax2Min = "repo('min', max);";
			return this;
		},

		get: function(args) {
			this.variable(args)
				.maxQueryVariable(args)
				.minMaxVariable(args)
				.mainQueryVariable(args)
				.storeMax2Min(args);

			return [
				variable,
				"jdbc.username = decrypt(jdbc.username); ",
				"jdbc.password = decrypt(jdbc.password); ",
				"schedule(period).run(function() { ",
				maxQueryVariable,
				minMaxVariable,
				mainQueryVariable,
				"	database(jdbc)",
				"		.select(mainQuery)", 
				"		.result(function(resultset) {", 
				"			return resultset.join(delimiter).split('\\n').join('') + '\\n';", 
				"		})", 
				"		.group(100)", 
				"		.writeFile({",
				"			filename: outputPath,", 
				"			charset: charset", 
				"		});",
				storeMax2Min,
				"});"
			].join('\n');
		}
	};
};

module.exports = ScriptMaker;