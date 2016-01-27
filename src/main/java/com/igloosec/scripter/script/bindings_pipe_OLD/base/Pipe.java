package com.igloosec.scripter.script.bindings_pipe_OLD.base;

import com.igloosec.scripter.script.ScriptThread;

public abstract class Pipe extends Pipeable {
	public Pipe(PipeHead pipeHead) {
		super(pipeHead);
	}
	
	public void run() {
		try {
			getPipeHead().run();
		} catch (Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
		}
	}
	
	public abstract void onNext(Object data) throws Exception;
	public abstract void onComplete() throws Exception;
	public abstract void onException(Exception e);
}