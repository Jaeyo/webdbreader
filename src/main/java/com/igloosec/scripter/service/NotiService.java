package com.igloosec.scripter.service;

import java.util.Set;

import com.google.common.collect.Sets;

public class NotiService {
	private Set<ErrLogListener> errLogListeners = Sets.newHashSet();
	
	public void addErrLogListener(ErrLogListener listener) {
		errLogListeners.add(listener);
	}
	
	public void removeErrLogListener(ErrLogListener listener) {
		errLogListeners.remove(listener);
	}
	
	public void dispatchErrLog(String scriptName, long timestamp, String msg) {
		for(ErrLogListener listener: errLogListeners)
			listener.listen(scriptName, timestamp, msg);
	}
	
	public interface ErrLogListener {
		public void listen(String scriptName, long timestamp, String msg);
	}
}