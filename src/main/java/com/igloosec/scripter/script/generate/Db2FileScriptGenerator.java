package com.igloosec.scripter.script.generate;

import java.text.SimpleDateFormat;
import java.util.Date;

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
			.appendLine()
			.appendLine();
		
		script.appendLine("var jdbc = { ")
			.appendLine("	driver: jdbcDriver,")
			.appendLine("	connUrl: jdbcConnUrl,")
			.appendLine("	username: jdbcUsername,")
			.appendLine("	password: jdbcPassword")
			.appendLine("	};")
			.appendLine();
		
		script.appendLine("var repeat = newRepeat({ period: period });")
			.appendLine("var db = newDatabase(jdbc);")
			.appendLine("var file = newFile({ filename: outputPath + '$yyyy$mm$dd$hh$mm.log', charset: charset });")
			.appendLine();
		
		script.appendLine("repeat.run(function() { ");
		
		if(bindingType.equals("sequence")) {
			script.appendLine("	var min = repo.get('min', { isNull: 0 });")
				.appendLine("	var max = db.query('SELECT MAX(?) FROM ?', bindingColumn, table).get({ row: 0, col: 0 });")
				.appendLine("	if(max == null) return;")
				.appendLine();
		} else if(bindingType.equals("date")) {
			script.appendLine("	var min = repo.get('min', { isNull: '%s' });", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()))
				.appendLine("	var max = db.query('SELECT MAX(?) FROM ?', bindingColumn, table).get({ row: 0, col: 0 });")
				.appendLine("	if(max == null) return;")
				.appendLine("	else max = dateFormat(max, '$yyyy-$mm-$dd $hh:$mi:$ss');")
				.appendLine();
		}
		
		if(bindingType.equals("simple")) {
			script.appendLine("	db.query('SELECT ? FROM ?', columns, table).eachRow(function(row) {")
				.appendLine("		var line = row.join(delimiter).split('\\n').join('');")
				.appendLine("		file.appendLine(line);")
				.appendLine("	});")
				.appendLine();
		} else if(bindingType.equals("sequence")) {
			script.appendLine("	db.query('SELECT ? FROM ? WHERE ? > ? AND ? <= ?', columns, table, bindingColumn, min, bindingColumn, max)")
				.appendLine("		.eachRow(function(row) {")
				.appendLine("			var line = row.join(delimiter).split('\\n').join('');")
				.appendLine("			file.appendLine(line);")
				.appendLine("		});")
				.appendLine();
		} else if(bindingType.equals("date")) {
			if(dbVendor.equals("oracle") || dbVendor.equals("db2") || dbVendor.equals("tibero") || dbVendor.equals("etc")) {
				script.appendLine("	db.query('SELECT ? FROM ? ' + ")
					.appendLine("			'WHERE ? > TO_DATE(\\'?\\', \\'YYYY-MM-DD HH24:MI:SS\\')' + ")
					.appendLine("			'AND ? <= TO_DATE(\\'?\\', \\'YYYY-MM-DD HH24:MI:SS\\')',")
					.appendLine("		columns, table, bindingColumn, min, bindingColumn, max)")
					.appendLine("		.eachRow(function(row) {")
					.appendLine("			var line = row.join(delimiter).split('\\n').join('');")
					.appendLine("			file.appendLine(line);")
					.appendLine("		});")
					.appendLine();
			} else if(dbVendor.equals("mysql")) {
				script.appendLine("	db.query('SELECT ? FROM ? ' + ")
					.appendLine("			'WHERE ? > STR_TO_DATE(\\'?\\', \\'%Y-%m-%d %H:%i:%s\\')' + ")
					.appendLine("			'AND ? <= STR_TO_DATE(\\'?\\', \\'%Y-%m-%d %H:%i:%s\\')',")
					.appendLine("		columns, table, bindingColumn, min, bindingColumn, max)")
					.appendLine("		.eachRow(function(row) {")
					.appendLine("			var line = row.join(delimiter).split('\\n').join('');")
					.appendLine("			file.appendLine(line);")
					.appendLine("		});")
					.appendLine();
			} else if(dbVendor.equals("mssql")) {
				script.appendLine("	db.query('SELECT ? FROM ? ' + ")
					.appendLine("			'WHERE ? > \\'?\\'' + ")
					.appendLine("			'AND ? <= \\'?\\'',")
					.appendLine("		columns, table, bindingColumn, min, bindingColumn, max)")
					.appendLine("		.eachRow(function(row) {")
					.appendLine("			var line = row.join(delimiter).split('\\n').join('');")
					.appendLine("			file.appendLine(line);")
					.appendLine("		});")
					.appendLine();
			}
		}
		
		if(bindingType.equals("simple") == false)
			script.appendLine("	repo.set('min', max);");
		
		script.appendLine("});");
		
		return script.toString();
	}
}