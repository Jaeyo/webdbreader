package com.igloosec.scripter;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.SystemUtils;
import org.apache.log4j.Logger;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.common.Conf;
import com.igloosec.scripter.common.Path;

public class Bootstrap {
	private static final Logger logger = Logger.getLogger(Bootstrap.class);

	public static void main(String[] args) {
		try{
			// check jdk type
			if (com.igloosec.scripter.common.Conf.isOpenJdk()) {
				System.err.println("ERR: OpenJDK not allowed, use another jdk");
				System.exit(-1);
			} 

			startup(args);
		} catch(Exception e){
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} 
	} 

	static void startup(String[] args) throws IOException {
		String classPathSeparator = SystemUtils.IS_OS_WINDOWS ? ";" : ":";

		String classPath = new File(Path.getPackagePath(), "scripter.jar").getAbsolutePath();
		classPath += classPathSeparator;
		classPath += Path.getPackagePath().getAbsolutePath() + File.separator + "libs" + File.separator + "*";

		String mainClass = Server.class.getName();

		bootstrapJar(classPath, mainClass, args);
	}

	static void bootstrapJar(String classPath, String mainClass, String... args) throws IOException {
		logger.info("start to bootstrap jar " + mainClass);

		String javaHome = System.getProperty("path.to.java");
		Preconditions.checkNotNull(javaHome, "path.to.java not set");

		String javaExe = new File(javaHome, SystemUtils.IS_OS_WINDOWS ? "bin\\javaw.exe" : "bin/java").getAbsolutePath();

		List<String> cmd = new ArrayList<String>();
		if(SystemUtils.IS_OS_WINDOWS){
			cmd.add("cmd");
			cmd.add("/C");
		} 
		cmd.add(javaExe);
		cmd.add("-Dfile.encoding=UTF-8");
		cmd.add("-Dport=" + Conf.get(Conf.PORT));
		cmd.add("-Djetty.thread.pool.size=" + Conf.get(Conf.JETTY_THREAD_POOL_SIZE));
		cmd.add("-Dscript.auto.start=" + Conf.get(Conf.SCRIPT_AUTO_START));
		cmd.add("-cp");
		cmd.add(classPath);
		cmd.add(mainClass);
		if(args != null && args.length != 0){
			for(String arg : args)
				cmd.add(arg);
		} 

		logger.info("cmd : " + cmd.toString());

		ProcessBuilder builder = new ProcessBuilder(cmd);
		final Process p = builder.start();
		Thread processInputConsumerThread = new Thread() {
			@Override
			public void run() {
				BufferedReader input = new BufferedReader(new InputStreamReader(p.getInputStream()));
				String line = null;
				try {
					while((line = input.readLine()) != null) {}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		};
		processInputConsumerThread.start();

		logger.info(mainClass + " success to bootstrap");
	} 
} 