package com.igloosec.webdbreader.script.bindingsV2.base;

import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.NativeObject;

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
	
	protected void next(Object data) {
		if(this.nextPipe != null)
			this.nextPipe.onNext(data);
	}
	
	public MapPipe map(Function callback) {
		MapPipe nextPipe = new MapPipe(this.pipeHead, callback);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public GroupPipe group(int count) {
		GroupPipe nextPipe = new GroupPipe(this.pipeHead, count);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public WriteTextFilePipe writeTextFile(NativeObject args) {
		String filename = (String) args.get("filename");
		String charset = (String) args.get("charset");
		boolean dateFormat = (boolean) args.get("dateFormat");
		
		WriteTextFilePipe nextPipe = new WriteTextFilePipe(this.pipeHead, filename, charset, dateFormat);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public PrintPipe print() {
		PrintPipe nextPipe = new PrintPipe(this.pipeHead);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public LogPipe log(String logLevel) {
		LogPipe nextPipe = new LogPipe(pipeHead, logLevel);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public void run() {
		this.pipeHead.run();
	}
}
