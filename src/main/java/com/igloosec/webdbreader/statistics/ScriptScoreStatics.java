package com.igloosec.webdbreader.statistics;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicLong;

import com.google.common.collect.Maps;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.service.ScriptScoreStatisticsService;

public class ScriptScoreStatics {
	//category
	public static final String QUERY = "query";
	public static final String UPDATE = "update";
	public static final String FILE_WRITE = "file_write";
	public static final String FILE_READ = "file_read";
	
	// <scriptName, <timestamp, count>>
	private Map<String, TreeMap<Long, AtomicLong>> dbQueryCounter = new HashMap<String, TreeMap<Long,AtomicLong>>();
	private Map<String, TreeMap<Long, AtomicLong>> dbUpdateCounter = new HashMap<String, TreeMap<Long,AtomicLong>>();
	private Map<String, TreeMap<Long, AtomicLong>> fileWriteCounter = new HashMap<String, TreeMap<Long,AtomicLong>>();
	private Map<String, TreeMap<Long, AtomicLong>> fileReadCounter = new HashMap<String, TreeMap<Long,AtomicLong>>();
	private Timer timer = new Timer();
	
	private ScriptScoreStatisticsService scriptScoreStatisticsService = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsService.class);
	
	public ScriptScoreStatics() {
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				synchronized (ScriptScoreStatics.class) {
					
					TODO IMME
					
					Map<String, Map<String, TreeMap<Long, AtomicLong>>> counters = Maps.newHashMap();
					counters.put(QUERY, dbQueryCounter);
					counters.put(UPDATE, dbUpdateCounter);
					counters.put(FILE_WRITE, fileWriteCounter);
					counters.put(FILE_READ, fileReadCounter);
					
					for(Entry<String, Map<String, TreeMap<Long, AtomicLong>>> countersEntry : counters.entrySet()){
						String category = countersEntry.getKey();
						Map<String, TreeMap<Long, AtomicLong>> counter = countersEntry.getValue();
						
						for(Entry<String, TreeMap<Long, AtomicLong>> counterEntry : counter.entrySet()){
							String scriptName = counterEntry.getKey();
							TreeMap<Long, AtomicLong> counter = counterEntry.getValue();
							while(counter.keySet().size() >= 2){
								long oldCountTimestamp = counter.firstKey();
								long oldCountValue = counter.remove(oldCountTimestamp).get();
								scriptScoreStatisticsService.insertStatistics(scriptName, oldCountTimestamp, oldCountValue);
							} //if
						} //for counter
					} //for countersEntry


				} //sync

				scriptScoreStatisticsService.deleteUnderTimestamp(System.currentTimeMillis() - (24 * 60 * 60 * 1000));
			} //run
		}, 60 * 1000, 24 * 60 * 60 * 1000);
	} //INIT

	public void incrementCount(){
		incrementCount(1);
	} //incrementCount
	
	public void incrementCount(int count){
		ScriptThread scriptThread = (ScriptThread) Thread.currentThread();
		String scriptName = scriptThread.getName();
		
		synchronized (counters) {
			TreeMap<Long, AtomicLong> counter = counters.get(scriptName);
			if(counter == null){
				counter = new TreeMap<Long, AtomicLong>();
				counters.put(scriptName, counter);
			} //if

			long timestamp = System.currentTimeMillis();
			timestamp -= timestamp % (60*1000);
			AtomicLong countValue = counter.get(timestamp);
			if(countValue == null){
				countValue = new AtomicLong(0L);
				counter.put(timestamp, countValue);
			} //if
			countValue.incrementAndGet();
		} //sync
	} //incrementCount
} //class