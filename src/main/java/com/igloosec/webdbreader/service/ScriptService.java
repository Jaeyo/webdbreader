package com.igloosec.webdbreader.service;

import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.FileWriteStatisticsDAO;
import com.igloosec.webdbreader.dao.ScriptDAO;
import com.igloosec.webdbreader.script.ScriptExecutor;

public class ScriptService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptService.class);
	private ScriptDAO scriptDAO = SingletonInstanceRepo.getInstance(ScriptDAO.class);
	private ScriptExecutor scriptExecutor = SingletonInstanceRepo.getInstance(ScriptExecutor.class);
	private FileWriteStatisticsDAO fileWriteStatisticsDAO = SingletonInstanceRepo.getInstance(FileWriteStatisticsDAO.class);
	
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
	
	//---------------------------------------------------------------------------------------
	
//	public void save(String scriptName, String script, String memo){
//		scriptDAO.save(scriptName, script, memo);
//	} //save
//	
//	public void edit(long sequence, String scriptName, String script, String memo){
//		scriptDAO.edit(sequence, scriptName, script, memo);
//	} //edit
//	
//	public JSONObject loadScript(long sequence) throws NotFoundException{
//		return scriptDAO.loadScript(sequence);
//	} //loadScript
//	
//	public void startScript(long sequence) throws AlreadyStartedException, JSONException, NotFoundException {
//		logger.info("sequence: {}", sequence);
//		String script = loadScript(sequence).getString("SCRIPT");
//		scriptExecutor.execute(sequence, script);
//	} //startScript
//	
//	public void stopScript(long sequence) throws ScriptNotRunningException{
//		logger.info("sequence: {}", sequence);
//		scriptExecutor.stop(sequence);
//	} //stopScript
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