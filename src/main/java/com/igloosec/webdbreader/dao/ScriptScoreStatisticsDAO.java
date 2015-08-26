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
	
	public void insertStatistics(String scriptName, String category, long timestamp, long count){
		ds.getJdbcTmpl().update("INSERT INTO script_score_statistics (script_name, count_timestamp, count_value) VALUES(?,?,?)", 
				scriptName, new Date(timestamp), count);
	} //insertStatistics
	
	public void deleteUnderTimestamp(long timestamp){
		logger.info("timestamp: {}", timestamp);
		ds.getJdbcTmpl().update("DELETE FROM script_score_statistics WHERE count_timestamp < ?", new Date(timestamp));
	} //deleteUnderTimestamp
	
	public JSONArray getScriptStatistics(String scriptName){
		return ds.getJdbcTmpl().queryForJsonArray("SELECT category, count_timestamp, count_value "
				+ "FROM script_score_statistics "
				+ "WHERE script_name = ? "
				+ "ORDER BY category, count_timestamp", scriptName);
	} //getScriptStatistics
}  //class