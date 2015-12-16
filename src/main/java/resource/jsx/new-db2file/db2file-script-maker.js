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

	if(args.bindingType !== 'simple') {
		script += [
			util.format("var bindingColumn = '%s';", args.bindingColumn)
		].join('\n');
	}

	script += [
		util.format("var delimiter = '%s';", args.delimiter),
		util.format("var charset = '%s';", args.charset),
		util.format("var outputPath = '%s';", args.outputPath)
	].join('\n');


	script += [
		"var jdbc = { driver: jdbcDriver, connUrl: jdbcConnUrl, username: jdbcUsername, password: jdbcPassword };"
	].join('\n');


	script += [
		"schedule(period).run(function() {"
	].join('\n');

	if(args.bindingType !== 'simple') {
		script += [
			"	var maxQuery = format( ",
			"		'SELECT MAX({bindingColumn}) FROM {table}', ",
			"		{ bindingColumn: bindingColumn, table: table } ",
			"	); ",
			""
		].join('\n');
	}

	switch(args.bindingType) {
		case 'sequence': 
			script += [
				"	var min = repo('min');",
				"	if(min == null) min = 0;",
				"	var max = null;",
				"	database(jdbc).select(maxQuery).first(function(row) {",
				"		max = row[0];",
				"	}).run();",
				"",
				"	if(min === max) return;",
				""
			].join('\n'); break;
		case 'date': 
			script += [
				"	var min = repo('min');",
				"	var max = null;",
				"	database(jdbc).select(maxQuery).first(function(row) {",
				"		max = date(row[0]).format('yyyy-MM-dd HH:mm:ss'); ",
				"	}).run();",
				"",
				"	if(min === max) return;",
				"	if(min == null) {",
				"		repo('min', max); ",
				"		return;",
				"	}",
				""
			].join('\n'); break;
	}

	switch(args.bindingType) {
		case 'simple':
			script += [
				"	var mainQuery = format(",
				"		'SELECT {columns} FROM {table}', ",
				"		{ columns: columns, table: table } ",
				"	); ",
			].join('\n'); break;
		case 'sequence':
			script += [
				"	var mainQuery = format( ",
				"		'SELECT {columns} FROM {table} WHERE {bindingColumn} > {min} AND {bindingColumn} <= {max}', ",
				"		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ",
				"	); "
			].join('\n'); break;
		case 'date':
			switch(args.dbVendor) {
				case 'oracle':
				case 'db2':
				case 'tibero':
				case 'etc':
					script += [
						"	var mainQuery = format( ",
						"		'SELECT {columns} FROM {table} ' +  ",
						"		' WHERE {bindingColumn} > TO_DATE(\'{min}\', \'YYYY-MM-DD HH24:MI:SS\') ' + ",
						"		' AND {bindingColumn} <= TO_DATE(\'{max}\', \'YYYY-MM-DD HH24:MI:SS\') ', ",
						"		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ",
						"	); "
					].join('\n'); break;
				case 'mysql':
					script += [
						"	var mainQuery = format( ",
						"		'SELECT {columns} FROM {table} ' +  ",
						"		' WHERE {bindingColumn} > STR_TO_DATE(\'{min}\', \'%Y-%m-%d %H:%i:%s\') ' + ",
						"		' AND {bindingColumn} <= STR_TO_DATE(\'{max}\', \'%Y-%m-%d %H:%i:%s\') ', ",
						"		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ",
						"	); "
					].join('\n'); break;
				case 'mysql':
					script += [
						"	var mainQuery = format( ",
						"		'SELECT {columns} FROM {table} ' +  ",
						"		' WHERE {bindingColumn} > \'{min}\' ' + ",
						"		' AND {bindingColumn} <= \'{max}\' ', ",
						"		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ",
						"	); "
					].join('\n'); break;
			}
			break;
	}

	script += [
		"",
		"	database(jdbc)",
		"		.select(mainQuery)",
		"		.map(function(row) {",
		"			return row.join(delimiter).split('\n').join('') + '\n';",
		"		}) ",
		"		.group(100) ",
		"		.writeTextFile({ ",
		"			filename: outputFile, ",
		"			charset: charset, ",
		"			dateFormat: true, ",
		"		}).run(); ",
		"}); "
	].join('\n');
};