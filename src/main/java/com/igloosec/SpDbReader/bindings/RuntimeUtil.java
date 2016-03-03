package com.igloosec.SpDbReader.bindings;

import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;

public class RuntimeUtil {
	private static final ScriptLogger logger = ScriptThread.currentLogger();

	public void sleep(long timeMillis){
		try {
			Thread.sleep(timeMillis);
		} catch (InterruptedException e) {
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
		} //catch
	} //sleep
} // class