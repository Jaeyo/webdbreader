package com.igloosec.scripter.util;

import java.io.File;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.FileAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.WriterAppender;
import org.apache.log4j.xml.DOMConfigurator;

import com.igloosec.scripter.common.Path;
import com.igloosec.scripter.exception.UnknownThresholdException;

public class Log4jConfig {
	public static void initLog4j() {
		System.setProperty("home.path", Path.getPackagePath().getAbsolutePath());
		
		File log4jXml = new File(Path.getPackagePath(), "conf/log4j.xml");
		if(log4jXml.exists() == false) return;
		
		DOMConfigurator.configure(log4jXml.getAbsolutePath());
	}
	
	public static void setThreshold(String logLevel) throws UnknownThresholdException {
		Logger logger = Logger.getLogger("com.igloosec");
		FileAppender fileAppender = (FileAppender) logger.getAppender("fileout");
		ConsoleAppender consoleAppender = (ConsoleAppender) logger.getAppender("consoleout");

		for(WriterAppender appender: new WriterAppender[]{ fileAppender, consoleAppender }) {
			if(logLevel.equalsIgnoreCase("off")) {
				appender.setThreshold(Level.OFF);
			} else if(logLevel.equalsIgnoreCase("fatal")) {
				appender.setThreshold(Level.FATAL);
			} else if(logLevel.equalsIgnoreCase("error")) {
				appender.setThreshold(Level.ERROR);
			} else if(logLevel.equalsIgnoreCase("warn")) {
				appender.setThreshold(Level.WARN);
			} else if(logLevel.equalsIgnoreCase("info")) {
				appender.setThreshold(Level.INFO);
			} else if(logLevel.equalsIgnoreCase("debug")) {
				appender.setThreshold(Level.DEBUG);
			} else if(logLevel.equalsIgnoreCase("trace")) {
				appender.setThreshold(Level.TRACE);
			} else if(logLevel.equalsIgnoreCase("all")) {
				appender.setThreshold(Level.ALL);
			} else {
				throw new UnknownThresholdException(logLevel);
			}
			appender.activateOptions();
		}
	}

	public static String getThreshold() {
		Logger logger = Logger.getLogger("com.igloosec");
		FileAppender fileAppender = (FileAppender) logger.getAppender("fileout");
		return fileAppender.getThreshold().toString();
	}
}