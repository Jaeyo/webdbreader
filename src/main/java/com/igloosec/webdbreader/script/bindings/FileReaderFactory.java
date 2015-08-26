package com.igloosec.webdbreader.script.bindings;

import java.io.IOException;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.util.ContinuousFile;
import com.igloosec.webdbreader.util.Util;

public class FileReaderFactory {
	/**
	 * @param args: {
	 * 		filename: (string)(required)
	 * 		deleteExpiredFile: (boolean)(default: false)
	 * 		charset: (string)(default: utf8)
	 * 		timeAdjustSec: (integer)(default: 0)
	 * }
	 * @return
	 * @throws IOException 
	 */
	public FileReader getReader(Map<String, Object> args) throws IOException{
		String filename = (String) args.get("filename");
		Boolean deleteExpiredFile = (Boolean) args.get("deleteExpiredFile");
		String charset = (String) args.get("charset");
		Integer timeAdjustSec = ((Double) args.get("timeAdjustSec")).intValue();
		
		if(deleteExpiredFile == null) deleteExpiredFile = false;
		if(charset == null) charset = "utf8";
		if(timeAdjustSec == null) timeAdjustSec = 0;
	
		return new FileReader(filename, deleteExpiredFile, charset, timeAdjustSec);
	} //getReader
	
	public static class FileReader {
		private static final Logger logger = LoggerFactory.getLogger(FileReader.class);
		private ContinuousFile file;
		
		public FileReader(String originalFilename, boolean deleteExpiredFile, String charset, int timeAdjustSec) throws IOException {
			this.file = new ContinuousFile(originalFilename, deleteExpiredFile, charset, timeAdjustSec);
		} //INIT
		
		public String readLine() throws IOException{
			return file.readLine();
		} //readLine
		
		/**
		 * @param callback: function( line(string) ){ ... }
		 */
		public void registerListener(final Function callback){
			ScriptThread thread = new ScriptThread(Thread.currentThread().getName()){
				@Override
				public void run() {
					try{
						Context context = Context.enter();
						ScriptableObject scope = context.initStandardObjects();
						Scriptable that = context.newObject(scope);

						
						for(;;){
							String line = readLine();
							if(line == null){
								Util.sleep(1000);
								continue;
							} //if
							
							callback.call(context, that, scope, new Object[]{ line });
						} //for ;;
					} catch(Exception e){
						logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
					} //catch
				} //run
			}; //thread
			thread.start();
		} //registerListener
	} //class
} //class