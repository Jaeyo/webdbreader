package com.igloosec.scripter.script.bindingsV2;

import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.SimpleRepoDAO;
import com.igloosec.scripter.script.ScriptThread;

public class Repo {
	private static SimpleRepoDAO simpleRepoDAO = SingletonInstanceRepo.getInstance(SimpleRepoDAO.class);
	
	public void set(String key, Object value) {
		simpleRepoDAO.insert(ScriptThread.currentThread().getScriptName(), key, value+"");
	}
	
	public Object get(String key) {
		return simpleRepoDAO.select(ScriptThread.currentThread().getScriptName(), key);
	}
	
	public Object get(String key, NativeObject ops) {
		Object value = get(key);
		
		if(value == null && ops != null && ops.get("isNull", ops) != null) {
			return (String) ops.get("isNull", ops);
		}
		else return value;
	}
}