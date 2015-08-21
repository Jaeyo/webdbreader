package com.igloosec.webdbreader.script.bindings;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DateUtil{
	private static final Logger logger=LoggerFactory.getLogger(DateUtil.class);
	
	public String format(long date, String format){
		return new SimpleDateFormat(format).format(new Date(date));
	} //format
	
	public String formatReplace(String src){
		Date currentTime = new Date(System.currentTimeMillis());
		src = src.replace("$yyyy", new SimpleDateFormat("yyyy").format(currentTime));
		src = src.replace("$mm", new SimpleDateFormat("MM").format(currentTime));
		src = src.replace("$dd", new SimpleDateFormat("dd").format(currentTime));
		src = src.replace("$hh", new SimpleDateFormat("HH").format(currentTime));
		src = src.replace("$mi", new SimpleDateFormat("mm").format(currentTime));
		return src;
	} //formatReplace
	
	public long parse(String dateStr, String format){
		try {
			return new SimpleDateFormat(format).parse(dateStr).getTime();
		} catch (ParseException e) {
			logger.warn("failed to parse {}, format:{}", dateStr, format);
			return -1;
		} //catch
	} //parse
	
	public long currentTimeMillis(){
		return System.currentTimeMillis();
	} //currentTimeMillis
} //class