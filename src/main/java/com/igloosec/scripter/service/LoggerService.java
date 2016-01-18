package com.igloosec.scripter.service;

import com.google.common.collect.HashMultimap;

public class LoggerService {
	private HashMultimap<String, LoggerListener> tailingListeners = HashMultimap.create();
	
	public synchronized void addTailingListener(String scriptName, LoggerListener listener) {
		tailingListeners.put(scriptName, listener);
	}
	
	public synchronized void removeTailingListener(String scriptName, LoggerListener listener) {
		tailingListeners.remove(scriptName, listener);
	}
	
	public synchronized void dispatchMsg(String scriptName, long timestamp, String logLevel, String msg) {
		for(LoggerListener listener: tailingListeners.get(scriptName)) {
			listener.listen(timestamp, logLevel, msg);
		}
	}
	
	public interface LoggerListener {
		public void listen(long timestamp, String logLevel, String msg);
	} 
} 