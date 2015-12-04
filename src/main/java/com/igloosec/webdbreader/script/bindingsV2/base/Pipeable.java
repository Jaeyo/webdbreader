package com.igloosec.webdbreader.script.bindingsV2.base;

import sun.org.mozilla.javascript.internal.Function;

import com.igloosec.webdbreader.script.bindingsV2.pipe.GroupPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.MapPipe;
import com.igloosec.webdbreader.script.bindingsV2.pipe.PrintPipe;

public class Pipeable {
	private Pipe nextPipe;
	private HeadPipe headPipe;
	
	public Pipeable(HeadPipe headPipe) {
		this.headPipe = headPipe;
	}
	
	protected void setNextPipe(Pipe pipe) {
		this.nextPipe = pipe;
	}
	
	protected void next(Object data) {
		if(this.nextPipe != null)
			this.nextPipe.onNext(data);
	}
	
	protected void complete() {
		if(this.nextPipe != null)
			this.nextPipe.onComplete();
	}
	
	protected void exception(Exception e) {
		if(this.nextPipe != null)
			this.nextPipe.onException(e);
	}
	
	public MapPipe map(Function callback) {
		MapPipe nextPipe = new MapPipe(this.headPipe, callback);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public GroupPipe group(int count) {
		GroupPipe nextPipe = new GroupPipe(this.headPipe, count);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public PrintPipe print() {
		PrintPipe nextPipe = new PrintPipe(this.headPipe);
		setNextPipe(nextPipe);
		return nextPipe;
	}
	
	public void run() {
		this.headPipe.run();
	}
}
