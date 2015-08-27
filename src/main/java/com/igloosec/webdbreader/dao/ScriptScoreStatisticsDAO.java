package com.igloosec.webdbreader.dao;

import java.util.Date;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class ScriptScoreStatisticsDAO {
	private static final Logger logger = LoggerFactory.getLogger(ScriptScoreStatisticsDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void insertStatistics(String scriptName, String category, Long timestamp, Long count){
		ds.getJdbcTmpl().update("INSERT INTO script_score_statistics (category, script_name, count_timestamp, count_value) VALUES(?,?,?,?)", 
				category, scriptName, new Date(timestamp), count);
	} //insertStatistics
	
	public void deleteUnderTimestamp(Long timestamp){
		logger.info("timestamp: {}", timestamp);
		ds.getJdbcTmpl().update("DELETE FROM script_score_statistics WHERE count_timestamp < ?", new Date(timestamp));
	} //deleteUnderTimestamp
	
	public JSONArray getScriptStatistics(String scriptName){
		return ds.getJdbcTmpl().queryForJsonArray("SELECT category, count_timestamp, count_value "
				+ "FROM script_score_statistics "
				+ "WHERE script_name = ? "
				+ "ORDER BY category, count_timestamp", scriptName);
	} //getScriptStatistics
	
	public void renameScript(String scriptName, String newScriptName){
		ds.getJdbcTmpl().update("UPDATE script_score_statistics SET script_name = ? WHERE script_name = ?", newScriptName, scriptName);
	} //renameScript
	
	public void remove(String scriptName){
		ds.getJdbcTmpl().update("DELETE FROM script_score_statistics WHERE script_name = ?", scriptName);
	} //remove
}  //class