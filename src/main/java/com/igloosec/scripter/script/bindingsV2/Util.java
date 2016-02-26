package com.igloosec.scripter.script.bindingsV2;

public class Util {
	public static String getType(Object arg) {
		return arg.getClass().getSimpleName();
	}
	
	public static boolean isNumber(Object arg) {
		if(arg instanceof Integer) return true;
		else if(arg instanceof Long) return true;
		else if(arg instanceof Float) return true;
		else if(arg instanceof Double) return true;
		return false;
	}
	
	public static boolean isDate(Object arg) {
		if(arg instanceof java.sql.Date) return true; 
		else if(arg instanceof java.util.Date) return true; 
		return false;
	}
	
	public static void sleep(long ms){
		try {
			Thread.sleep(ms);
		} catch (InterruptedException e) {
		}
	}
}