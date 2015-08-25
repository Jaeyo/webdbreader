package com.igloosec.webdbreader.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.ScriptScoreStatisticsDAO;

public class ScriptScoreStatisticsService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptScoreStatisticsService.class);
	private ScriptScoreStatisticsDAO scriptScoreStatisticsDAO = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsDAO.class);
	
	public void insertStatistics(String scriptName, long timestamp, long count){
		scriptScoreStatisticsDAO.insertStatistics(scriptName, timestamp, count);
	} //insertStatistics
	
	public void deleteUnderTimestamp(long timestamp){
		scriptScoreStatisticsDAO.deleteUnderTimestamp(timestamp);
	} //deleteUnderTimestamp
	
	public JSONArray getScriptStatistics(String scriptName){
		JSONArray statistics = scriptScoreStatisticsDAO.getScriptStatistics(scriptName);
		JSONArray rebuildedStatistics = new JSONArray();
		
		for (int i = 0; i < statistics.length(); i++) {
			JSONObject row = statistics.getJSONObject(i);
			JSONArray rebuildedRow = new JSONArray();
			rebuildedRow.put(row.get("COUNT_TIMESTAMP"));
			rebuildedRow.put(row.get("COUNT_VALUE"));
			rebuildedStatistics.put(rebuildedRow);
		} //for i
		
		return rebuildedStatistics;
	} //getScriptStatistics
} //class