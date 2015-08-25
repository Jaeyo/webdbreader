package com.igloosec.webdbreader.dao;

import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.NotFoundException;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class ScriptDAO {
	private static final Logger logger = LoggerFactory.getLogger(ScriptDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public JSONArray selectScriptInfo(){
		logger.info("");
		return ds.getJdbcTmpl().queryForJsonArray("SELECT script_name, regdate FROM script");
	} //selectScriptInfo
	
	public void save(String scriptName, String script){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("INSERT INTO script (script_name, script, regdate) "
				+ "VALUES(?, ?, ?)", scriptName, script, new Date());
	} //save
	
	public void edit(String scriptName, String script){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("UPDATE script SET script_name = ?, script = ?, regdate = ? WHERE script_name = ?", 
				scriptName, script, new Date(), scriptName);
	} //edit
	
	public JSONObject load(String scriptName) throws NotFoundException{
		logger.info("scriptName: {}", scriptName);
		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("SELECT script_name, regdate FROM script WHERE script_name = ?", scriptName);
		
		if(result == null || result.length() == 0)
			throw new NotFoundException("script not found : " + scriptName);
		
		JSONObject row = result.getJSONObject(0);
		String script = ds.getJdbcTmpl().queryForObject("SELECT script FROM script WHERE script_name= ?", new Object[]{scriptName}, String.class);
		row.put("SCRIPT", script);
		return row;
	} //load
	
	public boolean isExists(String scriptName){
		logger.info("scriptName: {}", scriptName);
		return ds.getJdbcTmpl().queryForObject("SELECT count(*) FROM script WHERE script_name = ?", new Object[]{ scriptName }, Integer.class) >= 1;
	} //isExists
	
	//-------------------------------------------------------------------------------------------------------------------
	
	public void removeScript(String scriptName){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("DELETE FROM script WHERE script_name = ?", scriptName);
	} //removeScript
} //class