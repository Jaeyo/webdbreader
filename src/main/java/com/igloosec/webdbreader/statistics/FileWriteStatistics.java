package com.igloosec.webdbreader.statistics;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicLong;

import com.igloosec.webdbreader.service.FileWriteStatisticsService;

public class FileWriteStatistics {
	private Map<String, TreeMap<Long, AtomicLong>> counters = new HashMap<String, TreeMap<Long,AtomicLong>>();
	private Timer timer = new Timer();
	
	private FileWriteStatisticsService fileWriteStatisticsService;
	
	public FileWriteStatistics() {
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				synchronized (counters) {
					for(Entry<String, TreeMap<Long, AtomicLong>> counterEntry : counters.entrySet()){
						String scriptName = counterEntry.getKey();
						TreeMap<Long, AtomicLong> counter = counterEntry.getValue();
						while(counter.keySet().size() >= 2){
							long oldCountTimestamp = counter.firstKey();
							long oldCountValue = counter.remove(oldCountTimestamp).get();
							fileWriteStatisticsService.insertStatistics(scriptName, oldCountTimestamp, oldCountValue);
						} //if
					} //for counter
				} //sync
				
				fileWriteStatisticsService.deleteUnderTimestamp(System.currentTimeMillis() - (24 * 60 * 60 * 1000));
			} //run
		}, 60*1000, 60*1000);
	} //INIT

	public void incrementCount(String scriptName){
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