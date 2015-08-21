package com.igloosec.webdbreader.script;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.SimpleBindings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.exception.AlreadyStartedException;
import com.igloosec.webdbreader.script.bindings.DateUtil;
import com.igloosec.webdbreader.script.bindings.DbHandler;
import com.igloosec.webdbreader.script.bindings.FileReaderFactory;
import com.igloosec.webdbreader.script.bindings.FileWriterFactory;
import com.igloosec.webdbreader.script.bindings.RuntimeUtil;
import com.igloosec.webdbreader.script.bindings.Scheduler;
import com.igloosec.webdbreader.script.bindings.SimpleRepo;
import com.igloosec.webdbreader.script.bindings.StringUtil;

public class ScriptExecutor {
	private static final Logger logger = LoggerFactory.getLogger(ScriptExecutor.class);
	private Map<String, ScriptThread> runningScripts = new HashMap<String, ScriptThread>();

	public void execute(String scriptName, final String script) throws AlreadyStartedException {
		if(runningScripts.containsKey(scriptName))
			throw new AlreadyStartedException(scriptName);
		
		ScriptThread thread = new ScriptThread(scriptName){
			@Override
			public void run() {
				try{
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
					if(isScheduled() == false && isFileReaderMonitoring() == false)
						runningScripts.remove(getScriptName());
				} //finally
			} //run
		};
	
		thread.start();
		runningScripts.put(scriptName, thread);
	} //execute
	
	public void stop(String scriptName) {
		ScriptThread thread = runningScripts.remove(scriptName);
		thread.stopScript();
	} //stop

	public Set<String> getRunningScripts(){
		Set<String> runningScriptNames = new HashSet<String>();
		for(String scriptName: runningScripts.keySet())
			runningScriptNames.add(scriptName);
		return runningScriptNames;
	} //getRunningScripts
} //class