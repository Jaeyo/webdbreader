package com.igloosec.SpDbReader.bindings;

import java.io.File;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.SpDbReader.OutputFileLastModified;

public class OutputFileDeleteTask {
	private static final Logger logger = LoggerFactory.getLogger(OutputFileDeleteTask.class);
	private boolean isStarted = false;
	private Timer timer = new Timer();

	public synchronized void startMonitoring(long period, final long expiredTime) {
		if (isStarted)
			return;
		isStarted = true;

		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				List<File> toDeleteFiles = OutputFileLastModified.getInstance().pollExpiredOutputFiles(expiredTime);
				for (File toDeleteFile : toDeleteFiles) {
					logger.info("{} will be deleted", toDeleteFile.getAbsolutePath());
					boolean result = toDeleteFile.delete();
					if (!result)
						logger.error("failed to delete {}", toDeleteFile.getAbsoluteFile());
				} // for toDeleteFIle
			} // run
		}, 2 * 1000, period);
	} // startMonitoring
} // class