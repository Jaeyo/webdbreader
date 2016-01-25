package com.igloosec.scripter.util;

import static org.junit.Assert.assertEquals;

import org.apache.commons.collections.MapIterator;
import org.apache.commons.collections.keyvalue.MultiKey;
import org.apache.commons.collections.map.MultiKeyMap;
import org.junit.Test;

public class UtilTest {

	@Test
	public void test_extract_and_remove_number() {
		assertEquals(Util.extractNumber("ab1a"), "1");
		assertEquals(Util.extractNumber("1a  23"), "123");
		assertEquals(Util.removeNumber("aba"), "aba");
		assertEquals(Util.removeNumber("1a  23"), "a  ");
	}
}