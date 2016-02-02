package com.igloosec.scripter.dao;

import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.exception.NotFoundException;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class ScriptDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public JSONArray selectScriptInfo(){
		return ds.getJdbcTmpl().queryForJsonArray("SELECT script_name, regdate FROM script ORDER BY script_name");
	}
	
	public JSONArray selectTitles() {
		return ds.getJdbcTmpl().queryForJsonArray("SELECT script_name FROM script ORDER BY regdate");
	}
	
	public void save(String scriptName, String script){
		ds.getJdbcTmpl().update("INSERT INTO script (script_name, script, regdate) "
				+ "VALUES(?, ?, ?)", scriptName, script, new Date());
	}
	
	public void edit(String scriptName, String script){
		ds.getJdbcTmpl().update("UPDATE script SET script_name = ?, script = ?, regdate = ? WHERE script_name = ?", 
				scriptName, script, new Date(), scriptName);
	}
	
	public JSONObject load(String scriptName) throws NotFoundException{
		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("SELECT script_name, regdate FROM script WHERE script_name = ?", scriptName);
		
		if(result == null || result.length() == 0)
			throw new NotFoundException("script not found : " + scriptName);
		
		JSONObject row = result.getJSONObject(0);
		String script = ds.getJdbcTmpl().queryForObject("SELECT script FROM script WHERE script_name= ?", new Object[]{scriptName}, String.class);
		row.put("SCRIPT", script);
		return row;
	}
	
	public boolean isExists(String scriptName){
		return ds.getJdbcTmpl().queryForObject("SELECT count(*) FROM script WHERE script_name = ?", new Object[]{ scriptName }, Integer.class) >= 1;
	}
	
	public void rename(String scriptName, String newScriptName){
		String query = "update script set script_name = ? where script_name = ?";
		ds.getJdbcTmpl().update(query, newScriptName, scriptName);
	}
	
	public void remove(String scriptName){
		ds.getJdbcTmpl().update("DELETE FROM script WHERE script_name = ?", scriptName);
	}
}