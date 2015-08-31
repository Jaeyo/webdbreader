package com.igloosec.webdbreader.script.bindings;

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
		mq.pushMsg(scriptName, msg);
	} //info
	
	public void debug(String msg) {
		logger.debug(msg);
		mq.pushMsg(scriptName, msg);
	} //debug
	
	public void warn(String msg) {
		logger.warn(msg);
		mq.pushMsg(scriptName, msg);
	} //warn
	
	public void error(String msg) {
		logger.error(msg);
		mq.pushMsg(scriptName, msg);
	} //error
} //class