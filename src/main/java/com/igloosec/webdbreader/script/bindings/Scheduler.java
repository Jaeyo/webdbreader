package com.igloosec.webdbreader.script.bindings;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

import com.igloosec.webdbreader.script.ScriptThread;

public class Scheduler {
	private static final Logger logger = LoggerFactory.getLogger(Scheduler.class);
	
	/**
	 * @param args: {
	 * 		delay: (long)(default: 0)
	 * 		period: (long)(required)
	 * }
	 * @param task: function(){ ... }
	 */
	public void schedule(Map<String, Object> args, final Function task){
		Long delay = (Long) args.get("delay");
		Long period = (Long) args.get("period");
		
		if(delay == null) delay = 0L;
		
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				Context context = Context.enter();
				ScriptableObject scope = context.initStandardObjects();
				Scriptable that = context.newObject(scope);
				task.call(context, that, scope, new Object[]{});
			} // run
		}, delay, period);
		
		ScriptThread thread = (ScriptThread) Thread.currentThread();
		thread.addSchedulerTimer(timer);
	} // schedule

	/**
	 * @param args: {
	 * 		times: [ (string)(hhMM)(required) ]
	 * }
	 * @param task: function(){ ... }
	 */
	public void scheduleAtFixedTime(Map<String, Object> args, Function task){
		List<String> hhMMs = (List<String>) args.get("times");
		
		String yyyyMMdd = new SimpleDateFormat("yyyyMMdd").format(new Date());
		SimpleDateFormat format4yyyyMMddHHmm = new SimpleDateFormat("yyyyMMddHHmm");
		
		for(String hhMM : hhMMs){
			try {
				long targetTimestamp = format4yyyyMMddHHmm.parse(yyyyMMdd + hhMM).getTime();
				if(targetTimestamp < System.currentTimeMillis())
					targetTimestamp += 24 * 60 * 60 * 1000;
				
				long delay = targetTimestamp - System.currentTimeMillis();
				long period = 24 * 60 * 60 * 1000;
				
				Map<String, Object> scheduleArgs = new HashMap<String, Object>();
				scheduleArgs.put("delay", delay);
				scheduleArgs.put("period", period);
				schedule(scheduleArgs, task);
			} catch (ParseException e) {
				logger.error(String.format("%s, errmsg : %s, hhMMs : %s", e.getClass().getSimpleName(), e.getMessage(), hhMMs), e);
			} //catch
		} //for hhMM
	} //scheduleAtFixedTime
} // class