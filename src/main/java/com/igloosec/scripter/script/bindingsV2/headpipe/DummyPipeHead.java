package com.igloosec.scripter.script.bindingsV2.headpipe;

import java.util.UUID;

import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.script.bindingsV2.base.PipeHead;

public class DummyPipeHead extends PipeHead {
	private int count;

	public DummyPipeHead(int count) {
		this.count = count;
	}

	@Override
	public void run() {
		try {
			for (int i = 0; i < this.count; i++)
				next(UUID.randomUUID().toString());
		} catch (Exception e) {
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