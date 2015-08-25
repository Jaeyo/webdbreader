package com.igloosec.webdbreader.util;

import org.json.JSONArray;
import org.json.JSONObject;

public class Util {
	public static void sleep(long millis){
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {}
	} //sleep
	
	public static JSONObject[] jsonArray2JsonObjectArray(JSONArray jsonArr){
		JSONObject[] objectArr = new JSONObject[jsonArr.length()];
		for (int i = 0; i < jsonArr.length(); i++)
			objectArr[i] = jsonArr.getJSONObject(i);
		return objectArr;
	} //jsonArray2JsonObjectArray
} //class