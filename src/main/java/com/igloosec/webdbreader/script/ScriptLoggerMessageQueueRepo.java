package com.igloosec.webdbreader.script;

import java.util.Iterator;
import java.util.Map;

import org.json.JSONObject;

import com.google.common.collect.Maps;
import com.igloosec.webdbreader.util.IterableLinkedQueue;

public class ScriptLoggerMessageQueueRepo {
	private static final int LOG_QUEUE_CAPACITY = 100;
	Map<String, IterableLinkedQueue<JSONObject>> logQueues = Maps.newHashMap();
	
	public void pushLogMsg(String scriptName, JSONObject logObj){
		IterableLinkedQueue<JSONObject> logQueue = logQueues.get(scriptName);
		if(logQueue == null) {
			logQueue = new IterableLinkedQueue<JSONObject>(LOG_QUEUE_CAPACITY);
			logQueues.put(scriptName, logQueue);
		} //if
		
		logQueue.push(logObj);
	} //pushLogMsg
	
	public Iterator<JSONObject> getLogQueueIterator(String scriptName) {
		IterableLinkedQueue<JSONObject> logQueue = logQueues.get(scriptName);
		if(logQueue == null)
			return null;
		
		return logQueue.iterator();
	} //getLogQueueIterator
} // class