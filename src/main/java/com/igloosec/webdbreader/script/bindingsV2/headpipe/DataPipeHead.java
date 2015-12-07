package com.igloosec.webdbreader.script.bindingsV2.headpipe;

import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class DataPipeHead extends PipeHead{
	private Object data;
	
	public DataPipeHead(Object data) {
		this.data = data;
	}
	
	@Override
	public void run() {
		next(this.data);
		complete();
	}
}