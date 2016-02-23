package com.igloosec.SpDbReader;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.log4j.Logger;

public class OutputFileLastModified {
	private static final Logger logger = Logger.getLogger(OutputFileLastModified.class);
	private static final int LAST_MODIFIED_TIMES_MAX_SIZE = 1000;
	private static OutputFileLastModified INSTANCE = null;

	private Map<String, Long> lastModifiedTimes = new HashMap<String, Long>();
	private Lock lastModifiedTimesLock=new ReentrantLock();

	public static OutputFileLastModified getInstance() {
		synchronized (OutputFileLastModified.class) {
			if (INSTANCE == null)
				INSTANCE = new OutputFileLastModified();
			return INSTANCE;
		} // sync
	} // getInstance

	private OutputFileLastModified() {
	} // INIT

	public void pushLastModifiedTime(String filenameWithFullPath, long modifiedTime) {
		lastModifiedTimesLock.lock();

		try{
//			logger.info("{} modified", filenameWithFullPath);
			lastModifiedTimes.put(filenameWithFullPath, modifiedTime);

			if(lastModifiedTimes.size()>=LAST_MODIFIED_TIMES_MAX_SIZE){
				logger.error("lastModifiedTimes.size() >= 1000");
				lastModifiedTimes.clear();
			} //if
		} finally{
			lastModifiedTimesLock.unlock();
		} //finally
	} // putLastModifiedTime
	
	public List<File> pollExpiredOutputFiles(long expiredTime){
		lastModifiedTimesLock.lock();
		List<String> expiredFiles=new ArrayList<String>();
		
		try{
			long deadTime=System.currentTimeMillis()-expiredTime;

			Iterator<Entry<String, Long>> iter=lastModifiedTimes.entrySet().iterator();
			while(iter.hasNext()) {
				Entry<String, Long> next=iter.next();
				String filePath=next.getKey();
				Long lastModifiedTime=next.getValue();
				if(lastModifiedTime<deadTime)
					expiredFiles.add(filePath);
			} //while

			List<File> retFiles=new ArrayList<File>();
			for(String expiredFile : expiredFiles){
				File file=new File(expiredFile);
				if(file.exists())
					retFiles.add(file);
				lastModifiedTimes.remove(expiredFile);
			} //for expiredFile

			return retFiles;
		} finally{
			lastModifiedTimesLock.unlock();
		} //finally
	} //getExpiredOutputFiles
} // class