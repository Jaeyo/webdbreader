package com.igloosec.webdbreader.common;

import java.util.Map;

import com.google.common.collect.Maps;

public class Conf{
	public static final String PORT = "port";
	public static final String DERBY_PATH= "derby.path";
	public static final String JETTY_THREAD_POOL_SIZE = "jetty.thread.pool.size";
	
	private static Map<String, Object> props = Maps.newHashMap();

	public static String get(String key) {
		Object value = props.get(key);
		if(value != null)
			return value.toString();
		return null;
	} // get
	
	public static String get(String key, String defaultValue){
		Object valueObj = props.get(key);
		if(valueObj == null)
			return defaultValue;
		return valueObj.toString();
	} //get
	
	public static <T> T getAs(String key, Class<T> clazz){
		T value = getAs(key);
		return value;
	} //getAs
	
	public static <T> T getAs(String key) throws ClassCastException {
		return getAs(key, (T)null);
	} //getAs
	
	public static <T> T getAs(String key, T defaultValue) throws ClassCastException {
		Object valueObj = props.get(key);
		if(valueObj == null)
			return defaultValue;
		return (T)valueObj;
	} //getAs
	
	public static void set(String key, Object value){
		props.put(key, value);
	} //set
} // class