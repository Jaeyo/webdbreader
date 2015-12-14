package com.igloosec.scripter.script.bindingsV2.base;

public abstract class PipeHead extends Pipeable {
	public PipeHead() {
		super(null);
		setPipeHead(this);
	}

	protected void complete() throws Exception {
		Pipe pipe = getNextPipe();
		
		while(pipe != null) {
			pipe.onComplete();
			pipe = pipe.getNextPipe();
		}
	}
	
	protected void exception(Exception e) {
		Pipe pipe = getNextPipe();
		
		while(pipe != null) {
			pipe = pipe.getNextPipe();
		}
	}
	
	public abstract void run() throws Exception;
}