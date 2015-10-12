package com.igloosec.webdbreader.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Maps;

public class Conf{
	public static final String PORT = "port";
	public static final String DERBY_PATH= "derby.path";
	public static final String JETTY_THREAD_POOL_SIZE = "jetty.thread.pool.size";
	
	private static final Logger logger = LoggerFactory.getLogger(Conf.class);
	private static Map<String, Object> props = Maps.newHashMap();

	static {
		try {
			File confPath = new File(Path.getPackagePath(), "conf");
			if(confPath.exists() == false)
				confPath.mkdirs();
			File configJsonFile = new File(confPath, "config.json");
			
			if(configJsonFile.exists() == false) {
				int port = 8098;
				File defaultDerbyPath = new File(Path.getPackagePath(), "derby");
				String derbyPath = defaultDerbyPath.getAbsolutePath();
				int jettyThreadPoolSize = 20;
				
				props.put(PORT, port);
				props.put(DERBY_PATH, derbyPath);
				props.put(JETTY_THREAD_POOL_SIZE, jettyThreadPoolSize);
				
				logger.info("--------------------------------------------");
				logger.info(String.format("%s: %s", PORT, port));
				logger.info(String.format("%s: %s", DERBY_PATH, derbyPath));
				logger.info(String.format("%s: %s", JETTY_THREAD_POOL_SIZE, jettyThreadPoolSize));
				logger.info("--------------------------------------------");
				
				JSONObject configJson = new JSONObject(props);
				configJsonFile.createNewFile();
				IOUtils.write(configJson.toString(4), new FileOutputStream(configJsonFile));
			} else {
				JSONObject configJson = new JSONObject(IOUtils.toString(new FileInputStream(configJsonFile)));
				logger.info("--------------------------------------------");
				for(Object key: configJson.keySet()) {
					Object value = configJson.get(key.toString());
					props.put(key.toString(), value);
					logger.info(String.format("%s: %s", key.toString(), value));
				}
				logger.info("--------------------------------------------");
			}
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