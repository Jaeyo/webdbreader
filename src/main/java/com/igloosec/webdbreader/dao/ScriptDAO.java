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
		return ds.getJdbcTmpl().queryForJsonArray("select script_name, regdate from script");
	} //selectScriptInfo
	
	public void save(String scriptName, String script){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("insert into script (script_name, script, regdate) "
				+ "values(?, ?, ?)", scriptName, script, new Date());
	} //save
	
	//-------------------------------------------------------------------------------------------------------------------
	
	public void edit(String scriptName, String script, String memo){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("update script set script_name = ?, script = ?, regdate = ? "
				+ "where script_name = ?",
				scriptName, script, new Date(), memo, scriptName);
	} //edit
	
	public JSONObject loadScript(String scriptName) throws NotFoundException{
		logger.info("scriptName: {}", scriptName);
		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("select script_name, regdate from script where script_name = ?", scriptName);
		
		if(result == null || result.length() == 0)
			throw new NotFoundException("script not found : " + scriptName);
		
		JSONObject row = result.getJSONObject(0);
		String script = ds.getJdbcTmpl().queryForObject("select script from script where script_name= ?", new Object[]{scriptName}, String.class);
		row.put("SCRIPT", script);
		return row;
	} //loadScript
	
	public void removeScript(String scriptName){
		logger.info("scriptName: {}", scriptName);
		ds.getJdbcTmpl().update("delete from script where script_name = ?", scriptName);
	} //removeScript
} //class