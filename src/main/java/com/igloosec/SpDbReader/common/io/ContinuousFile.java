package com.igloosec.SpDbReader.common.io;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 시간에 따라 switching 되는 파일을 읽기 위한 클래스
 * @author leejy
 *
 */
public class ContinuousFile implements Closeable{
	private static final Logger logger=LoggerFactory.getLogger(ContinuousFile.class);
	private String filenameWithDateFormat=null;
	private String currentFilename=null;
	private String charset = null;
	private File currentFile=null;
	private BufferedReader input=null;
	private boolean deleteExpiredFile=false;
	private int timeAdjustSec=0;
	
	public ContinuousFile(String filenameWithDateFormat, boolean deleteExpiredFile, String charset, int timeAdjustSec) throws IOException{
		this.filenameWithDateFormat=filenameWithDateFormat;
		this.deleteExpiredFile=deleteExpiredFile;
		this.charset=charset;
		this.timeAdjustSec=timeAdjustSec;
		
		logger.info("filename : {}, deleteExpiredFile : {}, encoding : {}", filenameWithDateFormat, deleteExpiredFile, charset);
		
		init();
	}
	
	private void init() throws IOException{
		close();
		currentFilename=getFilenameWithDateFormat(filenameWithDateFormat);
		currentFile=new File(currentFilename);
		input=null;
		try{
			input=new BufferedReader(new FileReader(currentFile));
		} catch(FileNotFoundException e){
			logger.warn("file not exists, {}", currentFilename);
		}
	}
	
	private boolean switchIfPossible() throws IOException{
		if(!currentFilename.equalsIgnoreCase(getFilenameWithDateFormat(filenameWithDateFormat))){
			String oldFilename=currentFilename;
			File oldFile=new File(oldFilename);
			String newFilename=getFilenameWithDateFormat(filenameWithDateFormat);
			File newFile=new File(newFilename);
			
			if(newFile.exists()==false)
				return false;
			
			if(deleteExpiredFile){
				logger.info("switched file delete : {}", currentFile.getAbsolutePath());
				close();
				oldFile.delete();
			}
			
			init();
			logger.info("file switched {} -> {}", oldFilename, currentFilename);
			return true;
		}
		
		return false;
	}
	
	public String getCurrentFileName() {
		return this.currentFilename;
	}
	
	public String readLine() throws IOException{
		if(currentFile.exists() && input!=null){
			String line=input.readLine();
			if(line!=null)
				return line;
			
			if(switchIfPossible())
				return readLine();
		}
		
		
		if(currentFile.exists()==false){
			if(switchIfPossible())
				return readLine();
			else
				return null;
		}
		
		if(input==null) 
			input=new BufferedReader(new InputStreamReader(new FileInputStream(currentFile), charset));
		
		String line=input.readLine();
		if(line!=null)
			return line;
		
		return null;
	}
	
	private String getFilenameWithDateFormat(String filenameWithDateFormat){
		Calendar cal=Calendar.getInstance();
		cal.add(Calendar.SECOND, this.timeAdjustSec);
		filenameWithDateFormat=filenameWithDateFormat.replace("$yyyy", String.format("%04d", cal.get(Calendar.YEAR)));
		filenameWithDateFormat=filenameWithDateFormat.replace("$mm", String.format("%02d", cal.get(Calendar.MONTH)+1));
		filenameWithDateFormat=filenameWithDateFormat.replace("$dd", String.format("%02d", cal.get(Calendar.DATE)));
		filenameWithDateFormat=filenameWithDateFormat.replace("$hh", String.format("%02d", cal.get(Calendar.HOUR_OF_DAY)));
		filenameWithDateFormat=filenameWithDateFormat.replace("$mi", String.format("%02d", cal.get(Calendar.MINUTE)));
		filenameWithDateFormat=filenameWithDateFormat.replace("$ss", String.format("%02d", cal.get(Calendar.SECOND)));
		return filenameWithDateFormat;
	}

	@Override
	public void close() throws IOException {
		if(input!=null)
			input.close();
	}
}