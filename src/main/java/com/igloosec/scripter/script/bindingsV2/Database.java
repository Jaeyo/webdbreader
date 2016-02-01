package com.igloosec.scripter.script.bindingsV2;

import java.sql.Connection;
import java.sql.DriverManager;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.JsonJdbcTemplate;
import com.igloosec.scripter.rdb.SingleConnectionDataSource;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class Database {
	private ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private static final ScriptLogger logger = ScriptThread.currentLogger();
	
	private String driver;
	private String connUrl;
	private String username;
	private String password;
	
	public Database(String driver, String connUrl, String username, String password) {
		this.driver = driver;
		this.connUrl = connUrl;
		this.username = username;
		this.password = password;
	}
	
	public QueryResult query(String query) {
		return query(query, null);
	}
	
	public QueryResult query(String query, String... args) {
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = DriverManager.getConnection(this.connUrl, this.username, this.password);
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			
			query = convertQuestionMark2RealValue(query, args);
			return new QueryResult(jdbcTmpl.queryForRowSet(query));
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		}
	}
	
	public void update(String query) {
		update(query, null);
	}
	
	public void update(String query, String... args) {
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = DriverManager.getConnection(this.connUrl, this.username, this.password);
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			
			query = convertQuestionMark2RealValue(query, args);
			jdbcTmpl.update(query);
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.OUTPUT);
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	private static String convertQuestionMark2RealValue(String query, String... args) {
		if(args == null) return query;
		
		query = query.replaceAll("\\?", "%s");
		return String.format(query, args);
	}
}