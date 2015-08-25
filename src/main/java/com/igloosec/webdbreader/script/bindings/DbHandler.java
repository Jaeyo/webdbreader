package com.igloosec.webdbreader.script.bindings;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

import com.google.common.base.Function;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.bindings.FileWriterFactory.FileWriter;
import com.igloosec.webdbreader.service.DatabaseService;
import com.igloosec.webdbreader.statistics.ScriptScoreStatics;

public class DbHandler {
	private static final Logger logger = LoggerFactory.getLogger(DbHandler.class);
	private DatabaseService databaseService = SingletonInstanceRepo.getInstance(DatabaseService.class);
	private ScriptScoreStatics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatics.class);

	/**
	 * @param args: {
	 * 		database: {
	 * 			driver: (string)(required)
	 * 			connUrl: (string)(required)
	 * 			username: (string)(required)(encrypted)
	 * 			password: (string)(required)(encrypted)
	 * 		},
	 * 		query: (string)(required)
	 * }
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 */
	public void update(Map<String, Object> args) throws SQLException, ClassNotFoundException{
		Map<String, Object> database = (Map<String, Object>) args.get("database");
		String query = (String) args.get("query");
		
		logger.info("query: {}", query);
		
		Connection conn = null;
		Statement stmt = null;
		try{
			conn = getConnection(database);
			conn.setAutoCommit(true);
			stmt = conn.createStatement();
			stmt.executeUpdate(query);
			
			scriptScoreStatistics.incrementCount();
		} finally {
			close(conn, stmt, null);
		} //finally
	} //query
	
	/**
	 * @param args: {
	 * 		database: {
	 * 			driver: (string)(required)
	 * 			connUrl: (string)(required)
	 * 			username: (string)(required)(encrypted)
	 * 			password: (string)(required)(encrypted)
	 * 		},
	 * 		queries: (array of string)(required)
	 * }
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 */
	public void batch(Map<String, Object> args) throws SQLException, ClassNotFoundException {
		Map<String, Object> database = (Map<String, Object>) args.get("database");
		List<String> queries = (List<String>) args.get("queries");
		
		if(queries.size() != 0)
			logger.info("queries count: {}", queries.size());
		
		Connection conn = null;
		Statement stmt = null;
		try{
			conn = getConnection(database);
			conn.setAutoCommit(true);
			stmt = conn.createStatement();
			for(String query : queries)
				stmt.addBatch(query);
			stmt.executeBatch();
			
			scriptScoreStatistics.incrementCount(queries.size());
		} finally {
			close(conn, stmt, null);
		} //finally
	} //batch
	
	private void query(Connection conn, String query, Function<ResultSet, Void> callback) throws SQLException{
		Statement stmt=null;
		ResultSet rs=null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(query);
			
			while(rs.next())
				callback.apply(rs);
		} finally {
			close(conn, stmt, rs);
		} //finally
	} //query
	
	/**
	 * @param args: {
	 * 		database: {
	 * 			driver: (string)(required)
	 * 			connUrl: (string)(required)
	 * 			username: (string)(required)(encrypted)
	 * 			password: (string)(required)(encrypted)
	 * 		},
	 * 		query: (string)(required)
	 * 		delimiter: (string)(default '|')
	 * 		writer: (FileWriter)(required)
	 * }
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IOException 
	 */
	public void selectAndAppend(Map<String, Object> args) throws ClassNotFoundException, SQLException, IOException{
		Map<String, Object> database = (Map<String, Object>) args.get("database");
		String query = (String) args.get("query");
		String delimiter = (String) args.get("delimiter");
		final FileWriter writer = (FileWriter) args.get("writer");
		
		if(delimiter == null) delimiter = "|";
		
		final String finalDelimiter = delimiter;
		query(getConnection(database), query, new Function<ResultSet, Void>() {
			@Override
			public Void apply(ResultSet rs) {
				try{
					int colCount = rs.getMetaData().getColumnCount();
					StringBuilder rowSb = new StringBuilder();
					for (int i = 0; i < colCount; i++) {
						String value = rs.getString(i);
						if(value != null) 
							rowSb.append(value);
						if(i != 1)
							rowSb.append(finalDelimiter);
					} //for i
					writer.println(rowSb.toString());
				} catch(SQLException e){
					String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
					logger.error(errmsg, e);
				} //catch
				return null;
			} //apply
		});
	} //selectAndAppend

	/**
	 * @param args: {
	 * 		database: {
	 * 			driver: (string)(required)
	 * 			connUrl: (string)(required)
	 * 			username: (string)(required)(encrypted)
	 * 			password: (string)(required)(encrypted)
	 * 		},
	 * 		query: (string)(required)
	 * 		delimiter: (string)(default: '|')
	 * 		lineDelimiter: (string)(default: '\n')
	 * }
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 */
	public String query(Map<String, Object> args) throws ClassNotFoundException, SQLException{
		Map<String, Object> database = (Map<String, Object>) args.get("database");
		String query = (String) args.get("query");
		String delimiter = (String) args.get("delimiter");
		String lineDelimiter = (String) args.get("lineDelimiter");
		
		if(delimiter == null) delimiter = "|";
		if(lineDelimiter == null) lineDelimiter = "\n";
		
		final String finalDelimiter = delimiter;
		final String finalLineDelimiter = lineDelimiter;
		final StringBuilder resultSb = new StringBuilder();
		query(getConnection(database), query, new Function<ResultSet, Void>() {
			@Override
			public Void apply(ResultSet rs){
				try {
					int colCount = rs.getMetaData().getColumnCount();
					StringBuilder rowSb = new StringBuilder();
					for (int i = 0; i < colCount; i++) {
						String value = rs.getString(i);
						if(value != null) rowSb.append(value);
						if(i < colCount) {
							rowSb.append(finalDelimiter);
						} else{
							if(rowSb.toString().trim().length() != 0)
								resultSb.append(rowSb.toString()).append(finalLineDelimiter);
						} //if
					} //for i
				} catch (SQLException e) {
					logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} //catch
				return null;
			} //apply
		});
		
		return resultSb.toString();
	} //query
	
	/**
	 * @param args: {
	 * 		database: {
	 * 			driver: (string)(required)
	 * 			connUrl: (string)(required)
	 * 			username: (string)(required)(encrypted)
	 * 			password: (string)(required)(encrypted)
	 * 		},
	 * 		query: (string)(required)
	 * }
	 * @param callback: function(ResultSet){ ... }
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 */
	public void query(Map<String, Object> args, final sun.org.mozilla.javascript.internal.Function callback) throws ClassNotFoundException, SQLException{
		Map<String, Object> database = (Map<String, Object>) args.get("database");
		String query = (String) args.get("query");
		
		final Context context = Context.enter();
		final ScriptableObject scope = context.initStandardObjects();
		final Scriptable that = context.newObject(scope);
		query(getConnection(database), query, new Function<ResultSet, Void>() {
			@Override
			public Void apply(ResultSet rs) {
				callback.call(context, that, scope, new Object[]{ rs });
				return null;
			} //apply
		});
	} //query
	
	private Connection getConnection(Map<String, Object> database) throws SQLException, ClassNotFoundException{
		Class.forName((String) database.get("driver"));
		String username = (String) database.get("username");
		String password = (String) database.get("password");
		String connUrl = (String) database.get("connUrl");
		
		return DriverManager.getConnection(connUrl, username, password);
	} //getConnection

	private void close(Connection conn, Statement stmt, ResultSet rs) {
		if(conn != null) try{ conn.close(); } catch(SQLException e){}
		if(stmt!= null) try{ stmt.close(); } catch(SQLException e){}
		if(rs!= null) try{ rs.close(); } catch(SQLException e){}
	} //close
} // class