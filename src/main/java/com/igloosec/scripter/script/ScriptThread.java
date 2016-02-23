package com.igloosec.scripter.script;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;
import java.util.Timer;

import com.google.common.collect.Lists;
import com.igloosec.scripter.common.SingletonInstanceRepo;

public abstract class ScriptThread extends Thread {
	private ScriptLogger logger = null;
	private boolean isRunMethodRunning = false;
	private String scriptName;
	private List<Timer> timers = Lists.newArrayList();
	private List<Closeable> closeables = Lists.newArrayList();
	
	public ScriptThread(String scriptName) throws IOException {
		this.scriptName = scriptName;
		this.logger = new ScriptLogger(scriptName);
	}
	
	public ScriptLogger getLogger() {
		return this.logger;
	}
	
	public String getScriptName(){
		return this.scriptName;
	}
	
	public boolean isRunning() {
		if(isRunMethodRunning == true) return true;
		if(this.timers.size() != 0) return true;
		return false;
	}
	
	@Override
	public final void run() {
		try {
			this.isRunMethodRunning = true;
			this.runScript();
		} catch(Exception e) {
			if(e instanceof InterruptedException)
				return;
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			this.logger.error(errmsg, e);
		} finally {
			this.isRunMethodRunning = false;
		}
	}

	public synchronized void stopScript(){
		try{
			super.interrupt();
		} catch(Exception e){
			this.logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		}
	
		try{
			while(this.timers.size() != 0)
				this.timers.remove(0).cancel();
		} catch(Exception e){
			this.logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		}
		
		try{
			while(this.closeables.size() != 0)
				this.closeables.remove(0).close();
		} catch(Exception e){
			this.logger.error(String.format("%s, errmsg: %s, scriptName: %s", e.getClass().getSimpleName(), e.getMessage(), scriptName), e);
		}
	}
	
	public Timer newTimer() {
		Timer timer = new Timer();
		this.timers.add(timer);
		return timer;
	}
	
	public void newCloseable(Closeable closeable) {
		this.closeables.add(closeable);
	}
	
	public static ScriptThread currentThread(){
		Thread thread = Thread.currentThread();
		if(thread instanceof ScriptThread)
			return (ScriptThread) thread;
		
		String scriptName = thread.getName();
		return SingletonInstanceRepo.getInstance(ScriptExecutor.class).getScriptThread(scriptName);
	}
	
	public static ScriptLogger currentLogger() {
		return currentThread().getLogger();
	}
	
	public static String currentScriptName() {
		return currentThread().getScriptName();
	}
	
	public abstract void runScript() throws Exception;
}