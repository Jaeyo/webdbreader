package com.igloosec.scripter.util;

import java.util.List;

import org.apache.commons.lang3.math.NumberUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.collect.Lists;

public class Util {
	public static void sleep(long millis){
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {}
	}
	
	public static List<JSONObject> jsonArray2JsonObjectList(JSONArray jsonArr){
		List<JSONObject> list = Lists.newArrayList();
		for (int i = 0; i < jsonArr.length(); i++)
			list.add(jsonArr.getJSONObject(i));
		return list;
	}
	
	public static String removeNumber(String str) {
		StringBuilder strBuilder = new StringBuilder();
		for(char c: str.toCharArray()) {
			if(NumberUtils.isNumber(c+"")) continue;
			strBuilder.append(c);
		}
		return strBuilder.toString();
	}
	
	public static String extractNumber(String str) {
		StringBuilder strBuilder = new StringBuilder();
		for(char c: str.toCharArray()) {
			if(NumberUtils.isNumber(c+"")) 
				strBuilder.append(c);
		}
		return strBuilder.toString();
	}
}