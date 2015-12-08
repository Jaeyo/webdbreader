package com.igloosec.webdbreader.script.bindingsV2.pipe;

import sun.org.mozilla.javascript.internal.Context;
import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.Scriptable;
import sun.org.mozilla.javascript.internal.ScriptableObject;

import com.igloosec.webdbreader.script.bindingsV2.base.Pipe;
import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class MapPipe extends Pipe {

	private Function callback;
	
	public MapPipe(PipeHead headPipe, Function callback) {
		super(headPipe);
		this.callback = callback;
	}

	@Override
	public void onNext(Object data) throws Exception {
		Context context = Context.enter();
		ScriptableObject scope = context.initStandardObjects();
		Scriptable that = context.newObject(scope);
		data = this.callback.call(context, that, scope, new Object[]{ data });
		next(data);
	}

	

	@Override
	public void onComplete() throws Exception {
	}
	
	@Override
	public void onException(Exception e) {
	}
}
