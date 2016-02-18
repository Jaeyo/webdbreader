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
}