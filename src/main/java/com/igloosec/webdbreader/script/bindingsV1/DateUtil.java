package com.igloosec.webdbreader.script.bindingsV1;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.igloosec.webdbreader.script.ScriptThread;

public class DateUtil{
	private ScriptLogger logger = ScriptThread.currentThread().getLogger();
	
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
			logger.warn(String.format("failed to parse %s, format:%s", dateStr, format));
			return -1;
		} //catch
	} //parse
	
	public long currentTimeMillis(){
		return System.currentTimeMillis();
	} //currentTimeMillis
} //class