package com.igloosec.scripter.service;

import java.util.Date;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.ScriptScoreStatisticsDAO;

public class ScriptScoreStatisticsService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptScoreStatisticsService.class);
	private ScriptScoreStatisticsDAO scriptScoreStatisticsDAO = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsDAO.class);
	
	public void insertStatistics(String scriptName, String category, Long timestamp, Long count){
		scriptScoreStatisticsDAO.insertStatistics(scriptName, category, timestamp, count);
	} //insertStatistics
	
	public void deleteUnderTimestamp(Long timestamp){
		scriptScoreStatisticsDAO.deleteUnderTimestamp(timestamp);
	} //deleteUnderTimestamp
	
	public JSONArray getTotalScriptStatistics(){
		return scriptScoreStatisticsDAO.getTotal();
	}
	
	
	public JSONObject getTotalScriptStatistics(){
		
		TODO IMME
		
		JSONArray oldRows = scriptScoreStatisticsDAO.getTotal();
		Map<Date, JSONObject> rebuildedRows = Maps.newHashMap();
		Set<String> yKeysSet = Sets.newHashSet();
		
		for (int i = 0; i < oldRows.length(); i++) {
			JSONObject oldRow = oldRows.getJSONObject(i);
			Date timestamp = (Date) oldRow.get("COUNT_TIMESTAMP");
			JSONObject row = rebuildedRows.get(timestamp);
			if(row == null) {
				row = new JSONObject().put("timestamp", timestamp);
				rebuildedRows.put(timestamp, row);
			} //i
			String key = String.format("%s(%s)", oldRow.getString("CATEGORY"), oldRow.getString("SCRIPT_NAME"));
			yKeysSet.add(key);
			row.put(key, oldRow.getInt("COUNT_VALUE"));
		} //for i
		
		oldRows = new JSONArray();
		for(JSONObject row : rebuildedRows.values()) {
			for(String key : yKeysSet)
				if(row.isNull(key))
					row.put(key, 0);
			oldRows.put(row);
		} //for row
	
		JSONArray labels = new JSONArray();
		for(String yKey : yKeysSet)
			labels.put(yKey);
		return new JSONObject().put("data", oldRows).put("labels", labels);
	} //getScriptStatisticsCategory
} //class