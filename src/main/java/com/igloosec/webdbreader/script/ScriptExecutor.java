package com.igloosec.webdbreader.script;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.AlreadyStartedException;
import com.igloosec.webdbreader.exception.ScriptNotRunningException;
import com.igloosec.webdbreader.exception.VersionException;
import com.igloosec.webdbreader.service.NotiService;
import com.igloosec.webdbreader.service.OperationHistoryService;

public class ScriptExecutor {
	private static final Logger logger = LoggerFactory.getLogger(ScriptExecutor.class);
	private Map<String, ScriptThread> runningScripts = new HashMap<String, ScriptThread>();
	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);
	private NotiService notiService = SingletonInstanceRepo.getInstance(NotiService.class);

	public void execute(final String scriptName, final String script) throws AlreadyStartedException, ScriptException, VersionException {
		if(runningScripts.containsKey(scriptName))
			throw new AlreadyStartedException(scriptName);
		
		ScriptThread thread = new ScriptThread(scriptName){
			@Override
			public void run() {
				try{
					operationHistoryService.saveStartupHistory(getScriptName());
					
					ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
					String middleLayerJs = IOUtils.toString(ScriptExecutor.class.getClassLoader().getResourceAsStream("resource/scripts/middle-layer.js"));
					String stringFormatJs = IOUtils.toString(ScriptExecutor.class.getClassLoader().getResourceAsStream("resource/scripts/string-format.js"));
					scriptEngine.eval(middleLayerJs);
					scriptEngine.eval(stringFormatJs);
					scriptEngine.eval(script);
				} catch(Exception e){
					if(e.getClass().equals(InterruptedException.class) == true)
						return;
					getLogger().error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} finally{
					if(isScheduled() == false && isFileReaderMonitoring() == false){
						operationHistoryService.saveShutdownHistory(getScriptName());
						runningScripts.remove(getScriptName()).stopScript();
						
						notiService.sendScriptEndNoti(scriptName);
					} 
				} 
			} 
		};
	
		thread.start();
		logger.info("{} start to running", scriptName);
		runningScripts.put(scriptName, thread);
	} 
	
	public void stop(String scriptName) throws ScriptNotRunningException {
		logger.info("{} stop to running", scriptName);
		ScriptThread thread = runningScripts.remove(scriptName);
		if(thread == null)
			throw new ScriptNotRunningException(scriptName);
		thread.stopScript();
	} 
	
	public void stopAllScript(){
		logger.info("stop all scripts");
		for(String scriptName : runningScripts.keySet()){
			try {
				stop(scriptName);
			} catch (ScriptNotRunningException e) {
				logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			} 
		} 
	} 

	public Set<String> getRunningScripts(){
		Set<String> runningScriptNames = new HashSet<String>();
		for(String scriptName: runningScripts.keySet())
			runningScriptNames.add(scriptName);
		return runningScriptNames;
	} 
	
	public ScriptThread getScriptThread(String scriptName){
		return runningScripts.get(scriptName);
	} 
} 