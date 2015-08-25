package com.igloosec.webdbreader.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.ConfigDAO;

public class ConfigService {
	private static final Logger logger = LoggerFactory.getLogger(ConfigService.class);
	private ConfigDAO configDAO = SingletonInstanceRepo.getInstance(ConfigDAO.class);
	
	public JSONObject load(){
		JSONArray configArr = configDAO.load();
		JSONObject configs = new JSONObject();
		for (int i = 0; i < configArr.length(); i++) {
			JSONObject config = configArr.getJSONObject(i);
			configs.put(config.getString("CONFIG_KEY"), config.getString("CONFIG_VALUE"));
		} //for i
		return configs;
	} //load
	
	public String load(String configKey){
		return configDAO.load(configKey);
	} //load
	
	public void save(String configKey, String configValue){
		configDAO.save(configKey, configValue);
	} //save
} //class