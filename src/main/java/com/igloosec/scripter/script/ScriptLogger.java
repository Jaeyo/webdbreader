package com.igloosec.scripter.script;

import java.io.IOException;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.log4j.Logger;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.service.LoggerService;
import com.igloosec.scripter.service.NotiService;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class ScriptLogger {
	private Logger logger = Logger.getLogger("scriptLogger");
	private ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private NotiService notiService = SingletonInstanceRepo.getInstance(NotiService.class);
	private LoggerService loggerService = SingletonInstanceRepo.getInstance(LoggerService.class);
	private String scriptName;

	public ScriptLogger(String scriptName) throws IOException {
		this.scriptName = scriptName;
	}
	
	public void info(String msg) {
		msg = String.format("[%s] %s", scriptName, msg);
		logger.info(msg);
		loggerService.dispatchMsg(scriptName, System.currentTimeMillis(), "info", msg);
	} 
	
	public void debug(String msg) {
		msg = String.format("[%s] %s", scriptName, msg);
		logger.debug(msg);
		loggerService.dispatchMsg(scriptName, System.currentTimeMillis(), "debug", msg);
	} 
	
	public void warn(String msg) {
		msg = String.format("[%s] %s", scriptName, msg);
		logger.warn(msg);
		loggerService.dispatchMsg(scriptName, System.currentTimeMillis(), "warn", msg);
	} 
	
	public void error(String msg) {
		msg = String.format("[%s] %s", scriptName, msg);
		logger.error(msg);
		loggerService.dispatchMsg(scriptName, System.currentTimeMillis(), "error", msg);
		notiService.dispatchErrLog(scriptName, System.currentTimeMillis(), msg);
		scriptScoreStatistics.incrementCount(ScriptScoreStatistics.ERROR_LOG);
	} 
	
	public void error(String msg, Throwable e) {
		msg = String.format("[%s] %s", scriptName, msg);
		logger.error(msg, e);
		loggerService.dispatchMsg(scriptName, System.currentTimeMillis(), "error", msg);
		loggerService.dispatchMsg(scriptName, System.currentTimeMillis(), "error", ExceptionUtils.getStackTrace(e));
		notiService.dispatchErrLog(scriptName, System.currentTimeMillis(), msg);
		notiService.dispatchErrLog(scriptName, System.currentTimeMillis(), ExceptionUtils.getStackTrace(e));
		scriptScoreStatistics.incrementCount(ScriptScoreStatistics.ERROR_LOG);
	} 
} 