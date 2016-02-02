package com.igloosec.scripter.dao;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;

import com.google.common.collect.Lists;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class AutoStartScriptDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void save(String scriptName){
		ds.getJdbcTmpl().update(
			"INSERT INTO auto_start_script (script_name, regdate) VALUES(?, ?)", 
			scriptName, new Date()
		);
	}
	
	public void save(Set<String> scriptNames) {
		List<Object[]> batchArgs = Lists.newArrayList();
		for(String scriptName: scriptNames)
			batchArgs.add(new Object[]{ scriptName, new Date() });
		
		ds.getJdbcTmpl().batchUpdate("INSERT INTO auto_start_script (script_name, regdate) VALUES(?, ?)", batchArgs);
	}
	
	public JSONArray load() {
		return ds.getJdbcTmpl().queryForJsonArray("SELECT script_name, regdate FROM auto_start_script");
	}
	
	public void rename(String scriptName, String newScriptName){
		String query = "UPDATE auto_start_script SET script_name = ? where script_name = ?";
		ds.getJdbcTmpl().update(query, newScriptName, scriptName);
	} 
	
	public void remove(String scriptName){
		ds.getJdbcTmpl().update("DELETE FROM auto_start_script WHERE script_name = ?", scriptName);
	} 
	
	public void removeAll() {
		ds.getJdbcTmpl().update("DELETE FROM auto_start_script");
	}
} 