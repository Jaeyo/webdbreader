package com.igloosec.webdbreader.util;

public class Util {
	public static void sleep(long millis){
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {}
	} //sleep
} //class