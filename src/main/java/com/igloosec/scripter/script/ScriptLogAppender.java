package com.igloosec.scripter.script;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.Map;

import org.apache.log4j.Appender;
import org.apache.log4j.AppenderSkeleton;
import org.apache.log4j.DailyRollingFileAppender;
import org.apache.log4j.Level;
import org.apache.log4j.PatternLayout;
import org.apache.log4j.spi.LoggingEvent;

import com.google.common.collect.Maps;
import com.igloosec.scripter.common.Path;

public class ScriptLogAppender extends AppenderSkeleton implements Appender {
	private Map<String, DailyRollingFileAppender> appenders = Maps.newHashMap();

	@Override
	protected void append(LoggingEvent event) {
		try {
			String scriptName = event.getThreadName();
			DailyRollingFileAppender logAppender = appenders.get(scriptName);
			DailyRollingFileAppender errlogAppender = appenders.get(scriptName + "-err");
			if(logAppender == null || errlogAppender == null) {
				PatternLayout layout = new PatternLayout("%d %p - | %m%n");
				String logFilename = new File(Path.getPackagePath(), "logs/" + scriptName + ".log").getAbsolutePath();
				String errlogFilename = new File(Path.getPackagePath(), "logs/" + scriptName + "-err.log").getAbsolutePath();
				logAppender = new DailyRollingFileAppender(layout, logFilename, "yyyyMMdd");
				logAppender.setAppend(true);
				logAppender.setEncoding("UTF-8");
				logAppender.setThreshold(Level.DEBUG);
				errlogAppender = new DailyRollingFileAppender(layout, errlogFilename, "yyyyMMdd");
				errlogAppender.setAppend(true);
				errlogAppender.setEncoding("UTF-8");
				errlogAppender.setThreshold(Level.ERROR);
				appenders.put(scriptName, logAppender);
				appenders.put(scriptName + "-err", errlogAppender);
			}
			logAppender.append(event);
			if(event.getLevel().equals(Level.ERROR))
				errlogAppender.append(event);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void close() {
		Collection<DailyRollingFileAppender> allAppenders = appenders.values();
		for(DailyRollingFileAppender appender: allAppenders)
			appender.close();
	}

	@Override
	public boolean requiresLayout() {
		return false;
	}
}