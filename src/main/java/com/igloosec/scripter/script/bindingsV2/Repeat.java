package com.igloosec.scripter.script.bindingsV2;

import java.util.Timer;
import java.util.TimerTask;

import sun.org.mozilla.javascript.internal.Function;

import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.util.Util;

public class Repeat {
	private ScriptLogger logger = ScriptThread.currentLogger();
	private long period;
	private Timer timer;
	
	public Repeat(long period) {
		this.period = period;
	}
	
	public void run(final Function callback) {
		if(this.timer == null) timer = ScriptThread.currentThread().newTimer();
		final String scriptName = ScriptThread.currentThread().getScriptName();
		
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				try {
					Thread.currentThread().setName(scriptName);
					Util.invokeFunction(callback, null);
				} catch(Exception e) {
					logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
				}
			}
		}, 0, this.period);
	}
}