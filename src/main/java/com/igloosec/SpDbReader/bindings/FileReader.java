package com.igloosec.SpDbReader.bindings;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.SpDbReader.common.Function;
import com.igloosec.SpDbReader.common.Util;
import com.igloosec.SpDbReader.common.io.ContinuousFile;

public class FileReader {
	private static final Logger logger = LoggerFactory.getLogger(FileReader.class);

	public void readFileNewLine(final String filename, final Function onLine, final Function onExit, final String charset){
		logger.info("filename : {}", filename);

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
						} //if

						onLine.execute(line);
					} //for ;;
				} catch(Exception e){
					logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} finally{
					if(continuousFile!=null)
						try {
							continuousFile.close();
						} catch (IOException e) {
							logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
						} //catch
				} //finally
			} //run
		}.start();
	} //readFileNewLine
	
	public void monitorFileNewLine(final String filenameWithDateFormat, final Function onLine, final boolean deleteExpiredFile){
		monitorFileNewLine(filenameWithDateFormat, onLine, deleteExpiredFile, "UTF-8");
	} //monitorFileNewLine
	
	public void monitorFileNewLine(final String filenameWithDateFormat, final Function onLine, final boolean deleteExpiredFile, final String charset){
		monitorFileNewLine(filenameWithDateFormat, onLine, deleteExpiredFile, charset, 0);
	} //monitorFileNewLine
	
	public void monitorFileNewLine(final String filenameWithDateFormat, final Function onLine, final boolean deleteExpiredFile, 
			final String charset, final int timeAdjustSec){
		logger.info("filename : {}", filenameWithDateFormat);

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
						} //if

						onLine.execute(line, continuousFile.getCurrentFileName());
					} //for ;;
				} catch(Exception e){
					logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} finally{
					if(continuousFile!=null)
						try {
							continuousFile.close();
						} catch (IOException e) {
							logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
						} //catch
				} //finally
			} //run
		}.start();
	} //monitorFileWithDateFormat
	
	public String readAll(String filename){
		return readAll(filename, false);
	} //readAll
	
	public String readAll(String filename, boolean delete){
		return readAll(filename, delete, -1);
	} //readAll
	
	public String readAll(String filename, boolean delete, long maxBytes){
		logger.info("filename : {}, delete : {}, maxBytes : {}", filename, delete, maxBytes);
		
		BufferedReader input=null;
		
		try{
			StringBuilder sb = new StringBuilder();
			File file = new File(filename);
			if(!file.exists()){
				logger.error("file {} not exists", filename);
				return null;
			} //if
			
			input = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
			String line = null;
			
			while((line = input.readLine())!=null){
				sb.append(line).append("\n");
				if(maxBytes>0 && sb.toString().getBytes().length>maxBytes)
					break;
			} //while
			
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
			} //if
		} //finally
	} //readAll
} // class