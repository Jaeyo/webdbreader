package com.igloosec.scripter.dao;

import org.json.JSONArray;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class ConfigDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public JSONArray load(){
		return ds.getJdbcTmpl().queryForJsonArray("SELECT config_key, config_value FROM config");
	}
	
	public String load(String configKey){
		return ds.getJdbcTmpl().queryForObject("SELECT config_value FROM config WHERE config_key = ?", new Object[]{ configKey }, String.class);
	}
	
	public void save(String configKey, String configValue){
		ds.getJdbcTmpl().update("UPDATE config SET config_value = ? WHERE config_key = ?", configValue, configKey);
	}
}