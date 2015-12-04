package com.igloosec.webdbreader.script.bindingsV2.headpipe;

import java.util.UUID;

import com.igloosec.webdbreader.script.bindingsV2.base.HeadPipe;

public class TestHeadPipe extends HeadPipe {
	private int count;

	public TestHeadPipe(int count) {
		this.count = count;
	}
	
	@Override
	public void run() {
		for (int i = 0; i < this.count; i++)
			next(UUID.randomUUID().toString());
		complete();
	}
}