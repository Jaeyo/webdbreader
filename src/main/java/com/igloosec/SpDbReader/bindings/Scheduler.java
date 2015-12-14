package com.igloosec.SpDbReader.bindings;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Scheduler {
	private static final Logger logger = LoggerFactory.getLogger(Scheduler.class);
	private Timer timer = new Timer();

	public void schedule(long delay, long period, final Runnable task) {
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				task.run();
			} // run
		}, delay, period);
	} // schedule

	public void schedule(long period, final Runnable task) {
		schedule(0, period, task);
	} // schedule
	
	public void scheduleAtFixedTime(String[] hhMMs, final Runnable task) {
		logger.info("hhMMs: {}", Arrays.toString(hhMMs));
		
		String yyyyMMdd = new SimpleDateFormat("yyyyMMdd").format(new Date());
		SimpleDateFormat format4yyyyMMddHHmm = new SimpleDateFormat("yyyyMMddHHmm");
		
		for(String hhMM : hhMMs){
			try {
				long targetTimestamp = format4yyyyMMddHHmm.parse(yyyyMMdd + hhMM).getTime();
				if(targetTimestamp < System.currentTimeMillis())
					targetTimestamp += 24 * 60 * 60 * 1000;
				
				schedule(targetTimestamp-System.currentTimeMillis(), 24 * 60 * 60 * 1000, task);
			} catch (ParseException e) {
				logger.error(String.format("%s, errmsg : %s, hhMMs : %s", e.getClass().getSimpleName(), e.getMessage(), Arrays.toString(hhMMs)), e);
			} //catch
		} //for hhMM
	} //scheduleAtFixedTime
} // class