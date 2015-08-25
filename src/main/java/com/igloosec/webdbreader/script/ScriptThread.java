package com.igloosec.webdbreader.script;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.bindings.Scheduler;
import com.igloosec.webdbreader.service.OperationHistoryService;

public class ScriptThread extends Thread{
	private static final Logger logger = LoggerFactory.getLogger(ScriptThread.class);
	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);
	
	private String scriptName;
	private List<Timer> schedulerTimers = new ArrayList<Timer>();
	private List<Thread> fileReaderMonitoringThreads = new ArrayList<Thread>();
	
	public ScriptThread(String scriptName) {
		this.scriptName = scriptName;
	} //INIT
	
	public void addSchedulerTimer(Timer timer) {
		this.schedulerTimers.add(timer);
	} //addSchedulerTimer
	
	public void addFileReaderMonitoringThread(Thread thread){
		this.fileReaderMonitoringThreads.add(thread);
	} //addFileReaderMonitoringThread
	
	public String getScriptName(){
		return this.scriptName;
	} //getScriptName
	
	public boolean isScheduled(){
		return this.schedulerTimers.size() != 0;
	} //isScheduled
	
	public boolean isFileReaderMonitoring(){
		return this.fileReaderMonitoringThreads.size() != 0;
	} //isFileReaderMonitoring
	
	public synchronized void stopScript(){
		operationHistoryService.saveShutdownHistory(getScriptName());
		
		try{
			super.interrupt();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		} //catch
	
		try{
			while(schedulerTimers.size() != 0)
				schedulerTimers.remove(0).cancel();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		} //catch
		
		try{
			while(fileReaderMonitoringThreads.size() != 0)
				fileReaderMonitoringThreads.remove(0).interrupt();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		} //catch
	} //stop
} //class