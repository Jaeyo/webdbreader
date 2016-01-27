package com.igloosec.scripter.script.bindings_pipe_OLD.headpipe;

import java.util.Timer;
import java.util.TimerTask;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.PipeHead;

public class SchedulePipeHead extends PipeHead {
	private long period;
	private Function callback;
	private Timer timer;
	
	public SchedulePipeHead(long period, Function callback) {
		this.period = period;
		this.callback = callback;
		this.timer = ScriptThread.currentThread().newTimer();
	}
	
	@Override
	public void run() throws Exception {
		final String scriptName = ScriptThread.currentThread().getScriptName();
		
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				Thread.currentThread().setName(scriptName);
				
				Context context = Context.enter();
				ScriptableObject scope = context.initStandardObjects();
				Scriptable that = context.newObject(scope);
				callback.call(context, that, scope, new Object[]{});
			}
		}, 0, this.period);
	}
}