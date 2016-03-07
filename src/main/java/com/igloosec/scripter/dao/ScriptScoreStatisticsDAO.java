package com.igloosec.scripter.dao;

import java.util.Date;

import org.json.JSONArray;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class ScriptScoreStatisticsDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void insertStatistics(String scriptName, String category, Long timestamp, Long count){
		ds.getJdbcTmpl().update("INSERT INTO script_score_statistics (category, script_name, count_timestamp, count_value) VALUES(?,?,?,?)", 
				category, scriptName, new Date(timestamp), count);
	}
	
	public void deleteUnderTimestamp(Long timestamp){
		ds.getJdbcTmpl().update("DELETE FROM script_score_statistics WHERE count_timestamp < ?", new Date(timestamp));
	}
	
	public JSONArray getTotal(){
		String query = "SELECT count_timestamp, category, script_name, count_value FROM script_score_statistics ORDER BY count_timestamp";
		return ds.getJdbcTmpl().queryForJsonArray(query);
	}
	
	public JSONArray getStatistics(String scriptName) {
		String query = "SELECT count_timestamp, category, script_name, count_value FROM script_score_statistics WHERE script_name = ? ORDER BY count_timestamp";
		return ds.getJdbcTmpl().queryForJsonArray(query, scriptName);
	}
	
	public JSONArray getLastStatistics(String scriptName, int period) {
		Date targetTimestamp = new Date(System.currentTimeMillis() - period);
		String query = "SELECT category, SUM(count_value) AS sum_value FROM script_score_statistics WHERE script_name = ? AND count_timestamp > ? GROUP BY category";
		return ds.getJdbcTmpl().queryForJsonArray(query, scriptName, targetTimestamp);
	}
	
	public void renameScript(String scriptName, String newScriptName){
		ds.getJdbcTmpl().update("UPDATE script_score_statistics SET script_name = ? WHERE script_name = ?", newScriptName, scriptName);
	}
	
	public void remove(String scriptName){
		ds.getJdbcTmpl().update("DELETE FROM script_score_statistics WHERE script_name = ?", scriptName);
	}
} 