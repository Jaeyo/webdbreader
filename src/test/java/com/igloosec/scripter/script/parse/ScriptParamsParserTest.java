package com.igloosec.scripter.script.parse;

import static org.junit.Assert.*;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.junit.Test;

public class ScriptParamsParserTest {

	@Test
	public void test() throws Exception {
		assertEquals("1 * 24 * 60 * 60 * 1000", ScriptParamsParser.makeReadablePeriod(1 * 24 * 60 * 60 * 1000));
		assertEquals("1 * 60 * 60 * 1000", ScriptParamsParser.makeReadablePeriod(1 * 60 * 60 * 1000));
		assertEquals("1 * 60 * 1000", ScriptParamsParser.makeReadablePeriod(1 * 60 * 1000));
		assertEquals("1 * 1000", ScriptParamsParser.makeReadablePeriod(1 * 1000));
		
		assertEquals("4 * 24 * 60 * 60 * 1000", ScriptParamsParser.makeReadablePeriod(4 * 24 * 60 * 60 * 1000));
		assertEquals("8 * 60 * 60 * 1000", ScriptParamsParser.makeReadablePeriod(8 * 60 * 60 * 1000));
		assertEquals("3 * 60 * 1000", ScriptParamsParser.makeReadablePeriod(3 * 60 * 1000));
		assertEquals("9 * 1000", ScriptParamsParser.makeReadablePeriod(9 * 1000));
	}
}