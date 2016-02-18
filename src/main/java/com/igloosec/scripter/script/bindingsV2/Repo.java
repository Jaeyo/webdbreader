package com.igloosec.scripter.script.bindingsV2;

import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.SimpleRepoDAO;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.service.SimpleRepoService;

public class Repo {
	private ScriptLogger logger = ScriptThread.currentLogger();
	private SimpleRepoService simpleRepoService = SingletonInstanceRepo.getInstance(SimpleRepoService.class);
	
	public void set(String key, Object value) {
		try {
			simpleRepoService.set(ScriptThread.currentScriptName(), key, value + "");
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	public Object get(String key) {
		try {
			return simpleRepoService.get(ScriptThread.currentScriptName(), key);
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
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
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		}
	}
}