package com.igloosec.scripter.dao;

import org.json.JSONArray;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class ScriptRunningDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public String[] getRunningScriptNames() {
		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("SELECT script_name FROM script_running");
		if(result == null || result.length() == 0) return new String[]{};
		
		String[] scriptNames = new String[result.length()];
		for (int i = 0; i < result.length(); i++)
			scriptNames[i] = result.getJSONObject(i).getString("SCRIPT_NAME");
		
		return scriptNames;
	}
	
	public void insert(String scriptName) {
		ds.getJdbcTmpl().update("INSERT INTO script_running (script_name) VALUES(?)", scriptName);
	}
	
	public void delete(String scriptName) {
		ds.getJdbcTmpl().update("DELETE FROM script_running WHERE script_name = ?", scriptName);
	}
	
	public void deleteAll() {
		ds.getJdbcTmpl().update("DELETE FROM script_running");
	}
	
	public void rename(String scriptName, String newScriptName) {
		ds.getJdbcTmpl().update("UPDATE script_running SET script_name = ? WHERE script_name = ?", newScriptName, scriptName);
	}
}