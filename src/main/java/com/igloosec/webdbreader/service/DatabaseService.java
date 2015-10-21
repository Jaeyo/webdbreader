package com.igloosec.webdbreader.service;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;

import com.google.common.base.Function;
import com.igloosec.webdbreader.exception.CryptoException;
import com.igloosec.webdbreader.rdb.JsonJdbcTemplate;
import com.igloosec.webdbreader.rdb.SingleConnectionDataSource;
import com.igloosec.webdbreader.util.JdbcUtil;
import com.igloosec.webdbreader.util.SimpleCrypto;

public class DatabaseService {
	private static final Logger logger = LoggerFactory.getLogger(DatabaseService.class);
	
	public JSONArray getTables(JSONObject jdbcParams) throws ClassNotFoundException, JSONException, SQLException, CryptoException{
		Connection conn = null;
		ResultSet rs = null;
		
		String username = jdbcParams.getString("username");
		String password = jdbcParams.getString("password");
		
		try{
			Class.forName(jdbcParams.getString("driver"));
			conn = DriverManager.getConnection(jdbcParams.getString("connUrl"), username, password);
			DatabaseMetaData meta = conn.getMetaData();
			
			rs = meta.getTables(null, username, "%", new String[]{ "TABLE" });
			JSONArray result = new JSONArray();
			while(rs.next())
				result.put(rs.getString(3));
			
			if(result.length() != 0)
				return result;
			
			rs.close();
			rs = meta.getTables(null, username.toLowerCase(), "%", new String[]{ "TABLE" });
			while(rs.next())
				result.put(rs.getString(3));
	
			if(result.length() != 0)
				return result;
			
			rs.close();
			rs = meta.getTables(null, username.toUpperCase(), "%", new String[]{ "TABLE" });
			while(rs.next())
				result.put(rs.getString(3));
			
			return result;
		} finally{
			if(conn != null)
				conn.close();
			if(rs != null)
				rs.close();
		} //finally
	} //getTables

	public JSONArray getColumns(JSONObject jdbcParams, String tableName) throws ClassNotFoundException, JSONException, SQLException, CryptoException{
		Connection conn = null;
		ResultSet rs = null;
		
		String username = jdbcParams.getString("username");
		String password = jdbcParams.getString("password");
		
		try{
			Class.forName(jdbcParams.getString("driver"));
			conn = DriverManager.getConnection(jdbcParams.getString("connUrl"), username, password);
			DatabaseMetaData meta = conn.getMetaData();
			
			Function<ResultSet, JSONArray> handleResultSetFunction = new Function<ResultSet, JSONArray>() {
				@Override
				public JSONArray apply(ResultSet rs) {
					try{
						JSONArray result = new JSONArray();
						while(rs.next()){
							JSONObject columnInfo = new JSONObject();
							columnInfo.put("columnName", rs.getString(4));
							columnInfo.put("columnType", JdbcUtil.convertDataTypeCode2String(rs.getInt(5)));
							result.put(columnInfo);
						} //while
						return result;
					} catch(Exception e){
						logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
						return null;
					} //catch
				} //apply
			};
			
			JSONArray result = null;
			
			rs = meta.getColumns(null, username, tableName, null);
			result = handleResultSetFunction.apply(rs);
			
			if(result.length() != 0) 
				return result;
			
			rs.close();
			rs = meta.getColumns(null, username.toLowerCase(), tableName.toLowerCase(), null);
			result = handleResultSetFunction.apply(rs);
	
			if(result.length() != 0)
				return result;
			
			rs.close();
			rs = meta.getColumns(null, username.toUpperCase(), tableName.toUpperCase(), null);
			result = handleResultSetFunction.apply(rs);
			return result;
		} finally{
			if(conn != null)
				conn.close();
			if(rs != null)
				rs.close();
		} //finally
	} //getColumns
	
	public JSONArray querySampleData(JSONObject jdbcParams, String query, final int rowCount) throws JSONException, SQLException, ClassNotFoundException, CryptoException{
		Class.forName(jdbcParams.getString("driver"));
		
		String username = SimpleCrypto.decrypt(jdbcParams.getString("username"));
		String password = SimpleCrypto.decrypt(jdbcParams.getString("password"));
		
		Connection conn = DriverManager.getConnection(jdbcParams.getString("connUrl"), username, password);
		try{
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			return jdbcTmpl.query(query, new ResultSetExtractor<JSONArray>() {
				@Override
				public JSONArray extractData(ResultSet rs) throws SQLException, DataAccessException {
					int counter = 0;
					JSONArray rows = new JSONArray();
					ResultSetMetaData meta = rs.getMetaData();
					int colCount = meta.getColumnCount();
					while(rs.next()){
						counter++;
						if(counter > rowCount)
							break;
	
						JSONObject row = new JSONObject();
						for (int i = 1; i <= colCount; i++)
							row.put(meta.getColumnLabel(i), rs.getObject(i));
						rows.put(row);
					} //while
					return rows;
				} //extractData
			});
		} finally{
			if(conn != null)
				conn.close();
		} //finally
	} //querySampleData 
} //class