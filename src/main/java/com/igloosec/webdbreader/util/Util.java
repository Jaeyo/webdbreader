package com.igloosec.webdbreader.util;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.collect.Lists;

public class Util {
	public static void sleep(long millis){
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {}
	} //sleep
	
	public static List<JSONObject> jsonArray2JsonObjectList(JSONArray jsonArr){
		List<JSONObject> list = Lists.newArrayList();
		for (int i = 0; i < jsonArr.length(); i++)
			list.add(jsonArr.getJSONObject(i));
		return list;
	} //jsonArray2JsonObjectList
} //class