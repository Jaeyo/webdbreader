package com.igloosec.SpDbReader.common;

public class Util {
	public static void sleep(long millis){
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
		} //catch
	} //sleep
} //class