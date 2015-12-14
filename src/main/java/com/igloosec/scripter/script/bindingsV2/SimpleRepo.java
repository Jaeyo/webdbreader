package com.igloosec.scripter.script.bindingsV2;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.service.SimpleRepoService;

public class SimpleRepo {
	private SimpleRepoService simpleRepo = SingletonInstanceRepo.getInstance(SimpleRepoService.class);
	
	public void set(String key, Object value) {
		String scriptName = ScriptThread.currentThread().getScriptName();
		simpleRepo.set(scriptName, key, value + "");
	}
	
	public String get(String key) {
		String scriptName = ScriptThread.currentThread().getScriptName();
		return simpleRepo.get(scriptName, key);
	}
}