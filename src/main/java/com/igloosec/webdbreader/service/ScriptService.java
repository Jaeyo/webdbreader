package com.igloosec.webdbreader.service;

import java.util.Date;
import java.util.Set;

import javax.script.ScriptException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.ocpsoft.prettytime.PrettyTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.OperationHistoryDAO;
import com.igloosec.webdbreader.dao.ScriptDAO;
import com.igloosec.webdbreader.dao.ScriptScoreStatisticsDAO;
import com.igloosec.webdbreader.exception.AlreadyExistsException;
import com.igloosec.webdbreader.exception.AlreadyStartedException;
import com.igloosec.webdbreader.exception.NotFoundException;
import com.igloosec.webdbreader.exception.ScriptNotRunningException;
import com.igloosec.webdbreader.exception.VersionException;
import com.igloosec.webdbreader.script.ScriptExecutor;

public class ScriptService {
	private static final Logger logger = LoggerFactory.getLogger(ScriptService.class);
	private ScriptDAO scriptDAO = SingletonInstanceRepo.getInstance(ScriptDAO.class);
	private ScriptScoreStatisticsDAO scriptScoreStatisticsDAO = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsDAO.class);
	private OperationHistoryDAO operationHistoryDAO = SingletonInstanceRepo.getInstance(OperationHistoryDAO.class);
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
	
	public boolean isExists(String scriptName){
		return scriptDAO.isExists(scriptName);
	} //isExists
	
	public void save(String scriptName, String script) throws AlreadyExistsException{
		if(scriptDAO.isExists(scriptName)){
			throw new AlreadyExistsException(scriptName);
		} else{
			scriptDAO.save(scriptName, script);
		} //if
	} //save
	
	public void edit(String scriptName, String script){
		scriptDAO.edit(scriptName, script);
	} //edit
	
	public JSONObject load(String title) throws NotFoundException {
		JSONObject scriptJson = scriptDAO.load(title);
		Set<String> runningScriptNames = scriptExecutor.getRunningScripts();
		
		if(runningScriptNames.contains(scriptJson.getString("SCRIPT_NAME"))){
			scriptJson.put("IS_RUNNING", true);
		} else{
			scriptJson.put("IS_RUNNING", false);
		} //if
		
		Date regdate = (Date) scriptJson.get("REGDATE");
		scriptJson.put("PRETTY_REGDATE", new PrettyTime().format(regdate));
		
		return scriptJson;
	} //load

	public void startScript(String scriptName) throws JSONException, NotFoundException, AlreadyStartedException, ScriptException, VersionException {
		logger.info("scriptName: {}", scriptName);
		String script = load(scriptName).getString("SCRIPT");
		scriptExecutor.execute(scriptName, script);
	} //startScript
	
	public void stopScript(String scriptName) throws ScriptNotRunningException {
		logger.info("scriptName: {}", scriptName);
		scriptExecutor.stop(scriptName);
	} //stopScript
	
	public void rename(String scriptName, String newScriptName) throws AlreadyExistsException{
		logger.info("scriptName: {}, newScriptName: {}", scriptName, newScriptName);
	
		if(isExists(newScriptName))
			throw new AlreadyExistsException(newScriptName);
		
		scriptDAO.rename(scriptName, newScriptName);
		scriptScoreStatisticsDAO.renameScript(scriptName, newScriptName);
		operationHistoryDAO.renameScript(scriptName, newScriptName);
	} //rename
	
	public void remove(String scriptName){
		logger.info("scriptName: {}", scriptName);
		
		scriptDAO.remove(scriptName);
		scriptScoreStatisticsDAO.remove(scriptName);
		operationHistoryDAO.remove(scriptName);
	} //remove
} //class