package com.igloosec.SpDbReader.bindings;

import org.apache.log4j.Logger;

public class RuntimeUtil {
	private static final Logger logger = Logger.getLogger(RuntimeUtil.class);

	public void sleep(long timeMillis){
		try {
			Thread.sleep(timeMillis);
		} catch (InterruptedException e) {
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
		} //catch
	} //sleep
} // class