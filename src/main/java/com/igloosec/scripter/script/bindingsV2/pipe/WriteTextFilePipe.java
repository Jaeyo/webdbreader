package com.igloosec.scripter.script.bindingsV2.pipe;

import java.io.Closeable;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.script.bindingsV2.base.Pipe;
import com.igloosec.scripter.script.bindingsV2.base.PipeHead;
import com.igloosec.scripter.service.FileOutMsgService;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class WriteTextFilePipe extends Pipe implements Closeable {
	private static ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private FileOutMsgService fileOutMsgService = SingletonInstanceRepo.getInstance(FileOutMsgService.class);
	
	private String filename = null;
	private String charset = null;
	private boolean dateFormat;
	
	private File file = null;
	private PrintWriter output = null;
	
	private String scriptName = ScriptThread.currentThread().getScriptName();
	
	public WriteTextFilePipe(PipeHead pipeHead, String filename, String charset, boolean dateFormat) {
		super(pipeHead);
		this.filename = filename;
		this.charset = charset;
		this.dateFormat = dateFormat;

		ScriptThread.currentThread().newCloseable(this);
		
		try {
			if(this.dateFormat == true) {
				this.file = new File(dateFormat(this.filename));
			} else {
				this.file = new File(this.filename);
			}
			this.output = new PrintWriter(new OutputStreamWriter(new FileOutputStream(this.file, true), this.charset));
		} catch(Exception e) {
			this.onException(e);
		}
	}

	@Override
	public void onNext(Object data) throws Exception {
		try {
			if(data instanceof List) {
				List<Object> list = (List<Object>) data;
				for(Object item: list) {
					this.output.append(item.toString());
					fileOutMsgService.dispatchMsg(this.scriptName, this.filename, System.currentTimeMillis(), item.toString());
				}
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.FILE_WRITE, list.size());
			} else {
				this.output.append(data.toString());
				fileOutMsgService.dispatchMsg(this.scriptName, this.filename, System.currentTimeMillis(), data.toString());
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.FILE_WRITE);
			}
			this.output.flush();
		} catch (Exception e) {
			this.onException(e);
		} finally {
			next(data);
		}
	}

	@Override
	public void onComplete() throws Exception {
		try {
			this.close();
		} catch(Exception e) {
			this.onException(e);
		} finally {
		}
	}

	@Override
	public void onException(Exception e) {
	}
	
	private String dateFormat(String str) {
		if(str.contains("$yyyy")) str = str.replace("$yyyy", new SimpleDateFormat("yyyy").format(new Date()));
		if(str.contains("$mm")) str = str.replace("$mm", new SimpleDateFormat("MM").format(new Date()));
		if(str.contains("$dd")) str = str.replace("$dd", new SimpleDateFormat("dd").format(new Date()));
		if(str.contains("$hh")) str = str.replace("$hh", new SimpleDateFormat("HH").format(new Date()));
		if(str.contains("$mi")) str = str.replace("$mi", new SimpleDateFormat("mm").format(new Date()));
		if(str.contains("$ss")) str = str.replace("$ss", new SimpleDateFormat("ss").format(new Date()));
		return str;
	}

	@Override
	public void close() throws IOException {
		this.output.flush();
		this.output.close();
	}
}