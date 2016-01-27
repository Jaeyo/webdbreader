package com.igloosec.scripter.script.bindings_pipe_OLD.pipe;

import java.util.List;

import com.google.common.collect.Lists;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.Pipe;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.PipeHead;

public class GroupPipe extends Pipe {
	private int count;
	private List<Object> list = Lists.newArrayList();

	public GroupPipe(PipeHead pipeHead, int count) {
		super(pipeHead);
		this.count = count;
	}
	
	@Override
	public void onNext(Object data) throws Exception {
		this.list.add(data);
		if(this.list.size() >= this.count) {
			next(this.list);
			this.list = Lists.newArrayList();
		}
	}

	@Override
	public void onComplete() throws Exception {
		next(this.list);
		this.list = Lists.newArrayList();
	}

	@Override
	public void onException(Exception e) {
	}
}