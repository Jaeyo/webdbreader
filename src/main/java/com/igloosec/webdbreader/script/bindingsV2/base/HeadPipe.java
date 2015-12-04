package com.igloosec.webdbreader.script.bindingsV2.base;

public abstract class HeadPipe extends Pipeable {
	public HeadPipe() {
		super(null);
	}

	public abstract void run();
}