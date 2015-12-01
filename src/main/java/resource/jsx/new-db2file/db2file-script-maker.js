var util = require('util');

var ScriptMaker = function() {
	var variable;
	var maxQueryVariable;
	var minMaxVariable;
	var mainQueryVariable;
	var storeMax2Min;

	return {
		//args: period, dbVendor, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword, 
		//		columns, table, bindingColumn, delimiter, charset, outputPath
		variable: function(args) {
			variable = util.format([
				"var period = %s; ",
				"var dbVendor = %s; ",
				"var jdbc = { ",
				"	driver: '%s', ",
				"	connUrl: '%s', ",
				"	username: '%s', ",
				"	password: '%s', ",
				"}; ",
				"var columns = '%s'; ",
				"var table = '%s'; ",
				"var bindingColumn = '%s'; ",
				"var delimiter = '%s'; ",
				"var charset = '%s'; ",
				"var outputPath = '%s'; "
			].join('\n'), args.period, args.dbVendor, args.jdbcDriver, args.jdbcConnUrl, 
			args.jdbcUsername, args.jdbcPassword, args.columns, args.table,
			args.bindingColumn, args.delimiter, args.charset, args.outputPath);
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
				"/* ",
				"type: db2file ",
				"*/",
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