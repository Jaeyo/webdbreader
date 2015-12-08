package com.igloosec.webdbreader.script.bindingsV2.pipe;

import java.util.List;

import com.igloosec.webdbreader.script.bindingsV2.base.Pipe;
import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class PrintPipe extends Pipe {

	public PrintPipe(PipeHead pipeHead) {
		super(pipeHead);
	}

	@Override
	public void onNext(Object data) {
		if(data instanceof List) {
			List<Object> list = (List<Object>) data;
			for(Object item: list)
				System.out.println(item.toString());
		} else {
			System.out.println(data.toString());
		}
		next(data);
	}

	@Override
	public void onComplete() {
	}

	@Override
	public void onException(Exception e) {
	}
}