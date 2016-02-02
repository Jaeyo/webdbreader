package com.igloosec.scripter.service;

import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.ScriptScoreStatisticsDAO;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;
import com.igloosec.scripter.statistics.ScriptScoreStatistics.CounterValues;

public class ScriptScoreStatisticsService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptScoreStatisticsService.class);
	private ScriptScoreStatisticsDAO scriptScoreStatisticsDAO = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsDAO.class);
	private ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	
	public JSONArray getTotalScriptStatistics(){
		JSONArray total = scriptScoreStatisticsDAO.getTotal();
		
		JSONArray currentCountValues = getCurrentCountValuesAsJson();
		if(currentCountValues != null) {
			for (int i = 0; i < currentCountValues.length(); i++)
				total.put(currentCountValues.getJSONObject(i));
		}
		
		return total;
	}
	
	public JSONArray getScriptStatistics(String scriptName) {
		JSONArray statistics = scriptScoreStatisticsDAO.getStatistics(scriptName);
		
		JSONArray currentCountValues = getCurrentCountValuesAsJson();
		if(currentCountValues != null) {
			for (int i = 0; i < currentCountValues.length(); i++) {
				JSONObject countValue = currentCountValues.getJSONObject(i);
				if(countValue.getString("SCRIPT_NAME").equals(scriptName)) {
					statistics.put(countValue);
				}
			}
		}
		
		return statistics;
	}
	
	public JSONObject getLastStatistics(String scriptName, int period) {
		JSONObject json = new JSONObject();
		
		JSONArray rows = scriptScoreStatisticsDAO.getLastStatistics(scriptName, period);
		
		for (int i = 0; i < rows.length(); i++) {
			JSONObject row = rows.getJSONObject(i);
			json.put(row.getString("CATEGORY"), row.getInt("SUM_VALUE"));
		}
		
		JSONArray currentCountValues = getCurrentCountValuesAsJson(scriptName);
		if(currentCountValues != null) {
			for (int i = 0; i < currentCountValues.length(); i++) {
				JSONObject countValue = currentCountValues.getJSONObject(i);
				String category = countValue.getString("CATEGORY");
				int value = countValue.getInt("COUNT_VALUE");
				
				if(json.isNull(category) == true) {
					json.put(category, value);
				} else {
					value += json.getInt(category);
					json.put(category, value);
				}
			}
		}
		
		return json;
	}
	
	private JSONArray getCurrentCountValuesAsJson() {
		return countValuesToJson(scriptScoreStatistics.getCurrentCounterValues());
	}
	
	private JSONArray getCurrentCountValuesAsJson(String scriptName) {
		return countValuesToJson(scriptScoreStatistics.getCurrentCounterValues(scriptName));
	}
	
	private static JSONArray countValuesToJson(Set<CounterValues> countValues) {
		if(countValues == null) return null;
		
		JSONArray jsonArr = new JSONArray();
		
		for(CounterValues countValue: countValues) {
			JSONObject countValueJson = new JSONObject();
			countValueJson.put("COUNT_TIMESTAMP", countValue.getTimestamp());
			countValueJson.put("CATEGORY", countValue.getCategory());
			countValueJson.put("SCRIPT_NAME", countValue.getScriptName());
			countValueJson.put("COUNT_VALUE", countValue.getCount());
			jsonArr.put(countValueJson);
		}
		return jsonArr;
	}
}