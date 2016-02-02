package com.igloosec.scripter.script.bindingsV2;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.ws.WebServiceException;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.service.FileOutMsgService;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;
import com.sun.xml.internal.ws.Closeable;

public class File implements Closeable {
	private static final ScriptLogger logger = ScriptThread.currentLogger();
	private static ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private FileOutMsgService fileOutMsgService = SingletonInstanceRepo.getInstance(FileOutMsgService.class);
			
	private String filename;
	private String charset;
	private SwitchedFile switchedFile;
	
	public File(String filename, String charset) throws IOException {
		try {
			this.filename = filename;
			this.charset = charset;
			this.switchedFile = new SwitchedFile(filename, charset);

			ScriptThread.currentThread().newCloseable(this);
		} catch(Exception e) {
			logger.error(String.format("scriptName: %s, %s, errmsg: %s", ScriptThread.currentScriptName(), e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	public void append(String line) throws IOException {
		try {
			this.switchedFile.append(line);
			fileOutMsgService.dispatchMsg(ScriptThread.currentThread().getScriptName(), switchedFile.getCurrentFilename(), System.currentTimeMillis(), line);
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.OUTPUT);
		} catch(Exception e) {
			logger.error(String.format("scriptName: %s, %s, errmsg: $s", ScriptThread.currentScriptName(), e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
	
	public void appendLine(String line) throws IOException {
		append(line + "\n");
	}
	
	@Override
	public void close() throws WebServiceException {
		try {
			this.switchedFile.close();
		} catch(Exception e) {
			logger.error(String.format("scriptName: %s, %s, errmsg: %s", ScriptThread.currentScriptName(), e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}

	class SwitchedFile implements Closeable{
		private ScriptLogger logger = ScriptThread.currentLogger();
		private String originalFilename;
		private String charset;
		private String currentFilename;
		private PrintWriter output;
		private Formatter formatter = new Formatter();
		
		public SwitchedFile(String filename, String charset) throws IOException {
			this.originalFilename = filename;
			this.charset = charset;
			switching();
		}
		
		private void switchIfPossible() throws IOException {
			if(this.currentFilename != formatter.format(this.originalFilename, new Date()))
				switching();
		}
		
		private void switching() throws IOException {
			if(this.output != null)
				this.output.close();
			
			this.currentFilename = formatter.format(originalFilename, new Date());
			logger.info(String.format("scriptName: %s, file will be switched into: %s", ScriptThread.currentScriptName(), this.currentFilename));
			java.io.File file = new java.io.File(this.currentFilename);
			logger.debug(String.format("scriptName: %s, create file: %s", ScriptThread.currentScriptName(), this.currentFilename));
			file.createNewFile();
			this.output = new PrintWriter(file, this.charset);
		}
		
		public String getCurrentFilename() {
			return this.currentFilename;
		}
		
		public void append(String line) throws IOException {
			switchIfPossible();
			output.append(line);
			output.flush();
		}

		@Override
		public void close() throws WebServiceException {
			this.output.flush();
			this.output.close();
		}
	}
	
	class Formatter {
		private SimpleDateFormat yyyy = new SimpleDateFormat("yyyy");
		private SimpleDateFormat MM = new SimpleDateFormat("MM");
		private SimpleDateFormat dd = new SimpleDateFormat("dd");
		private SimpleDateFormat HH = new SimpleDateFormat("HH");
		private SimpleDateFormat mm = new SimpleDateFormat("mm");
		private SimpleDateFormat ss  = new SimpleDateFormat("ss");
		
		public String format(String str, Date date) {
			str = str.replace("yyyy", yyyy.format(date));
			str = str.replace("MM", MM.format(date));
			str = str.replace("dd", dd.format(date));
			str = str.replace("HH", HH.format(date));
			str = str.replace("mm", mm.format(date));
			str = str.replace("ss", ss.format(date));
			return str;
		}
	}
}