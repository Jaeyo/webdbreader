package com.igloosec.webdbreader.script.bindings;

import java.io.IOException;
import java.util.Map;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.util.ContinuousFile;
import com.igloosec.webdbreader.util.Util;

public class FileReaderFactory {
	private ScriptLogger logger;
	
	public FileReaderFactory(ScriptLogger logger) {
		this.logger = logger;
	} //INIT
	
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
	
		logger.info(String.format("fileReader created, filename: %s, deleteExpiredFile: %s, charset: %s, timeAdjustSec: %s",
				filename, deleteExpiredFile, charset, timeAdjustSec));
		return new FileReader(filename, deleteExpiredFile, charset, timeAdjustSec);
	} //getReader
	
	public class FileReader {
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
			final String scriptName = ScriptThread.currentThread().getScriptName();
			Thread thread = new Thread(){
				@Override
				public void run() {
					try{
						Thread.currentThread().setName(scriptName);
						
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
						e.printStackTrace();
						logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
					} //catch
				} //run
			}; //thread
			ScriptThread.currentThread().addFileReaderMonitoringThread(thread);
			thread.start();
		} //registerListener
	} //class
} //class