package com.igloosec.webdbreader.script.bindingsV2.pipe;

import java.util.List;

import com.google.common.collect.Lists;
import com.igloosec.webdbreader.script.bindingsV2.base.Pipe;
import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class GroupPipe extends Pipe {
	private int count;
	private List<Object> list = Lists.newArrayList();

	public GroupPipe(PipeHead pipeHead, int count) {
		super(pipeHead);
		this.count = count;
	}
	
	@Override
	public void onNext(Object data) {
		this.list.add(data);
		if(this.list.size() >= this.count) {
			next(this.list);
			this.list = Lists.newArrayList();
		}
	}

	@Override
	public void onComplete() {
		next(this.list);
		this.list = Lists.newArrayList();
		complete();
	}

	@Override
	public void onException(Exception e) {
		exception(e);
	}
}