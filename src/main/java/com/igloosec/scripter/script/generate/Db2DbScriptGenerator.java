package com.igloosec.scripter.script.generate;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;

public class Db2DbScriptGenerator extends ScriptGenerator {
	private static final Logger logger = Logger.getLogger(Db2DbScriptGenerator.class);
	
	public String generate(String srcDbVendor, String srcDbIp, String srcDbPort, String srcDbSid, 
			String srcJdbcDriver, String srcJdbcConnUrl, String srcJdbcUsername, String srcJdbcPassword,
			String srcTable, String srcColumns, String destDbVendor, String destDbIp, String destDbPort,
			String destDbSid, String destJdbcDriver, String destJdbcConnUrl, String destJdbcUsername,
			String destJdbcPassword, String destTable, String destColumns, String bindingType,
			String srcBindingColumn, String period, String deleteAllBeforeInsert) {
		logger.debug(String.format("srcDbVendor: %s, srcDbIp: %s, srcDbPort: %s, srcDbSid: %s, srcJdbcDriver: %s, "
				+ "srcJdbcConnUrl: %s, srcJdbcUsername: %s, srcJdbcPassword: %s, srcTable: %s, "
				+ "srcColumns: %s, destDbVendor: %s, destDbIp: %s, destDbPort: %s, destDbSid: %s, "
				+ "destJdbcDriver: %s, destJdbcConnUrl: %s, destJdbcUsername: %s, destJdbcPassword: %s, "
				+ "destTable: %s, destColumns: %s, bindingType: %s, srcBindingColumn: %s, period: %s, "
				+ "deleteAllBeforeInsert: %s",
				srcDbVendor, srcDbIp, srcDbPort, srcDbSid, srcJdbcDriver, srcJdbcConnUrl, srcJdbcUsername, 
				srcJdbcPassword, srcTable, srcColumns, destDbVendor, destDbIp, destDbPort, destDbSid, 
				destJdbcDriver, destJdbcConnUrl, destJdbcUsername, destJdbcPassword, destTable, destColumns, 
				bindingType, srcBindingColumn, period, deleteAllBeforeInsert));
		
		ScriptBuilder script = new ScriptBuilder();
		
		script.appendLine(super.getTypeVarExp(this.getClass(), bindingType))
			.appendLine("var srcDbVendor = '%s';", srcDbVendor)
			.appendLine("var srcDbIp = '%s';", srcDbIp)
			.appendLine("var srcDbPort = '%s';", srcDbPort)
			.appendLine("var srcDbSid = '%s';", srcDbSid)
			.appendLine("var srcJdbcDriver = '%s';", srcJdbcDriver)
			.appendLine("var srcJdbcConnUrl = '%s';", srcJdbcConnUrl)
			.appendLine("var srcJdbcUsername = '%s';", srcJdbcUsername)
			.appendLine("var srcJdbcPassword = '%s';", srcJdbcPassword)
			.appendLine("var srcTable = '%s';", srcTable)
			.appendLine("var srcColumns = '%s';", srcColumns)
			.appendLine("var destDbVendor = '%s';", destDbVendor)
			.appendLine("var destDbIp = '%s';", destDbIp)
			.appendLine("var destDbPort = '%s';", destDbPort)
			.appendLine("var destDbSid = '%s';", destDbSid)
			.appendLine("var destJdbcDriver = '%s';", destJdbcDriver)
			.appendLine("var destJdbcConnUrl = '%s';", destJdbcConnUrl)
			.appendLine("var destJdbcUsername = '%s';", destJdbcUsername)
			.appendLine("var destJdbcPassword = '%s';", destJdbcPassword)
			.appendLine("var destTable = '%s';", destTable)
			.appendLine("var destColumns = '%s';", destColumns)
			.appendLine("var srcBindingColumn = '%s';", srcBindingColumn)
			.appendLine("var period = %s;", period);
		
		if(bindingType.equals("simple") == true) {
			script.appendLine("var deleteAllBeforeInsert = %s;", deleteAllBeforeInsert);
		} else {
			script.appendLine("var bindingType = '%s';", bindingType);
		}
		
		script
			.appendLine()
			.appendLine();
		
		script.appendLine("var repeat = newRepeat({ period: period });")
			.appendLine("var repo = newRepo();")
			.appendLine("var logger = newLogger();")
			.appendLine("var crypto = newCrypto();")
			.appendLine("var srcDb = newDatabase({")
			.appendLine("	driver: srcJdbcDriver,")
			.appendLine("	connUrl: srcJdbcConnUrl,")
			.appendLine("	username: srcJdbcUsername,")
			.appendLine("	password: srcJdbcPassword")
			.appendLine("});")
			.appendLine("var destDb = newDatabase({")
			.appendLine("	driver: destJdbcDriver,")
			.appendLine("	connUrl: destJdbcConnUrl,")
			.appendLine("	username: destJdbcUsername,")
			.appendLine("	password: destJdbcPassword")
			.appendLine("});")
			.appendLine();
		
		script.appendLine("repeat.run(function() {")
			.appendLine("	try {")
			.appendLine("		var currentSrcTable = replaceWithCurrentDate(srcTable);")
			.appendLine("		var currentDestTable = replaceWithCurrentDate(destTable);")
			.appendLine();
		
		if(bindingType.equals("sequence")) {
			script.appendLine("		var min = repo.get('min', { isNull: '0' });")
				.appendLine("		var max = srcDb.query('SELECT MAX(?) FROM ?', [ srcBindingColumn, currentSrcTable ]).get({ row: 1, col: 1 });")
				.appendLine("		if(max == null) return;")
				.appendLine();
		} else if(bindingType.equals("date")) {
			script.appendLine("		var min = repo.get('min', { isNull: '%s' });", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()))
				.appendLine("		var max = srcDb.query('SELECT MAX(?) FROM ?', [ srcBindingColumn, currentSrcTable ]).get({ row: 1, col: 1 });")
				.appendLine("		if(max == null) return;")
				.appendLine("		else max = dateFormat(max.getTime(), '$yyyy-$mm-$dd $hh:$mi:$ss');")
				.appendLine();
		}
		
