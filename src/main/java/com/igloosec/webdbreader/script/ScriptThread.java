package com.igloosec.webdbreader.script;

import java.util.List;
import java.util.Timer;

import com.google.common.collect.Lists;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.OperationHistoryService;

public class ScriptThread extends Thread{
	private static ScriptLogger logger = null;
	private static ScriptExecutor scriptExecutor = SingletonInstanceRepo.getInstance(ScriptExecutor.class);
	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);
	
	private String scriptName;
	private List<Timer> schedulerTimers = Lists.newArrayList();
	private List<Thread> fileReaderMonitoringThreads = Lists.newArrayList();
	
	public ScriptThread(String scriptName) {
		this.scriptName = scriptName;
		this.logger = new ScriptLogger(scriptName);
	}
	
	public ScriptLogger getLogger() {
		return this.logger;
	}
	
	public void addSchedulerTimer(Timer timer) {
		this.schedulerTimers.add(timer);
	}
	
	public void addFileReaderMonitoringThread(Thread thread){
		this.fileReaderMonitoringThreads.add(thread);
	}
	
	public String getScriptName(){
		return this.scriptName;
	}
	
	public boolean isScheduled(){
		return this.schedulerTimers.size() != 0;
	}
	
	public boolean isFileReaderMonitoring(){
		return this.fileReaderMonitoringThreads.size() != 0;
	}
	
	public synchronized void stopScript(){
		operationHistoryService.saveShutdownHistory(getScriptName());
		
		try{
			super.interrupt();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		}
	
		try{
			while(schedulerTimers.size() != 0)
				schedulerTimers.remove(0).cancel();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		}
		
		try{
			while(fileReaderMonitoringThreads.size() != 0)
				fileReaderMonitoringThreads.remove(0).interrupt();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		}
	}
	
	public static ScriptThread currentThread(){
		Thread thread = Thread.currentThread();
		if(thread instanceof ScriptThread)
			return (ScriptThread) thread;
		
		String scriptName = thread.getName();
		return scriptExecutor.getScriptThread(scriptName);
	}
}