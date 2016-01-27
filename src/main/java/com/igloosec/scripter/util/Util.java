package com.igloosec.scripter.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.math.NumberUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

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
	
	public static Object invokeFunction(Function function, Object[] args) {
		Context context = Context.enter();
		ScriptableObject scope = context.initStandardObjects();
		Scriptable that = context.newObject(scope);
		return function.call(context, that, scope, args == null ? new Object[]{} : args);
	}
	
	public static String dateFormat(long timestamp, String format) {
		return new SimpleDateFormat(format).format(new Date(timestamp));
	}
}