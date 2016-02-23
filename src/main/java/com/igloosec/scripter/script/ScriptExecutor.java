package com.igloosec.scripter.script;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Sets;
import com.igloosec.scripter.exception.AlreadyStartedException;
import com.igloosec.scripter.exception.ScriptNotRunningException;
import com.igloosec.scripter.exception.VersionException;

public class ScriptExecutor {
	private static final Logger logger = Logger.getLogger(ScriptExecutor.class);
	private Map<String, ScriptThread> runningScripts = new HashMap<String, ScriptThread>();

	public void execute(final String scriptName, final String script) throws AlreadyStartedException, ScriptException, VersionException, IOException {
		if(runningScripts.containsKey(scriptName))
			throw new AlreadyStartedException(scriptName);
		
		final String middleLayerJs = IOUtils.toString(ScriptExecutor.class.getClassLoader().getResourceAsStream("resource/scripts/middle-layer.js"));
		final String stringFormatJs = IOUtils.toString(ScriptExecutor.class.getClassLoader().getResourceAsStream("resource/scripts/string-format.js"));
		
		ScriptThread thread = new ScriptThread(scriptName){
			@Override
			public void runScript() throws Exception {
				ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
				scriptEngine.eval(middleLayerJs);
				scriptEngine.eval(stringFormatJs);
				scriptEngine.eval(script);
			}
		};
		
		thread.start();
		logger.info(String.format("%s start to running", scriptName));
		runningScripts.put(scriptName, thread);
	} 
	
	public void stop(String scriptName) throws ScriptNotRunningException {
		logger.info(String.format("%s stop to running", scriptName));
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

	public synchronized Set<String> getRunningScripts(){
		Iterator<Entry<String, ScriptThread>> iter = this.runningScripts.entrySet().iterator();
		Set<String> notRunningScripts = Sets.newHashSet();
		while(iter.hasNext()) {
			Entry<String, ScriptThread> next = iter.next();
			if(next.getValue().isRunning() == false)
				notRunningScripts.add(next.getKey());
		}
		
		for(String notRunningScriptName: notRunningScripts)
			this.runningScripts.remove(notRunningScriptName);
		
		Set<String> runningScriptNames = Sets.newHashSet();
		for(String scriptName: this.runningScripts.keySet())
			runningScriptNames.add(scriptName);
		return runningScriptNames;
	} 
	
	public ScriptThread getScriptThread(String scriptName){
		return runningScripts.get(scriptName);
	} 
} 