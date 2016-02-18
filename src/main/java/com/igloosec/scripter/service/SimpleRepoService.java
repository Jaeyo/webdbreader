package com.igloosec.scripter.service;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Properties;

import org.json.JSONArray;
import org.json.JSONObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.SimpleRepoDAO;
import com.igloosec.scripter.exception.NotExistsException;

public class SimpleRepoService {
	private SimpleRepoDAO simpleRepoDAO = SingletonInstanceRepo.getInstance(SimpleRepoDAO.class);
	
	public void set(String scriptName, String key, String value) {
		if(simpleRepoDAO.isExists(scriptName, key)) {
			simpleRepoDAO.update(scriptName, key, value);
		} else {
			simpleRepoDAO.insert(scriptName, key, value);
		}
	}
	
	public void set(String scriptName, String key, String newKey, String value) {
		if(simpleRepoDAO.isExists(scriptName, newKey)) {
			simpleRepoDAO.update(scriptName, key, newKey, value);
		} else {
			simpleRepoDAO.insert(scriptName, newKey, value);
		}
	}
	
	public JSONArray get() {
		return simpleRepoDAO.selectAll();
	}
	
	public String get(String scriptName, String key) {
		return simpleRepoDAO.select(scriptName, key);
	}
	
	public void delete(String scriptName) {
		simpleRepoDAO.delete(scriptName);
	}
	
	public void renameScript(String scriptName, String newScriptName) {
		simpleRepoDAO.renameScript(scriptName, newScriptName);
	}
	
	public void setVer1DbProps(String scriptName, String dbName, Properties dbProps) throws IOException {
		StringWriter strWriter = new StringWriter();
		dbProps.store(strWriter, null);
		simpleRepoDAO.insert(scriptName, "database_" + dbName, strWriter.toString());
	}
	
	public Properties getVer1DbProps(String scriptName, String dbName) throws NotExistsException, IOException {
		String dbPropsStr = simpleRepoDAO.select(scriptName, "database_" + dbName);
		if(dbPropsStr == null || dbPropsStr.trim().length() == 0)
			throw new NotExistsException("dbName: " + dbName);
		Properties dbProps = new Properties();
		dbProps.load(new StringReader(dbPropsStr));
		return dbProps;
	}
}