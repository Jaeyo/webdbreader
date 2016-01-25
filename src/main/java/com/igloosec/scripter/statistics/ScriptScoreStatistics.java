package com.igloosec.scripter.statistics;

import java.util.Iterator;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.commons.collections.MapIterator;
import org.apache.commons.collections.keyvalue.MultiKey;
import org.apache.commons.collections.map.MultiKeyMap;

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.ScriptScoreStatisticsDAO;
import com.igloosec.scripter.script.ScriptThread;

public class ScriptScoreStatistics {
	//category
	public static final String INPUT = "input";
	public static final String OUTPUT = "output";
	public static final String ERROR_LOG = "errorLog";
	
	private TreeMap<Long, ScriptScoreStatisticsCounter> counters = Maps.newTreeMap();
	private Timer timer = new Timer();
	
	private ScriptScoreStatisticsDAO scriptScoreStatisticsDAO = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsDAO.class);
	
	public ScriptScoreStatistics() {
		long delay = (60*1000) - (System.currentTimeMillis() % (60*1000));
		
		this.timer.scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				synchronized (counters) {
					Set<Long> oldTimestamps = Sets.newTreeSet();
					long currentTimestamp = currentTimestamp();
					
					Iterator<Long> iter = counters.keySet().iterator();
					while(iter.hasNext()) {
						Long timestampKey = iter.next();
						if(currentTimestamp < timestampKey) 
							oldTimestamps.add(timestampKey);
					}
					
					for(Long oldTimestamp: oldTimestamps) {
						Set<CounterValues> values = counters.remove(oldTimestamp).getValues();
						for(CounterValues value: values)
							scriptScoreStatisticsDAO.insertStatistics(
									value.getScriptName(), value.getCategory(), value.getTimestamp(), value.getCount());
					}
					
					scriptScoreStatisticsDAO.deleteUnderTimestamp(currentTimestamp - (6 * 60 * 60 * 1000));
				}
			}
		}, delay, 60 * 1000);
	}
	
	public void incrementCount(String category) {
		incrementCount(category, 1);
	}
	
	public void incrementCount(String category, long count) {
		String scriptName = ScriptThread.currentThread().getScriptName();
		incrementCount(scriptName, category, count);
	}
	
	public void incrementCount(String scriptName, String category, long count) {
		incrementCount(currentTimestamp(), scriptName, category, count);
	}
	
	public void incrementCount(long timestamp, String scriptName, String category, long count) {
		ScriptScoreStatisticsCounter counter = this.counters.get(timestamp);
		if(counter == null) {
			counter = new ScriptScoreStatisticsCounter(timestamp);
			this.counters.put(timestamp, counter);
		}
		counter.incrementCount(scriptName, category, count);
	}
	
	public Set<CounterValues> getCurrentCounterValues() {
		ScriptScoreStatisticsCounter counter = this.counters.get(currentTimestamp());
		if(counter == null) return null;
		return counter.getValues();
	}
	
	public Set<CounterValues> getCurrentCounterValues(String scriptName) {
		ScriptScoreStatisticsCounter counter = this.counters.get(currentTimestamp());
		if(counter == null) return null;
		return counter.getValues(scriptName);
	}
	
	private static long currentTimestamp() {
		long timestamp = System.currentTimeMillis();
		timestamp = timestamp - (timestamp % (60*1000));
		return timestamp;
	}
	
	
	class ScriptScoreStatisticsCounter {
		private long timestamp;
		
		//key: scriptName(string), category(string), value: count(AtomicLong)
		private MultiKeyMap counter = new MultiKeyMap();

		public ScriptScoreStatisticsCounter(long timestamp) {
			this.timestamp = timestamp;
		}

		public void incrementCount(String scriptName, String category, long count) {
			AtomicLong atomicCount = (AtomicLong) this.counter.get(scriptName, category);
			if(atomicCount == null) {
				atomicCount = new AtomicLong(0L);
				this.counter.put(scriptName, category, atomicCount);
			}
			atomicCount.addAndGet(count);
		}
		
		public Set<CounterValues> getValues() {
			Set<CounterValues> results = Sets.newHashSet();
			MapIterator iter = this.counter.mapIterator();
			while(iter.hasNext()) {
				iter.next();
				MultiKey key = (MultiKey) iter.getKey();
				String scriptName = (String) key.getKey(0);
				String category = (String) key.getKey(1);
				AtomicLong value = (AtomicLong) iter.getValue();
				results.add(new CounterValues(timestamp, scriptName, category, value.get()));
			}
			return results;
		}
		
		public Set<CounterValues> getValues(String _scriptName) {
			Set<CounterValues> results = Sets.newHashSet();
			MapIterator iter = this.counter.mapIterator();
			while(iter.hasNext()) {
				iter.next();
				MultiKey key = (MultiKey) iter.getKey();
				String scriptName = (String) key.getKey(0);
				String category = (String) key.getKey(1);
				AtomicLong value = (AtomicLong) iter.getValue();
				if(scriptName.equals(_scriptName))
					results.add(new CounterValues(timestamp, scriptName, category, value.get()));
			}
			return results;
		}
	}
	
	public class CounterValues {
		private long timestamp;
		private String scriptName;
		private String category;
		private long count;
		
		public CounterValues(long timestamp, String scriptName, String category, long count) {
			this.timestamp = timestamp;
			this.scriptName = scriptName;
			this.category = category;
			this.count = count;
		}
		
		public long getTimestamp() {
			return timestamp;
		}
		public String getScriptName() {
			return scriptName;
		}
		public String getCategory() {
			return category;
		}
		public long getCount() {
			return count;
		}
	}
}