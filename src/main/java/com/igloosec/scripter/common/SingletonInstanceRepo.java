package com.igloosec.scripter.common;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

public class SingletonInstanceRepo {
	private static final Logger logger = Logger.getLogger(SingletonInstanceRepo.class);
	private static Map<Class, Object> instances = new HashMap<Class, Object>();

	public static <T> T getInstance(Class<T> clazz) {
		Object instance = instances.get(clazz);
		try {
			if(instance == null){
				instance = clazz.newInstance();
				instances.put(clazz, instance);
				logger.debug("singleton instance generated: " + clazz.toString());
			}
		} catch (InstantiationException e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} catch (IllegalAccessException e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
		return (T) instance;
	}
}