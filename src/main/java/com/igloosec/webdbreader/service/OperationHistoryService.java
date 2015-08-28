package com.igloosec.webdbreader.service;

import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;
import org.ocpsoft.prettytime.PrettyTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.OperationHistoryDAO;

public class OperationHistoryService {
	private static final Logger logger = LoggerFactory.getLogger(OperationHistoryService.class);
	private OperationHistoryDAO operationHistoryDAO = SingletonInstanceRepo.getInstance(OperationHistoryDAO.class);
	
	public void saveStartupHistory(String scriptName){
		operationHistoryDAO.saveHistory(scriptName, true);
	} //saveStartupHistory
	
	public void saveShutdownHistory(String scriptName){
		operationHistoryDAO.saveHistory(scriptName, false);
	} //saveShutdownHistory
	
	public JSONArray loadHistory(String scriptName, int count){
		JSONArray history = operationHistoryDAO.loadHistory(scriptName, count);
		PrettyTime prettyTime = new PrettyTime();
		
		for (int i = 0; i < history.length(); i++) {
			JSONObject row = history.getJSONObject(i);
			Date regdate = (Date) row.get("REGDATE");
			row.put("PRETTY_REGDATE", prettyTime.format(regdate));
		} //for i
		return history;
	} //loadHistory
	
	public JSONArray loadHistory(int count){
		JSONArray history = operationHistoryDAO.loadHistory(count);
		PrettyTime prettyTime = new PrettyTime();
		
		for (int i = 0; i < history.length(); i++) {
			JSONObject row = history.getJSONObject(i);
			Date regdate = (Date) row.get("REGDATE");
			row.put("PRETTY_REGDATE", prettyTime.format(regdate));
		} //for i
		return history;
	} //loadHistory
} //class