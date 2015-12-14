package com.igloosec.scripter.service;

import com.google.common.collect.HashMultimap;

public class LoggerService {
	private HashMultimap<String, LoggerListener> tailingListeners = HashMultimap.create();
	
	public void addTailingListener(String scriptName, LoggerListener listener) {
		tailingListeners.put(scriptName, listener);
	}
	
	public void removeTailingListener(String scriptName, LoggerListener listener) {
		tailingListeners.remove(scriptName, listener);
	}
	
	public void dispatchMsg(String scriptName, long timestamp, String logLevel, String msg) {
		for(LoggerListener listener: tailingListeners.get(scriptName)) {
			listener.listen(timestamp, logLevel, msg);
		}
	}
	
	public interface LoggerListener {
		public void listen(long timestamp, String logLevel, String msg);
	} 
} 