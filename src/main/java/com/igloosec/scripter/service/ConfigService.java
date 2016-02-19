package com.igloosec.scripter.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.ConfigDAO;
import com.igloosec.scripter.dao.ScriptDAO;

public class ConfigService {
	private static final Logger logger = LoggerFactory.getLogger(ConfigService.class);
	private ConfigDAO configDAO = SingletonInstanceRepo.getInstance(ConfigDAO.class);
	
	public JSONObject load(){
		JSONArray configArr = configDAO.load();
		JSONObject configs = new JSONObject();
		for (int i = 0; i < configArr.length(); i++) {
			JSONObject config = configArr.getJSONObject(i);
			configs.put(config.getString("CONFIG_KEY"), config.getString("CONFIG_VALUE"));
		} 
		return configs;
	} 
	
	public boolean isTailEnable() {
		String result = configDAO.load("enable.tail");
		if(result == null) {
			configDAO.save("enable.tail", "true");
			return true;
		} else {
			return Boolean.parseBoolean(result);
		}
	}
	
	public void enableTail(boolean enable) {
		configDAO.save("enable.tail", enable + "");
	}
}