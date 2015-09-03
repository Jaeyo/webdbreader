package com.igloosec.webdbreader.script.bindings;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.SimpleRepoDAO;
import com.igloosec.webdbreader.script.ScriptThread;

public class SimpleRepo {
	private ScriptLogger logger;
	private String scriptName;
	private SimpleRepoDAO simpleRepoDAO = SingletonInstanceRepo.getInstance(SimpleRepoDAO.class);

	public SimpleRepo(ScriptLogger logger) {
		this.logger = logger;
		this.scriptName = ScriptThread.currentThread().getScriptName();
	} // INIT

	public void store(String key, String value) {
		logger.info(String.format("SimpleRepo.store, key: %s, value: %s", key, value));
		
		if(simpleRepoDAO.isExists(this.scriptName, key)) {
			simpleRepoDAO.update(this.scriptName, key, value);
		} else {
			simpleRepoDAO.insert(this.scriptName, key, value);
		} //if
	} // store

	public String load(String key) {
		logger.info(String.format("SimpleRepo.load, key: %s", key));
		
		return simpleRepoDAO.select(this.scriptName, key);
	} // load

	public String load(String key, String defaultValue) {
		logger.info(String.format("SimpleRepo.load, key: %s, defaultValue: %s", key, defaultValue));
		
		String value = load(key);
		if(value == null)
			return defaultValue;
		return value;
	} // load

	public void clear(){
		logger.info("SimpleRepo.clear");
		
		simpleRepoDAO.delete(this.scriptName);
	} //clear
} // class