package com.igloosec.webdbreader.dao;

import java.util.Date;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class AutoStartScriptDAO {
	private static final Logger logger = LoggerFactory.getLogger(AutoStartScriptDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void save(String scriptName){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update(
			"INSERT INTO auto_start_script (script_name, regdate) VALUES(?, ?)", 
			scriptName, new Date()
		);
	} 
	
	public JSONArray load() {
		return ds.getJdbcTmpl().queryForJsonArray("SELECT script_name, regdate FROM auto_start_script");
	}
	
	public void rename(String scriptName, String newScriptName){
		logger.info("scriptName: {}, newScriptName: {}", scriptName, newScriptName);
		String query = "UPDATE auto_start_script SET script_name = ? where script_name = ?";
		ds.getJdbcTmpl().update(query, newScriptName, scriptName);
	} 
	
	public void remove(String scriptName){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("DELETE FROM auto_start_script WHERE script_name = ?", scriptName);
	} 
} 