package com.igloosec.webdbreader.script.bindingsV2.pipe;

import java.util.List;

import com.google.common.collect.Lists;
import com.igloosec.webdbreader.script.bindingsV2.base.HeadPipe;
import com.igloosec.webdbreader.script.bindingsV2.base.Pipe;

public class GroupPipe extends Pipe {
	private int count;
	private List<Object> list = Lists.newArrayList();

	public GroupPipe(HeadPipe headPipe, int count) {
		super(headPipe);
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
		complete();
	}

	@Override
	public void onException(Exception e) {
		exception(e);
	}
}