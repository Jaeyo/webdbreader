package com.igloosec.webdbreader.script.bindingsV2.base;

import java.io.IOException;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

import com.igloosec.scripter.script.ScriptExecutor;

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
			String script = "";
			script += "dummy(10)";
			script += ".group(3)";
			script += ".map(function(data) {";
			script += "data.add('asdfblablalbal---balbla');";
			script += "return data;";
			script += "})";
			script += ".print()";
			script += ".run();";
			executeScript(script);
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