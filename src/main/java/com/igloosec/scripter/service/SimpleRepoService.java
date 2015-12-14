package com.igloosec.scripter.service;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.SimpleRepoDAO;

public class SimpleRepoService {
		SimpleRepoDAO simpleRepoDAO = SingletonInstanceRepo.getInstance(SimpleRepoDAO.class);
	
	public void set(String scriptName, String key, String value) {
		if(simpleRepoDAO.isExists(scriptName, key)) {
			simpleRepoDAO.update(scriptName, key, value);
		} else {
			simpleRepoDAO.insert(scriptName, key, value);
		}
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
}