package com.igloosec.webdbreader.script.bindingsV2.base;

import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.script.bindingsV2.pipe.DBUpdatePipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.FirstPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.GroupPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.LogPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.MapPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.PrintPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.WriteTextFilePipe;

public class Pipeable {
	private Pipe nextPipe;
	private PipeHead pipeHead;
	
	public Pipeable(PipeHead pipeHead) {
		this.pipeHead = pipeHead;
	}
	
	protected void setNextPipe(Pipe pipe) {
		this.nextPipe = pipe;
	}
	
	protected Pipe getNextPipe() {
		return this.nextPipe;
	}
	
	protected void setPipeHead(PipeHead pipeHead) {
		this.pipeHead = pipeHead;
	}
	
	protected PipeHead getPipeHead() {
		return this.pipeHead;
	}
	
	protected void next(Object data) throws Exception {
		if(this.nextPipe != null)
			this.nextPipe.onNext(data);
	}
	
	public MapPipe map(Function callback) {
		try {
			MapPipe nextPipe = new MapPipe(this.pipeHead, callback);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
	
	public FirstPipe first(Function callback) {
		try {
			FirstPipe nextPipe = new FirstPipe(this.pipeHead, callback);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
	
	public GroupPipe group(int count) {
		try {
			GroupPipe nextPipe = new GroupPipe(this.pipeHead, count);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
	
	public WriteTextFilePipe writeTextFile(NativeObject args) {
		try {
			String filename = (String) args.get("filename");
			String charset = (String) args.get("charset");
			boolean dateFormat = (boolean) args.get("dateFormat");

			WriteTextFilePipe nextPipe = new WriteTextFilePipe(this.pipeHead, filename, charset, dateFormat);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
	
	public DBUpdatePipe dbUpdate(NativeObject args) {
		try {
			String driver = (String) args.get("driver");
			String connUrl = (String) args.get("connUrl");
			String username = (String) args.get("username");
			String password = (String) args.get("password");

			DBUpdatePipe nextPipe = new DBUpdatePipe(this.pipeHead, driver, connUrl, username, password);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
	
	public PrintPipe print() {
		try {
			PrintPipe nextPipe = new PrintPipe(this.pipeHead);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
	
	public LogPipe log(String logLevel) {
		try {
			LogPipe nextPipe = new LogPipe(pipeHead, logLevel);
			setNextPipe(nextPipe);
			return nextPipe;
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			return null;
		}
	}
}
