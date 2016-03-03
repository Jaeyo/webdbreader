package com.igloosec.scripter;

import static org.junit.Assert.*;

import org.junit.Test;

public class VersionTest {

	@Test
	public void test() {
		assertTrue(Version.isANewerThanB("2.0.0", "2.0.0") == false);
		assertTrue(Version.isANewerThanB("4.0.2.4a", "4.0.2.4") == true);
		assertTrue(Version.isANewerThanB("4.0.3.4a", "4.0.2.4") == true);
		assertTrue(Version.isANewerThanB("4.0.2.4a", "4.0.3.4") == false);
		assertTrue(Version.isANewerThanB("4.0.2.4a", "4.0.2") == true);
		assertTrue(Version.isANewerThanB("4.0.2.4a", "4.0.3") == false);
		assertTrue(Version.isANewerThanB("4.0.2.4a", "5") == false);
		assertTrue(Version.isANewerThanB("4.0.2.4a", "4.2.a") == false);
	}
}