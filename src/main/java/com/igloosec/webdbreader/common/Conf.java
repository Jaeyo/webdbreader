package com.igloosec.webdbreader.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
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
			File confPath = new File(Path.getPackagePath(), "conf");
			if(confPath.exists() == false)
				confPath.mkdirs();
			File configJsonFile = new File(confPath, "config.json");
			
			//default values
			int port = 8098;
			String derbyPath = new File(Path.getPackagePath(), "derby").getAbsolutePath();
			int jettyThreadPoolSize = 20;
			int totalChartTime = 6;
			
			props.put(PORT, port);
			props.put(DERBY_PATH, derbyPath);
			props.put(JETTY_THREAD_POOL_SIZE, jettyThreadPoolSize);
			props.put(TOTAL_CHART_TIME, totalChartTime);
			
			if(configJsonFile.exists() == true) {
				JSONObject configJson = new JSONObject(IOUtils.toString(new FileInputStream(configJsonFile)));
				for(Object key: configJson.keySet()) {
					Object value = configJson.get(key.toString());
					props.put(key.toString(), value);
				}
			} else {
				configJsonFile.createNewFile();
				JSONObject configJson = new JSONObject(props);
				IOUtils.write(configJson.toString(4), new FileOutputStream(configJsonFile));
			}
			
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