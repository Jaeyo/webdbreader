package com.igloosec.webdbreader.script.bindingsV2.base;

public abstract class Pipe extends Pipeable {
	public Pipe(PipeHead pipeHead) {
		super(pipeHead);
	}
	
	public abstract void onNext(Object data);
	public abstract void onComplete();
	public abstract void onException(Exception e);
}