package com.igloosec.SpDbReader.bindings;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.log4j.Logger;

import com.igloosec.SpDbReader.common.Function;
import com.igloosec.SpDbReader.common.Util;
import com.igloosec.SpDbReader.common.io.ContinuousFile;

public class FileReader {
	private static final Logger logger = Logger.getLogger(FileReader.class);

	public void readFileNewLine(final String filename, final Function onLine, final Function onExit, final String charset){
		logger.info(String.format("filename : %s", filename));

		new Thread(){
			public void run(){
				ContinuousFile continuousFile=null;
				try{
					continuousFile=new ContinuousFile(filename, false, charset, 0);
					String line=null;
					for(;;){
						line=continuousFile.readLine();
						if(line==null){
							onExit.execute();
							return;
						}

						onLine.execute(line);
					}
				} catch(Exception e){
					logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} finally{
					if(continuousFile!=null)
						try {
							continuousFile.close();
						} catch (IOException e) {
							logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
						}
				}
			}
		}.start();
	}
	
	public void monitorFileNewLine(final String filenameWithDateFormat, final Function onLine, final boolean deleteExpiredFile){
		monitorFileNewLine(filenameWithDateFormat, onLine, deleteExpiredFile, "UTF-8");
	}
	
	public void monitorFileNewLine(final String filenameWithDateFormat, final Function onLine, final boolean deleteExpiredFile, final String charset){
		monitorFileNewLine(filenameWithDateFormat, onLine, deleteExpiredFile, charset, 0);
	}
	
	public void monitorFileNewLine(final String filenameWithDateFormat, final Function onLine, final boolean deleteExpiredFile, 
			final String charset, final int timeAdjustSec){
		logger.info(String.format("filename : %s", filenameWithDateFormat));

		new Thread(){
			public void run(){
				ContinuousFile continuousFile=null;
				try{
					continuousFile=new ContinuousFile(filenameWithDateFormat, deleteExpiredFile, charset, timeAdjustSec);
					String line=null;
					for(;;){
						line=continuousFile.readLine();
						if(line==null){
							Util.sleep(1000);
							continue;
						}

						onLine.execute(line, continuousFile.getCurrentFileName());
					}
				} catch(Exception e){
					logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} finally{
					if(continuousFile!=null)
						try {
							continuousFile.close();
						} catch (IOException e) {
							logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
						}
				}
			}
		}.start();
	}
	
	public String readAll(String filename){
		return readAll(filename, false);
	}
	
	public String readAll(String filename, boolean delete){
		return readAll(filename, delete, -1);
	}
	
	public String readAll(String filename, boolean delete, long maxBytes){
		logger.info(String.format("filename : %s, delete : %s, maxBytes : %s", filename, delete, maxBytes));
		
		BufferedReader input=null;
		
		try{
			StringBuilder sb = new StringBuilder();
			File file = new File(filename);
			if(!file.exists()){
				logger.error(String.format("file %s not exists", filename));
				return null;
			}
			
			input = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
			String line = null;
			
			while((line = input.readLine())!=null){
				sb.append(line).append("\n");
				if(maxBytes>0 && sb.toString().getBytes().length>maxBytes)
					break;
			}
			
			if(delete)
				file.delete();
			
			return sb.toString();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		} finally{
			if(input!=null){
				try {
					input.close();
				} catch (IOException e) { }
			}
		}
	}
}