		String queryLine = null;
		if(bindingType.equals("simple")) {
			queryLine = "			.query('SELECT ? FROM ?', [ srcColumns, currentSrcTable ])";
		} else if(bindingType.equals("sequence")) {
			queryLine = "			.query('SELECT ? FROM ? WHERE ? > ? AND ? <= ?', [ srcColumns, currentSrcTable, srcBindingColumn, min, srcBindingColumn, max ])";
		} else if(bindingType.equals("date")) {
			if(srcDbVendor.equals("oracle") || srcDbVendor.equals("db2") || srcDbVendor.equals("tibero") || srcDbVendor.equals("etc")) {
				queryLine = "			.query('SELECT ? FROM ? WHERE ? > TO_DATE(\\'?\\', \\'YYYY-MM-DD HH24:MI:SS\\') AND ? <= TO_DATE(\\'?\\', \\'YYYY-MM-DD HH24:MI:SS\\')'," + 
							"					[ srcColumns, currentSrcTable, srcBindingColumn, min, srcBindingColumn, max ])";
			} else if(srcDbVendor.equals("mysql")) {
				queryLine = "			.query('SELECT ? FROM ? WHERE ? > STR_TO_DATE(\\'?\\', \\'%Y-%m-%d %H:%i:%s\\') AND ? <= STR_TO_DATE(\\'?\\', \\'%Y-%m-%d %H:%i:%s\\')'," + 
							"					[ srcColumns, currentSrcTable, srcBindingColumn, min, srcBindingColumn, max ])";
			} else if(srcDbVendor.equals("mssql")) {
				queryLine = "			.query('SELECT ? FROM ? WHERE ? > \\'?\\' AND ? <= \\'?\\''," + 
							"					[ srcColumns, currentSrcTable, srcBindingColumn, min, srcBindingColumn, max ])";
			}
		}
		
		if(bindingType.equals("simple")) {
			script.appendLine("		if(deleteAllBeforeInsert === true)")
				.appendLine("			destDb.update('delete from ?', [ currentDestTable ]);")
				.appendLine();
		}
		
		script.appendLine("		srcDb")
			.appendLine(queryLine)
			.appendLine("			.eachRow(function(row) {")
			.appendLine("				var values = [];")
			.appendLine("				row.eachColumn(function(column) {")
			.appendLine("					if(isNumber(column) === true) values.push(column);")
			.appendLine("					else if(isDate(column) === true) {")
			.appendLine("						column = dateFormat(column.getTime(), '$yyyy-$mm-$dd $hh:$mi:$ss'); ");
		if(srcDbVendor.equals("oracle") || srcDbVendor.equals("db2") || srcDbVendor.equals("tibero") || srcDbVendor.equals("etc")) {
			script.appendLine("						values.push('TO_DATE(\\'' + column + '\\', \\'YYYY-MM-DD HH24:MI:SS\\')');");
		} else if(srcDbVendor.equals("mysql")) {
			script.appendLine("						values.push('STR_TO_DATE(\\'' + column + '\\', \\'%Y-%m-%d %H:%i:%s\\')');");
		} else if(srcDbVendor.equals("mssql")) {
			script.appendLine("						values.push('\\'column\\'');");
		}
		script.appendLine("					} else values.push(\"'\" + column + \"'\");")
			.appendLine("				});")
			.appendLine("				destDb.update('insert into ? (?) values(?)', [ currentDestTable, destColumns, values.join(',') ]);")
			.appendLine("			});");
			
		if(bindingType.equals("simple") == false) {
			script.appendLine()
				.appendLine("		repo.set('min', max);");
		}
		
		script.appendLine("	} catch(err) {");
		script.appendLine("		logger.error(err);");
		script.appendLine("		logger.error(err.rhinoException);");
		script.appendLine("	}");
		
		script.appendLine("});");
		
		return script.toString();
	}
}