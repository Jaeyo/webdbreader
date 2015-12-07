package com.igloosec.webdbreader.script.bindingsV2.base;

import java.io.IOException;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

import com.igloosec.webdbreader.script.ScriptExecutor;

public class PipeTest {

	@Test
	public void test_dummy_print() {
		try {
			executeScript(" dummy(10).print().run(); ");
		} catch (Exception e) {
			e.printStackTrace();
			Assert.fail();
		}
	}
	
	@Test
	public void test_dummy_group_print() {
		try {
			executeScript(" dummy(10).group(3).print().run(); ");
		} catch(Exception e) {
			e.printStackTrace();
			Assert.fail();
		}
	}
	
	@Test
	public void test_dummy_group_map_print() {
		try {
			executeScript(" dummy(10).map(function(data) { return data + 'zzz'; }).group(4).print().run(); ");
		} catch(Exception e) {
			e.printStackTrace();
			Assert.fail();
		}
	}
	
	private void executeScript(String script) throws IOException, ScriptException {
		ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
		String middleLayerJs = IOUtils.toString(ScriptExecutor.class.getClassLoader().getResourceAsStream("resource/scripts/middle-layer.js"));
		scriptEngine.eval(middleLayerJs);
		scriptEngine.eval(script);
	}
}