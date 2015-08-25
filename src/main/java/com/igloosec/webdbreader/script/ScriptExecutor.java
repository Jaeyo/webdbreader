package com.igloosec.webdbreader.script;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.Version;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.AlreadyStartedException;
import com.igloosec.webdbreader.exception.NotFoundException;
import com.igloosec.webdbreader.exception.ScriptNotRunningException;
import com.igloosec.webdbreader.exception.VersionException;
import com.igloosec.webdbreader.script.bindings.DateUtil;
import com.igloosec.webdbreader.script.bindings.DbHandler;
import com.igloosec.webdbreader.script.bindings.FileReaderFactory;
import com.igloosec.webdbreader.script.bindings.FileWriterFactory;
import com.igloosec.webdbreader.script.bindings.RuntimeUtil;
import com.igloosec.webdbreader.script.bindings.Scheduler;
import com.igloosec.webdbreader.script.bindings.SimpleRepo;
import com.igloosec.webdbreader.script.bindings.StringUtil;
import com.igloosec.webdbreader.service.OperationHistoryService;

public class ScriptExecutor {
	private static final Logger logger = LoggerFactory.getLogger(ScriptExecutor.class);
	private Map<String, ScriptThread> runningScripts = new HashMap<String, ScriptThread>();
	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);

	public void execute(String scriptName, final String script) throws AlreadyStartedException {
		if(runningScripts.containsKey(scriptName))
			throw new AlreadyStartedException(scriptName);
		
		try {
			if(versionCheck(script) == false){
				logger.error("unable to execute script, not available version");
				return;
			} //if
		} catch (ScriptException e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			return;
		} catch (VersionException e) {
			logger.error("no available version variable in script");
			return;
		} //if
		
		ScriptThread thread = new ScriptThread(scriptName){
			@Override
			public void run() {
				try{
					operationHistoryService.saveStartupHistory(getScriptName());
					
					Bindings bindings = new SimpleBindings();
					bindings.put("dateUtil", new DateUtil());
					bindings.put("dbHandler", new DbHandler());
					bindings.put("fileReaderFactory", new FileReaderFactory());
					bindings.put("fileWriterFactory", new FileWriterFactory());
					bindings.put("runtimeUtil", new RuntimeUtil());
					bindings.put("scheduler", new Scheduler());
					bindings.put("simpleRepo", new SimpleRepo());
					bindings.put("stringUtil", new StringUtil());
					
					ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
					scriptEngine.eval(script, bindings);
				} catch(Exception e){
					if(e.getClass().equals(InterruptedException.class) == true)
						return;
					logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} finally{
					if(isScheduled() == false && isFileReaderMonitoring() == false){
						runningScripts.remove(getScriptName());
						operationHistoryService.saveShutdownHistory(getScriptName());
					} //if
				} //finally
			} //run
		};
	
		thread.start();
		runningScripts.put(scriptName, thread);
	} //execute
	
	private boolean versionCheck(String script) throws ScriptException, VersionException{
		String version = null;
		for(String line : script.split("\n")){
			if(line.contains("var availableVersion")){
				ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
				scriptEngine.eval(line);
				version = (String) scriptEngine.get("availableVersion");
				break;
			} //if
		} //for line
		
		if(version == null)
			throw new VersionException("no availableVersion in script");
		
		int majorVersion = Integer.parseInt(Version.getCurrentVersion().split("\\.")[0]);
		int scriptMajorVersion = Integer.parseInt(version.split("\\.")[0]);
		if(majorVersion != scriptMajorVersion)
			return false;
		
		int minorVersion = Integer.parseInt(Version.getCurrentVersion().split("\\.")[1]);
		int scriptMinorVersion = Integer.parseInt(version.split("\\.")[1]);
		if(scriptMinorVersion > minorVersion)
			return false;
		
		return true;
	} //versionCheck
	
	public void stop(String scriptName) throws ScriptNotRunningException {
		ScriptThread thread = runningScripts.remove(scriptName);
		if(thread == null)
			throw new ScriptNotRunningException(scriptName);
		thread.stopScript();
	} //stop

	public Set<String> getRunningScripts(){
		Set<String> runningScriptNames = new HashSet<String>();
		for(String scriptName: runningScripts.keySet())
			runningScriptNames.add(scriptName);
		return runningScriptNames;
	} //getRunningScripts
} //class