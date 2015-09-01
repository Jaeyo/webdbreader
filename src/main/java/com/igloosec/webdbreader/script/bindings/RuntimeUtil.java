package com.igloosec.webdbreader.script.bindings;

import com.igloosec.webdbreader.Version;

public class RuntimeUtil {
	private ScriptLogger logger;

	public RuntimeUtil(ScriptLogger logger) {
		this.logger = logger;
	} //INIT
	
	public void sleep(long timeMillis){
		try {
			Thread.sleep(timeMillis);
		} catch (InterruptedException e) {
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
		} //catch
	} //sleep
	
	public String getVersion(){
		return Version.getCurrentVersion();
	} //getVersion
} // class