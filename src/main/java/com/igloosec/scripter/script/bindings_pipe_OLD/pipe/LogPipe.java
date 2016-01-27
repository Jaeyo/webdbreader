package com.igloosec.scripter.script.bindings_pipe_OLD.pipe;

import com.igloosec.scripter.exception.UnknownLogLevelException;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.Pipe;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.PipeHead;

public class LogPipe extends Pipe {
	private String logLevel = null;

	public LogPipe(PipeHead pipeHead, String logLevel) {
		super(pipeHead);
		this.logLevel = logLevel;
	}

	@Override
	public void onNext(Object data) throws Exception {
		if (logLevel.equalsIgnoreCase("info")) {
			ScriptThread.currentThread().getLogger().info(data.toString());
		} else if (logLevel.equalsIgnoreCase("debug")) {
			ScriptThread.currentThread().getLogger().debug(data.toString());
		} else if (logLevel.equalsIgnoreCase("warn")) {
			ScriptThread.currentThread().getLogger().warn(data.toString());
		} else if (logLevel.equalsIgnoreCase("error")) {
			ScriptThread.currentThread().getLogger().error(data.toString());
		} else {
			this.onException(new UnknownLogLevelException(data.toString()));
		}
		next(data);
	}

	@Override
	public void onComplete() {
	}

	@Override
	public void onException(Exception e) {
	}
}