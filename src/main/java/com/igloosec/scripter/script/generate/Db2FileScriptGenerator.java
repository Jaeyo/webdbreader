package com.igloosec.scripter.script.generate;

public class Db2FileScriptGenerator extends ScriptGenerator {
	
	public String generate(String period, String dbVendor, String dbIp, String dbPort, 
			String dbSid, String jdbcDriver, String jdbcConnUrl, String jdbcUsername, 
			String jdbcPassword, String columns, String table, String bindingType, 
			String bindingColumn, String delimiter, String charset, String outputPath) {
		ScriptBuilder script = new ScriptBuilder();
		
		script.appendLine(super.getTypeVarExp(this.getClass(), bindingType))
			.appendLine("var period = %s;", period)
			.appendLine("var dbVendor = '%s';", dbVendor)
			.appendLine("var dbIp = '%s';", dbIp)
			.appendLine("var dbPort = '%s';", dbPort)
			.appendLine("var dbSid = '%s';", dbSid)
			.appendLine("var jdbcDriver = '%s';", jdbcDriver)
			.appendLine("var jdbcConnUrl = '%s';", jdbcConnUrl)
			.appendLine("var jdbcUsername = '%s';", jdbcUsername)
			.appendLine("var jdbcPassword = '%s';", jdbcPassword)
			.appendLine("var columns = '%s';", columns)
			.appendLine("var table = '%s';", table)
			.appendLine("var bindingType = '%s';", bindingType);
		
		if(bindingType.equals("simple") == false)
			script.appendLine("var bindingColumn = '%s';", bindingColumn);
		
		script.appendLine("var delimiter = '%s';", delimiter)
			.appendLine("var charset = '%s';", charset)
			.appendLine("var outputPath = '%s';", outputPath)
			.appendLine();
		
		script.appendLine("var jdbc = { driver: jdbcDriver, connUrl: jdbcConnUrl, username: jdbcUsername, password: jdbcPassword };")
			.appendLine();
		
		script.appendLine("schedule(period).run(function() {");
		
		if(bindingType.equals("simple") == false) {
			script.appendLine("	var maxQuery = format( ")
				.appendLine("		'SELECT MAX({bindingColumn}) FROM {table}', ")
				.appendLine("		{ bindingColumn: bindingColumn, table: table } ")
				.appendLine("	); ")
				.appendLine();
		}
		
		if(bindingType.equals("sequence")) {
			script.appendLine("	var min = repo('min');")
				.appendLine("	if(min == null) min = 0;")
				.appendLine("	var max = null;")
				.appendLine("	database(jdbc).select(maxQuery).first(function(row) {")
				.appendLine("		max = row[0];")
				.appendLine("	}).run();")
				.appendLine("")
				.appendLine("	if(min === max) return;")
				.appendLine();
		} else if(bindingType.equals("date")) {
				script.appendLine("	var min = repo('min');")
					.appendLine("	var max = null;")
					.appendLine("	database(jdbc).select(maxQuery).first(function(row) {")
					.appendLine("		max = date(row[0]).format('yyyy-MM-dd HH:mm:ss'); ")
					.appendLine("	}).run();")
					.appendLine()
					.appendLine("	if(min === max) return;")
					.appendLine("	if(min == null) {")
					.appendLine("		repo('min', max); ")
					.appendLine("		return;")
					.appendLine("	}")
					.appendLine();
		}
		
		if(bindingType.equals("simple")) {
			script.appendLine("	var mainQuery = format(")
				.appendLine("		'SELECT {columns} FROM {table}', ")
				.appendLine("		{ columns: columns, table: table } ")
				.appendLine("	); ")
				.appendLine();
		} else if(bindingType.equals("sequence")) {
			script.appendLine("	var mainQuery = format( ")
				.appendLine("		'SELECT {columns} FROM {table} WHERE {bindingColumn} > {min} AND {bindingColumn} <= {max}', ")
				.appendLine("		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ")
				.appendLine("	); ")
				.appendLine();
		} else if(bindingType.equals("date")) {
			if(dbVendor.equals("oracle") || dbVendor.equals("db2") || dbVendor.equals("tibero") || dbVendor.equals("etc")) {
				script.appendLine("	var mainQuery = format( ")
					.appendLine("		'SELECT {columns} FROM {table} ' +  ")
					.appendLine("		' WHERE {bindingColumn} > TO_DATE(\\'{min}\\', \\'YYYY-MM-DD HH24:MI:SS\\') ' + ")
					.appendLine("		' AND {bindingColumn} <= TO_DATE(\\'{max}\\', \\'YYYY-MM-DD HH24:MI:SS\\') ', ")
					.appendLine("		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ")
					.appendLine("	);")
					.appendLine();
			} else if(dbVendor.equals("mysql")) {
				script.appendLine("	var mainQuery = format( ")
					.appendLine("		'SELECT {columns} FROM {table} ' +  ")
					.appendLine("		' WHERE {bindingColumn} > STR_TO_DATE(\\'{min}\\', \\'%Y-%m-%d %H:%i:%s\\') ' + ")
					.appendLine("		' AND {bindingColumn} <= STR_TO_DATE(\\'{max}\\', \\'%Y-%m-%d %H:%i:%s\\') ', ")
					.appendLine("		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ")
					.appendLine("	); ")
					.appendLine();
			} else if(dbVendor.equals("mssql")) {
				script.appendLine("	var mainQuery = format( ")
					.appendLine("		'SELECT {columns} FROM {table} ' +  ")
					.appendLine("		' WHERE {bindingColumn} > STR_TO_DATE(\\'{min}\\', \\'%Y-%m-%d %H:%i:%s\\') ' + ")
					.appendLine("		' AND {bindingColumn} <= STR_TO_DATE(\\'{max}\\', \\'%Y-%m-%d %H:%i:%s\\') ', ")
					.appendLine("		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max } ")
					.appendLine("	); ")
					.appendLine();
			}
		}
		
		script
			.appendLine("	database(jdbc)")
			.appendLine("		.select(mainQuery)")
			.appendLine("		.map(function(row) {")
			.appendLine("			return row.join(delimiter).split('\\n').join('') + '\\n';")
			.appendLine("		}) ")
			.appendLine("		.group(100) ")
			.appendLine("		.writeTextFile({ ")
			.appendLine("			filename: outputFile, ")
			.appendLine("			charset: charset, ")
			.appendLine("			dateFormat: true, ")
			.appendLine("		}).run(); ")
			.appendLine();

		script.appendLine("});");
		
		return script.toString();
	}
}