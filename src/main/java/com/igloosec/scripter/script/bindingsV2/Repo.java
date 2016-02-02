package com.igloosec.scripter.script.bindingsV2;

import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.SimpleRepoDAO;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;

public class Repo {
	private ScriptLogger logger = ScriptThread.currentLogger();
	private static SimpleRepoDAO simpleRepoDAO = SingletonInstanceRepo.getInstance(SimpleRepoDAO.class);
	
	public void set(String key, Object value) {
		try {
			simpleRepoDAO.insert(ScriptThread.currentThread().getScriptName(), key, value+"");
		} catch(Exception e) {
			logger.error(String.format("scriptName: %s, %s, errmsg: %s", ScriptThread.currentScriptName(), e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	public Object get(String key) {
		try {
			return simpleRepoDAO.select(ScriptThread.currentThread().getScriptName(), key);
		} catch(Exception e) {
			logger.error(String.format("scriptName: %s, %s, errmsg: %s", ScriptThread.currentScriptName(), e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		}
	}
	
	public Object get(String key, NativeObject ops) {
		try {
		Object value = get(key);
		
		if(value == null && ops != null && ops.get("isNull", ops) != null) {
			return (String) ops.get("isNull", ops);
		}
		else return value;
		} catch(Exception e) {
			logger.error(String.format("scriptName: %s, %s, errmsg: %s", ScriptThread.currentScriptName(), e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		}
	}
}