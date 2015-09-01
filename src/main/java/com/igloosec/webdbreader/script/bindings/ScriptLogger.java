package com.igloosec.webdbreader.script.bindings;

import java.util.Date;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.ScriptLoggerMessageQueueRepo;

public class ScriptLogger {
	private static final Logger logger = LoggerFactory.getLogger(ScriptLogger.class);
	private ScriptLoggerMessageQueueRepo mq = SingletonInstanceRepo.getInstance(ScriptLoggerMessageQueueRepo.class);
	private String scriptName;

	public ScriptLogger(String scriptName) {
		this.scriptName = scriptName;
	} //INIT
	
	public void info(String msg) {
		logger.info(msg);
		mq.pushLogMsg(scriptName, 
			new JSONObject()
			.put("timestamp", new Date())
			.put("level", "info")
			.put("msg", msg));
	} //info
	
	public void debug(String msg) {
		logger.debug(msg);
		mq.pushLogMsg(scriptName, 
			new JSONObject()
			.put("timestamp", new Date())
			.put("level", "info")
			.put("msg", msg));
	} //debug
	
	public void warn(String msg) {
		logger.warn(msg);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "info")
				.put("msg", msg));
	} //warn
	
	public void error(String msg) {
		logger.error(msg);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "info")
				.put("msg", msg));
	} //error
	
	public void error(String msg, Throwable e) {
		logger.error(msg, e);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "info")
				.put("msg", msg));
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "info")
				.put("msg", ExceptionUtils.getStackTrace(e)));
	} //error
} //class