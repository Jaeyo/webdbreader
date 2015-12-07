package com.igloosec.webdbreader.script.bindingsV2.pipe;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.script.bindingsV2.base.Pipe;
import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class WriteTextFilePipe extends Pipe {
	private String filename = null;
	private String charset = null;
	private boolean dateFormat;
	
	private File file = null;
	private PrintWriter output = null;
	
	public WriteTextFilePipe(PipeHead pipeHead, String filename, String charset, boolean dateFormat) {
		super(pipeHead);
		this.filename = filename;
		this.charset = charset;
		this.dateFormat = dateFormat;

		try {
			if(this.dateFormat == true) {
				this.file = new File(dateFormat(this.filename));
			} else {
				this.file = new File(this.filename);
			}
			this.output = new PrintWriter(new OutputStreamWriter(new FileOutputStream(this.file), this.charset));
		} catch(Exception e) {
			this.onException(e);
		}
	}

	@Override
	public void onNext(Object data) {
		try {
			if(data instanceof List) {
				List<Object> list = (List<Object>) data;
				for(Object item: list)
					this.output.append(item.toString());
			} else {
				this.output.append(data.toString());
			}
		} catch (Exception e) {
			this.onException(e);
		} finally {
			next(data);
		}
	}

	@Override
	public void onComplete() {
		try {
			this.output.flush();
			this.output.close(); 
		} catch(Exception e) {
			this.onException(e);
		} finally {
			complete();
		}
	}

	@Override
	public void onException(Exception e) {
		WHERE TO Exception???
		String msg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
		ScriptThread.currentThread().getLogger().error(msg, e);
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
}