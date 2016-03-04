package com.igloosec.scripter.util;

import java.util.Iterator;
import java.util.Map.Entry;
import java.util.Properties;

import org.json.JSONObject;

public class PropertiesUtil {
	public static JSONObject toJSON(Properties props) {
		Iterator<Entry<Object, Object>> iter = props.entrySet().iterator();
		JSONObject json = new JSONObject();
		
		while(iter.hasNext()) {
			Entry<Object, Object> entry = iter.next();
			json.put(entry.getKey().toString(), entry.getValue());
		}
		
		return json;
	}
	
	public static Properties fromJSON(JSONObject json) {
		Properties props = new Properties();
		Iterator iter = json.keys();
		
		while(iter.hasNext()) {
			String key = (String) iter.next();
			Object value = json.get(key);
			props.setProperty(key, value.toString());
		}
		
		return props;
	}
	
	public static Properties fromJSON(String jsonSrc) {
		return fromJSON(new JSONObject(jsonSrc));
	}
}