package com.igloosec.webdbreader.script.bindings;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.service.FileOutMsgService;
import com.igloosec.webdbreader.statistics.ScriptScoreStatistics;

public class FileWriterFactory {
	private ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private ScriptLogger logger;
	private FileOutMsgService fileOutMsgService = SingletonInstanceRepo.getInstance(FileOutMsgService.class);
	
	public FileWriterFactory(ScriptLogger logger) {
		this.logger = logger;
	} //INIT
	
	/*
	 * @param args: {
	 * 		filename: (string)(required)
	 * 		charset: (string)(required)
	 * }
	 * @return
	 * @throws IOException 
	 * @throws ParseException 
	 */
	public FileWriter getWriter(Map<String, Object> args) throws ParseException, IOException{
		String filename = (String) args.get("filename");
		String charset = (String) args.get("charset");
		FileWriter writer = new FileWriter(filename, charset);
		ScriptThread.currentThread().addFileWriter(writer);
		
		logger.info(String.format("fileWriter created: %s, %s", filename, charset));
		
		return writer;
	} //getWriter
	
	public class FileWriter {
		private String originalFilename;
		private String charset;
		private File file;
		private PrintWriter output;
		private Lock lock = new ReentrantLock();
		
		public FileWriter(String filename, String charsetName) throws ParseException, IOException {
			this.originalFilename = filename;
			this.charset = charsetName;
			this.file = new File(new DateUtil(logger).formatReplace(filename));
			if(file.exists() == false)
				file.createNewFile();
			this.output = new PrintWriter(this.file, charsetName);
			
			SimpleDateFormat yyyyMMddHHmm = new SimpleDateFormat("yyyyMMddHHmm");
			long nextMinute = yyyyMMddHHmm.parse(yyyyMMddHHmm.format(new Date())).getTime() + (60 * 1000);
			Timer timer = new Timer();
			timer.scheduleAtFixedRate(new TimerTask() {
				@Override
				public void run() {
					String newFilename = new DateUtil(logger).formatReplace(originalFilename);
					if(newFilename.equals(file.getName()) == false){
						lock.lock();
						try{
							file = new File(newFilename);
							output.close();
							output = new PrintWriter(file, charset);
						} catch (Exception e) {
							e.printStackTrace();
							logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
						} finally{
							lock.unlock();
						} //finally
					} //if
				} //run
			}, nextMinute - System.currentTimeMillis(), 60 * 1000);
			
			((ScriptThread) Thread.currentThread()).addSchedulerTimer(timer);
		} //INIT
		
		public FileWriter println(String msg){
			return print(msg + "\n");
		} //println
		
		public FileWriter print(String msg){
			lock.lock();
			try{
				output.append(msg);
				output.flush();
				
				if(msg.contains("\n"))
					scriptScoreStatistics.incrementCount(ScriptScoreStatistics.FILE_WRITE, msg.split("\n").length - 1);
	
				String scriptName = ScriptThread.currentThread().getScriptName();
				fileOutMsgService.dispatchMsg(scriptName, System.currentTimeMillis(), msg);
			} finally{
				lock.unlock();
			} //finally
			return this;
		} //print
		
		public void close(){
			output.close();
			ScriptThread scriptThread = ScriptThread.currentThread();
			if(scriptThread != null)
				scriptThread.removeFileWriter(this);
		} //close
	} //class
}