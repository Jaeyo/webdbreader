package com.igloosec.webdbreader.dao;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class SimpleRepoDAO {
	private static final Logger logger = LoggerFactory.getLogger(SimpleRepoDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	TODO IMME
	
	public JSONArray load(){
		return ds.getJdbcTmpl().queryForJsonArray("SELECT config_key, config_value FROM config");
	} //load
	
	public String load(String configKey){
		return ds.getJdbcTmpl().queryForObject("SELECT config_value FROM config WHERE config_key = ?", new Object[]{ configKey }, String.class);
	} //load
	
	public void save(String configKey, String configValue){
		ds.getJdbcTmpl().update("UPDATE config SET config_value = ? WHERE config_key = ?", configValue, configKey);
	} //save
} //class