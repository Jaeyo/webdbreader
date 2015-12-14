package com.igloosec.scripter.common;

import java.io.File;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Maps;

public class Conf{
	public static final String PORT = "port";
	public static final String DERBY_PATH= "derby.path";
	public static final String JETTY_THREAD_POOL_SIZE = "jetty.thread.pool.size";
	public static final String TOTAL_CHART_TIME = "total.chart.time";
	
	private static final Logger logger = LoggerFactory.getLogger(Conf.class);
	private static Map<String, Object> props = Maps.newHashMap();

	static {
		try {
			try {
				props.put(PORT, Integer.parseInt(System.getProperty(PORT, "8098")));
			} catch(NumberFormatException e) {
				logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
				props.put(PORT, 8098);
			}
			
			try {
				props.put(JETTY_THREAD_POOL_SIZE, Integer.parseInt(System.getProperty(JETTY_THREAD_POOL_SIZE, "20")));
			} catch(NumberFormatException e) {
				logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
				props.put(JETTY_THREAD_POOL_SIZE, 20);
			}
			
			try {
				props.put(TOTAL_CHART_TIME, Integer.parseInt(System.getProperty(JETTY_THREAD_POOL_SIZE, "6")));
			} catch(NumberFormatException e) {
				logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
				props.put(TOTAL_CHART_TIME, 6);
			}
			
			String derbyDefaultPath = new File(Path.getPackagePath(), "derby").getAbsolutePath();
			props.put(DERBY_PATH, System.getProperty(DERBY_PATH, derbyDefaultPath));
			
			logger.info("--------------------------------------------");
			logger.info(String.format("%s: %s", PORT, props.get(PORT)));
			logger.info(String.format("%s: %s", DERBY_PATH, props.get(DERBY_PATH)));
			logger.info(String.format("%s: %s", JETTY_THREAD_POOL_SIZE, props.get(JETTY_THREAD_POOL_SIZE)));
			logger.info(String.format("%s: %s", TOTAL_CHART_TIME, props.get(TOTAL_CHART_TIME)));
			logger.info("--------------------------------------------");
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
		}
	}
	
	public static String get(String key) {
		Object value = props.get(key);
		if(value != null)
			return value.toString();
		return null;
	} 
	
	public static String get(String key, String defaultValue){
		Object valueObj = props.get(key);
		if(valueObj == null)
			return defaultValue;
		return valueObj.toString();
	} 
	
	public static <T> T getAs(String key, Class<T> clazz){
		T value = getAs(key);
		return value;
	} 
	
	public static <T> T getAs(String key) throws ClassCastException {
		return getAs(key, (T)null);
	} 
	
	public static <T> T getAs(String key, T defaultValue) throws ClassCastException {
		Object valueObj = props.get(key);
		if(valueObj == null)
			return defaultValue;
		return (T)valueObj;
	} 
	
	public static void set(String key, Object value){
		props.put(key, value);
	} 
	
	public static boolean isOpenJdk(){
		String vmName = System.getProperty("java.vm.name").toLowerCase();
		if (vmName.startsWith("openjdk"))
			return true;
		return false;
	}
} 