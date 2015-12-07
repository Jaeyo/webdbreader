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
		System.out.println("next");
		if(data.getClass().equals(List.class)) {
			List<Object> list = (List<Object>) data;
			for(Object item: list)
				System.out.println(item.toString());
		} else {
			System.out.println(data.toString());
		}
	}

	@Override
	public void onComplete() {
		System.out.println("complete");
	}

	@Override
	public void onException(Exception e) {
		System.out.println("exception, " + e.toString());
	}
}