package com.igloosec.scripter.dao;

import org.json.JSONArray;
import org.springframework.dao.EmptyResultDataAccessException;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class SimpleRepoDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void insert(String scriptName, String key, String value) {
		ds.getJdbcTmpl().update("INSERT INTO simple_repo (script_name, simple_repo_key, simple_repo_value) VALUES(?, ?, ?)", scriptName, key, value);
	}
	
	public void update(String scriptName, String key, String value) {
		ds.getJdbcTmpl().update("UPDATE simple_repo SET simple_repo_value = ? WHERE script_name = ? AND simple_repo_key = ?", value, scriptName, key);
	}
	
	public void update(String scriptName, String key, String newKey, String newValue) {
		ds.getJdbcTmpl().update(
			"UPDATE simple_repo SET simple_repo_key = ?, simple_repo_value = ? WHERE script_name = ? AND simple_repo_key = ?", 
			newKey, newValue, scriptName, key);
	}
	
	public boolean isExists(String scriptName, String key) {
		return 1 <= ds.getJdbcTmpl().queryForObject("SELECT COUNT(*) "
				+ "FROM simple_repo WHERE script_name = ? AND simple_repo_key = ?", 
				new Object[]{ scriptName, key}, Integer.class);
	}
	
	public String select(String scriptName, String key) {
		try{
			return ds.getJdbcTmpl().queryForObject("SELECT simple_repo_value FROM simple_repo "
					+ "WHERE script_name = ? AND simple_repo_key = ?", 
					new Object[]{scriptName, key}, String.class);
		} catch(EmptyResultDataAccessException e) {
			return null;
		}
	}
	
	public JSONArray selectAll() {
		try{
			String query = "SELECT script_name, simple_repo_key, simple_repo_value FROM simple_repo";
			return ds.getJdbcTmpl().queryForJsonArray(query);
		} catch(EmptyResultDataAccessException e) {
			return null;
		}
	}
	
	public void delete(String scriptName) {
		ds.getJdbcTmpl().update("DELETE FROM simple_repo WHERE script_name = ?", scriptName);
	}
	
	public void delete(String scriptName, String key) {
		ds.getJdbcTmpl().update("DELETE FROM simple_repo WHERE script_name = ? AND simple_repo_key = ?", scriptName, key);
	}
	
	public void renameScript(String scriptName, String newScriptName) {
		ds.getJdbcTmpl().update("UPDATE simple_repo SET script_name = ? WHERE script_name = ?", newScriptName, scriptName);
	}
}