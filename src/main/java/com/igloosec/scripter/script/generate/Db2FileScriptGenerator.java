package com.igloosec.scripter.script.generate;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;

import com.igloosec.scripter.exception.CryptoException;
import com.igloosec.scripter.util.SimpleCrypto;

public class Db2FileScriptGenerator extends ScriptGenerator {
	private static final Logger logger = Logger.getLogger(Db2FileScriptGenerator.class);
	
	public String generate(String period, String dbVendor, String dbIp, String dbPort, 
			String dbSid, String jdbcDriver, String jdbcConnUrl, String jdbcUsername, 
			String jdbcPassword, String columns, String table, String bindingType, 
			String bindingColumn, String delimiter, String charset, String outputPath) throws CryptoException {
		logger.debug(String.format("period: %s, dbVendor: %s, dbIp: %s, dbPort: %s, dbSid: %s, jdbcDriver: %s, " + 
			"jdbdConnUrl: %s, jdbcUsername: %s, jdbcPassword: %s, columns: %s, table: %s, bindingType: %s, " +
			"bindingColumn: %s, delimiter: %s, charset: %s, outputPath: %s", period, dbVendor, dbIp, dbPort,
			dbSid, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword, columns, table, bindingType, bindingColumn,
			delimiter, charset, outputPath));
		
		ScriptBuilder script = new ScriptBuilder();
		
		script.appendLine(super.getTypeVarExp(this.getClass(), bindingType))
			.appendLine("var period = %s;", period)
			.appendLine("var dbVendor = '%s';", dbVendor)
			.appendLine("var dbIp = '%s';", dbIp)
			.appendLine("var dbPort = '%s';", dbPort)
			.appendLine("var dbSid = '%s';", dbSid)
			.appendLine("var jdbcDriver = '%s';", jdbcDriver)
			.appendLine("var jdbcConnUrl = '%s';", jdbcConnUrl)
			.appendLine("var jdbcUsername = '%s';", SimpleCrypto.encrypt(jdbcUsername))
			.appendLine("var jdbcPassword = '%s';", SimpleCrypto.encrypt(jdbcPassword))
			.appendLine("var columns = '%s';", columns)
			.appendLine("var table = '%s';", table)
			.appendLine("var bindingType = '%s';", bindingType);
		
		if(bindingType.equals("simple") == false)
			script.appendLine("var bindingColumn = '%s';", bindingColumn);
		
		script.appendLine("var delimiter = '%s';", delimiter)
			.appendLine("var charset = '%s';", charset)
			.appendLine("var outputPath = '%s';", outputPath)
			.appendLine("var outputFilename = '$yyyy$mm$dd$hh$mi.log';")
			.appendLine();
		
		
		script.appendLine("var repeat = newRepeat({ period: period });")
			.appendLine("var file = newFile({ filename: outputPath + outputFilename, charset: charset });")
			.appendLine("var repo = newRepo();")
			.appendLine("var logger = newLogger();")
			.appendLine("var crypto = newCrypto();")
			.appendLine();
		
		script.appendLine("var jdbc = { ")
			.appendLine("	driver: jdbcDriver,")
			.appendLine("	connUrl: jdbcConnUrl,")
			.appendLine("	username: crypto.decrypt(jdbcUsername),")
			.appendLine("	password: crypto.decrypt(jdbcPassword)")
			.appendLine("};");
		
		script.appendLine("var db = newDatabase(jdbc);")
			.appendLine();
		
		script.appendLine("repeat.run(function() { ");
		script.appendLine("	try {");
		
		if(bindingType.equals("sequence")) {
			script.appendLine("		var min = repo.get('min', { isNull: '0' });")
				.appendLine("		var max = db.query('SELECT MAX(?) FROM ?', [bindingColumn, table]).get({ row: 1, col: 1 });")
				.appendLine("		if(max == null) return;")
				.appendLine();
		} else if(bindingType.equals("date")) {
			script.appendLine("		var min = repo.get('min', { isNull: '%s' });", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()))
				.appendLine("		var max = db.query('SELECT MAX(?) FROM ?', [bindingColumn, table]).get({ row: 1, col: 1 });")
				.appendLine("		if(max == null) return;")
				.appendLine("		else max = dateFormat(max.getTime(), '$yyyy-$mm-$dd $hh:$mi:$ss');")
				.appendLine();
		}
		
		if(bindingType.equals("simple")) {
			script.appendLine("		db.query('SELECT ? FROM ?', [columns, table]).eachRow(function(row) {")
				.appendLine("			var line = row.join(delimiter).split('\\n').join('');")
				.appendLine("			file.appendLine(line);")
				.appendLine("		});")
				.appendLine();
		} else if(bindingType.equals("sequence")) {
			script.appendLine("		db.query('SELECT ? FROM ? WHERE ? > ? AND ? <= ?', [columns, table, bindingColumn, min, bindingColumn, max])")
				.appendLine("			.eachRow(function(row) {")
				.appendLine("				var line = row.join(delimiter).split('\\n').join('');")
				.appendLine("				file.appendLine(line);")
				.appendLine("			});")
				.appendLine();
		} else if(bindingType.equals("date")) {
			if(dbVendor.equals("oracle") || dbVendor.equals("db2") || dbVendor.equals("tibero") || dbVendor.equals("etc")) {
				script.appendLine("		db.query('SELECT ? FROM ? ' + ")
					.appendLine("				'WHERE ? > TO_DATE(\\'?\\', \\'YYYY-MM-DD HH24:MI:SS\\')' + ")
					.appendLine("				'AND ? <= TO_DATE(\\'?\\', \\'YYYY-MM-DD HH24:MI:SS\\')',")
					.appendLine("			[columns, table, bindingColumn, min, bindingColumn, max])")
					.appendLine("			.eachRow(function(row) {")
					.appendLine("				var line = row.join(delimiter).split('\\n').join('');")
					.appendLine("				file.appendLine(line);")
					.appendLine("			});")
					.appendLine();
			} else if(dbVendor.equals("mysql")) {
				script.appendLine("		db.query('SELECT ? FROM ? ' + ")
					.appendLine("				'WHERE ? > STR_TO_DATE(\\'?\\', \\'%Y-%m-%d %H:%i:%s\\')' + ")
					.appendLine("				'AND ? <= STR_TO_DATE(\\'?\\', \\'%Y-%m-%d %H:%i:%s\\')',")
					.appendLine("			[columns, table, bindingColumn, min, bindingColumn, max])")
					.appendLine("			.eachRow(function(row) {")
					.appendLine("				var line = row.join(delimiter).split('\\n').join('');")
					.appendLine("				file.appendLine(line);")
					.appendLine("			});")
					.appendLine();
			} else if(dbVendor.equals("mssql")) {
				script.appendLine("		db.query('SELECT ? FROM ? ' + ")
					.appendLine("				'WHERE ? > \\'?\\'' + ")
					.appendLine("				'AND ? <= \\'?\\'',")
					.appendLine("			[columns, table, bindingColumn, min, bindingColumn, max])")
					.appendLine("			.eachRow(function(row) {")
					.appendLine("				var line = row.join(delimiter).split('\\n').join('');")
					.appendLine("				file.appendLine(line);")
					.appendLine("			});")
					.appendLine();
			}
		}
		
		if(bindingType.equals("simple") == false)
			script.appendLine("		repo.set('min', max);");
		
		script.appendLine("	} catch(err) {");
		script.appendLine("		logger.error(err);");
		script.appendLine("		logger.error(err.rhinoException);");
		script.appendLine("	} ");
		script.appendLine("});");
		
		return script.toString();
	}
}