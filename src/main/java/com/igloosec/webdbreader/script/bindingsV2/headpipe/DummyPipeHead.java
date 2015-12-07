package com.igloosec.webdbreader.script.bindingsV2.headpipe;

import java.util.UUID;

import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class DummyPipeHead extends PipeHead {
	private int count;

	public DummyPipeHead(int count) {
		this.count = count;
	}
	
	@Override
	public void run() {
		for (int i = 0; i < this.count; i++)
			next(UUID.randomUUID().toString());
		complete();
	}
}