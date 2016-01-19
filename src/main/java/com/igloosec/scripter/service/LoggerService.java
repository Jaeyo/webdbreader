package com.igloosec.scripter.service;

import java.util.UUID;

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
		String uuid = UUID.randomUUID().toString();
		for(LoggerListener listener: tailingListeners.get(scriptName)) {
			listener.listen(uuid, timestamp, logLevel, msg);
		}
	}
	
	public interface LoggerListener {
		public void listen(String uuid, long timestamp, String logLevel, String msg);
	} 
} 