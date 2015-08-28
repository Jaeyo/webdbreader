package com.igloosec.webdbreader.script;

import java.util.List;
import java.util.Timer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Lists;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.bindings.FileWriterFactory.FileWriter;
import com.igloosec.webdbreader.service.OperationHistoryService;

public class ScriptThread extends Thread{
	private static final Logger logger = LoggerFactory.getLogger(ScriptThread.class);
	private static ScriptExecutor scriptExecutor = SingletonInstanceRepo.getInstance(ScriptExecutor.class);
	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);
	
	private String scriptName;
	private List<Timer> schedulerTimers = Lists.newArrayList();
	private List<Thread> fileReaderMonitoringThreads = Lists.newArrayList();
	private List<FileWriter> fileWriters = Lists.newArrayList();
	
	public ScriptThread(String scriptName) {
		this.scriptName = scriptName;
	} //INIT
	
	public void addSchedulerTimer(Timer timer) {
		this.schedulerTimers.add(timer);
	} //addSchedulerTimer
	
	public void addFileReaderMonitoringThread(Thread thread){
		this.fileReaderMonitoringThreads.add(thread);
	} //addFileReaderMonitoringThread
	
	public void addFileWriter(FileWriter writer){
		this.fileWriters.add(writer);
	} //addFileWriter
	
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
		
		try{
			while(fileWriters.size() != 0)
				fileWriters.remove(0).close();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		} //catch
	} //stop
	
	public static ScriptThread currentThread(){
		Thread thread = Thread.currentThread();
		if(thread instanceof ScriptThread)
			return (ScriptThread) thread;
		
		String scriptName = thread.getName();
		return scriptExecutor.getScriptThread(scriptName);
	} //currentThrad
} //class