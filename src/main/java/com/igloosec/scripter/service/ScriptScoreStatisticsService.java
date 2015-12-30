package com.igloosec.scripter.service;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.ScriptScoreStatisticsDAO;

public class ScriptScoreStatisticsService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptScoreStatisticsService.class);
	private ScriptScoreStatisticsDAO scriptScoreStatisticsDAO = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsDAO.class);
	
	public void insertStatistics(String scriptName, String category, Long timestamp, Long count){
		scriptScoreStatisticsDAO.insertStatistics(scriptName, category, timestamp, count);
	}
	
	public void deleteUnderTimestamp(Long timestamp){
		scriptScoreStatisticsDAO.deleteUnderTimestamp(timestamp);
	}
	
	public JSONArray getTotalScriptStatistics(){
		return scriptScoreStatisticsDAO.getTotal();
	}
}