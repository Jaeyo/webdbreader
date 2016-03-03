package com.igloosec.SpDbReader.bindings;

import java.io.File;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.log4j.Logger;

import com.igloosec.SpDbReader.OutputFileLastModified;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;

public class OutputFileDeleteTask {
	private static final ScriptLogger logger = ScriptThread.currentLogger();
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
					logger.info(String.format("%s will be deleted", toDeleteFile.getAbsolutePath()));
					boolean result = toDeleteFile.delete();
					if (!result)
						logger.error(String.format("failed to delete %s", toDeleteFile.getAbsoluteFile()));
				} // for toDeleteFIle
			} // run
		}, 2 * 1000, period);
	} // startMonitoring
} // class