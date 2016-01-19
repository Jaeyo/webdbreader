package com.igloosec.scripter.service;

import java.util.Set;
import java.util.UUID;

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
		String uuid = UUID.randomUUID().toString();
		for(ErrLogListener listener: errLogListeners)
			listener.listen(uuid, scriptName, timestamp, msg);
	}
	
	public interface ErrLogListener {
		public void listen(String uuid, String scriptName, long timestamp, String msg);
	}
}