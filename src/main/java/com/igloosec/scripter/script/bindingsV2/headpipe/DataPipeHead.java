package com.igloosec.scripter.script.bindingsV2.headpipe;

import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.script.bindingsV2.base.PipeHead;

public class DataPipeHead extends PipeHead {
	private Object data;
	
	public DataPipeHead(Object data) {
		this.data = data;
	}
	
	@Override
	public void run() {
		try {
			next(this.data);
		} catch(Exception e) {
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			ScriptThread.currentThread().getLogger().error(errmsg, e);
			exception(e);
		} finally {
			try {
				complete();
			} catch (Exception e) {
				String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
				ScriptThread.currentThread().getLogger().error(errmsg, e);
				exception(e);
			}
		}
	}
}