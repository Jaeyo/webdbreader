package com.igloosec.SpDbReader.bindings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RuntimeUtil {
	private static final Logger logger = LoggerFactory.getLogger(RuntimeUtil.class);

	public void sleep(long timeMillis){
		try {
			Thread.sleep(timeMillis);
		} catch (InterruptedException e) {
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
		} //catch
	} //sleep
} // class