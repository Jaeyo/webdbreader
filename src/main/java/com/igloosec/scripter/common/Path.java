package com.igloosec.scripter.common;

import java.io.File;

public class Path{
	public static File getPackagePath() {
		String jarPath = Path.class.getProtectionDomain().getCodeSource().getLocation().getPath();
		File jarFile = new File(jarPath);
		File packagePath = jarFile.getParentFile();
		return packagePath;
	} // getPackagePath
} //class