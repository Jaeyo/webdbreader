package com.igloosec.scripter.script.bindingsV2;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import com.google.common.collect.Lists;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.JsonJdbcTemplate;
import com.igloosec.scripter.rdb.SingleConnectionDataSource;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class Database {
	private ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private ScriptLogger logger = ScriptThread.currentLogger();
	
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
		logger.info(String.format("query: %s, args: %s", query, Arrays.asList(args).toString()));
		
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = getConnection(this.connUrl, this.username, this.password);
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
	
	public void update(String query, Object... args) {
		logger.info(String.format("query: %s, args: %s", query, Arrays.asList(args).toString()));
		
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = getConnection(this.connUrl, this.username, this.password);
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			
			query = convertQuestionMark2RealValue(query, args);
			jdbcTmpl.update(query);
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.OUTPUT);
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	public void batchUpdate(String[] queries) {
		logger.info(String.format("query count: %s, startQuery: %s, endQuery: %s", 
				queries.length, 
				queries.length > 0 ? queries[0] : "null",
				queries.length > 0 ? queries[queries.length-1] : "null"));
		
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = getConnection(this.connUrl, this.username, this.password);
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			
			jdbcTmpl.batchUpdate(queries);
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.OUTPUT, queries.length);
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	private static String convertQuestionMark2RealValue(String query, Object... args) {
		if(args == null) return query;
		
		query = query.replaceAll("\\?", "%s");
		return String.format(query, args);
	}
	
	private static Connection getConnection(String connUrl, String username, String password) throws SQLException {
		if(connUrl.contains("$yyyy")) connUrl = new SimpleDateFormat("yyyy").format(new Date());
		if(connUrl.contains("$mm")) connUrl = new SimpleDateFormat("MM").format(new Date());
		if(connUrl.contains("$dd")) connUrl = new SimpleDateFormat("dd").format(new Date());
		if(connUrl.contains("$hh")) connUrl = new SimpleDateFormat("HH").format(new Date());
		if(connUrl.contains("$mi")) connUrl = new SimpleDateFormat("mm").format(new Date());
		if(connUrl.contains("$ss")) connUrl = new SimpleDateFormat("ss").format(new Date());
		
		return DriverManager.getConnection(connUrl, username, password); 
	}
}