package com.igloosec.webdbreader.service;

import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.ScriptDAO;
import com.igloosec.webdbreader.exception.AlreadyStartedException;
import com.igloosec.webdbreader.exception.NotFoundException;
import com.igloosec.webdbreader.exception.ScriptNotRunningException;
import com.igloosec.webdbreader.script.ScriptExecutor;

public class ScriptService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptService.class);
	private ScriptDAO scriptDAO = SingletonInstanceRepo.getInstance(ScriptDAO.class);
	private ScriptExecutor scriptExecutor = SingletonInstanceRepo.getInstance(ScriptExecutor.class);
	
	public JSONArray getScriptInfo(){
		JSONArray scripts = scriptDAO.selectScriptInfo();
		Set<String> runningScriptNames = scriptExecutor.getRunningScripts();
		for (int i = 0; i < scripts.length(); i++) {
			JSONObject scriptJson = scripts.getJSONObject(i);
			if(runningScriptNames.contains(scriptJson.getString("SCRIPT_NAME"))){
				scriptJson.put("IS_RUNNING", true);
			} else{
				scriptJson.put("IS_RUNNING", false);
			} //if
		} //for i
		
		return scripts;
	} //loadScripts
	
	public void save(String scriptName, String script){
		if(scriptDAO.isExists(scriptName)){
			scriptDAO.edit(scriptName, script);
		} else{
			scriptDAO.save(scriptName, script);
		} //if
	} //save
	
	public JSONObject load(String title) throws NotFoundException {
		JSONObject scriptJson = scriptDAO.load(title);
		Set<String> runningScriptNames = scriptExecutor.getRunningScripts();
		
		if(runningScriptNames.contains(scriptJson.getString("SCRIPT_NAME"))){
			scriptJson.put("IS_RUNNING", true);
		} else{
			scriptJson.put("IS_RUNNING", false);
		} //if
		
		return scriptJson;
	} //load

	public void startScript(String title) throws JSONException, NotFoundException, AlreadyStartedException {
		logger.info("title: {}", title);
		String script = load(title).getString("SCRIPT");
		scriptExecutor.execute(title, script);
	} //startScript
	
	public void stopScript(String title) throws ScriptNotRunningException {
		logger.info("title: {}", title);
		scriptExecutor.stop(title);
	} //stopScript
	
	//---------------------------------------------------------------------------------------
	
//	
//	public void removeScript(long sequence){
//		logger.info("sequence: {}", sequence);
//		scriptDAO.removeScript(sequence);
//	} //removeScript
//	
//	public JSONArray loadDoc() throws IOException{
//		InputStream docInput = this.getClass().getClassLoader().getResourceAsStream("spdbreader-doc.json");
//		String doc = IOUtils.toString(docInput, "utf8");
//		return new JSONArray(doc);
//	} //loadDoc
} //class