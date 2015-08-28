package com.igloosec.webdbreader.dao;

import java.util.Date;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class OperationHistoryDAO {
	public static final int HISTORY_LIMIT = 1000;
	private static final Logger logger = LoggerFactory.getLogger(OperationHistoryDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void saveHistory(String scriptName, boolean isStartup){
		String query = "INSERT INTO operation_history "
				+ "(regdate, script_name, is_startup) "
				+ "VALUES(?, ?, ?)";
		ds.getJdbcTmpl().update(query, new Date(), scriptName, isStartup);
		removeOldestHistoryIfLimit(scriptName);
	} //saveHistory
	
	private void removeOldestHistoryIfLimit(String scriptName){
		String query =  "SELECT count(*) FROM operation_history WHERE script_name = ?";
		int count = ds.getJdbcTmpl().queryForObject(query, new Object[]{ scriptName }, Integer.class);
		if(count >= HISTORY_LIMIT){
			query = "DELETE FROM operation_history "
				+ "WHERE script_name = ? "
				+ "AND regdate <= (SELECT MIN(regdate) FROM operation_history WHERE script_name = ?)";
			ds.getJdbcTmpl().update(query, scriptName, scriptName);
		} //if
	} //removeOldestHistoryIfLimit
	
	public JSONArray loadHistory(String scriptName, int count){
		String query = "SELECT regdate, script_name, is_startup "
				+ "FROM operation_history "
				+ "WHERE script_name = ? "
				+ "ORDER BY regdate DESC "
				+ "OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY";
		return ds.getJdbcTmpl().queryForJsonArray(query, scriptName, count);
	} //loadHistory
	
	public JSONArray loadHistory(int count){
		String query = "SELECT regdate, script_name, is_startup "
				+ "FROM operation_history "
				+ "ORDER BY regdate DESC "
				+ "OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY";
		return ds.getJdbcTmpl().queryForJsonArray(query, count);
	} //loadHistory
	
	public void renameScript(String scriptName, String newScriptName){
		ds.getJdbcTmpl().update("UPDATE operation_history set script_name = ? where script_name = ?", newScriptName, scriptName);
	} //renameScript
	
	public void remove(String scriptName){
		ds.getJdbcTmpl().update("DELETE FROM operation_history WHERE script_name = ?", scriptName);
	} //remove
} //class