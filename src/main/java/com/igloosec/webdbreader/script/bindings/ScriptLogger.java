package com.igloosec.webdbreader.script.bindings;

import java.util.Date;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.ScriptMessageQueueRepo;
import com.igloosec.webdbreader.service.NotiService;

public class ScriptLogger {
	private static final Logger logger = LoggerFactory.getLogger(ScriptLogger.class);
	private ScriptMessageQueueRepo mq = SingletonInstanceRepo.getInstance(ScriptMessageQueueRepo.class);
	private NotiService notiService = SingletonInstanceRepo.getInstance(NotiService.class);
	private String scriptName;

	public ScriptLogger(String scriptName) {
		this.scriptName = scriptName;
	}
	
	public void info(String msg) {
		logger.info(msg);
		mq.pushLogMsg(scriptName, 
			new JSONObject()
			.put("timestamp", new Date())
			.put("level", "info")
			.put("msg", msg));
	} 
	
	public void debug(String msg) {
		logger.debug(msg);
		mq.pushLogMsg(scriptName, 
			new JSONObject()
			.put("timestamp", new Date())
			.put("level", "debug")
			.put("msg", msg));
	} 
	
	public void warn(String msg) {
		logger.warn(msg);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "warn")
				.put("msg", msg));
	} 
	
	public void error(String msg) {
		logger.error(msg);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "error")
				.put("msg", msg));
		notiService.sendErrorLogNoti(this.scriptName, msg);
	} 
	
	public void error(String msg, Throwable e) {
		logger.error(msg, e);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "error")
				.put("msg", msg));
		notiService.sendErrorLogNoti(this.scriptName, msg);
		mq.pushLogMsg(scriptName, 
				new JSONObject()
				.put("timestamp", new Date())
				.put("level", "error")
				.put("msg", ExceptionUtils.getStackTrace(e)));
	} 
} 