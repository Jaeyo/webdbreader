package com.igloosec.webdbreader.service;

import com.google.common.collect.HashMultimap;

public class FileOutMsgService {
	private HashMultimap<String, FileOutListener> tailingListeners = HashMultimap.create();
	
	public void addTailingListener(String scriptName, FileOutListener listener) {
		tailingListeners.put(scriptName, listener);
	}
	
	public void removeTailingListener(String scriptName, FileOutListener listener) {
		tailingListeners.remove(scriptName, listener);
	}
	
	public void dispatchMsg(String scriptName, long timestamp, String msg) {
		for(FileOutListener listener: tailingListeners.get(scriptName)) {
			listener.listen(timestamp, msg);
		}
	}
	
	public interface FileOutListener {
		public void listen(long timestamp, String msg);
	} 
}