package com.igloosec.SpDbReader.bindings;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;

public class DateUtil{
	private static final Logger logger = Logger.getLogger(DateUtil.class);
	
	public String format(long date, String format){
		return new SimpleDateFormat(format).format(new Date(date));
	}
	
	public long parse(String dateStr, String format){
		try {
			return new SimpleDateFormat(format).parse(dateStr).getTime();
		} catch (ParseException e) {
			logger.warn(String.format("failed to parse %s, format:%s", dateStr, format));
			return -1;
		}
	}
	
	public long currentTimeMillis(){
		return System.currentTimeMillis();
	}
}