package com.igloosec.scripter.script.bindingsV2;

import java.util.Timer;
import java.util.TimerTask;

import com.igloosec.scripter.util.Util;

import sun.org.mozilla.javascript.internal.Function;

public class Repeat {
	private long period;
	private Timer timer;
	
	public Repeat(long period) {
		this.period = period;
		this.timer = new Timer();
	}
	
	public void run(final Function callback) {
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				Util.invokeFunction(callback, null);
			}
		}, 0, this.period);
	}
}