package com.igloosec.webdbreader.script.bindingsV2.base;

public abstract class PipeHead extends Pipeable {
	public PipeHead() {
		super(null);
		setPipeHead(this);
	}

	public abstract void run();
}