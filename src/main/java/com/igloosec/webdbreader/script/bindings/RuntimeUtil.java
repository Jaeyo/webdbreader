package com.igloosec.webdbreader.script.bindings;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.commons.lang3.SystemUtils;

import com.igloosec.webdbreader.Version;

public class RuntimeUtil {
	private ScriptLogger logger;

	public RuntimeUtil(ScriptLogger logger) {
		this.logger = logger;
	} 
	
	public void sleep(long timeMillis){
		try {
			Thread.sleep(timeMillis);
		} catch (InterruptedException e) {
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
		} 
	} 
	
	public String exec(String cmd) throws IOException {
		if(SystemUtils.IS_OS_WINDOWS)
			cmd = "cmd /c " + cmd;
		Process process = Runtime.getRuntime().exec(cmd);
		
		StringBuilder result = new StringBuilder();
		BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
		String line = null;
		while((line = input.readLine()) != null) {
			result.append(line).append("\n");
		}
		return result.toString();
	}
	
	public void execAsync(String cmd) throws IOException {
		if(SystemUtils.IS_OS_WINDOWS)
			cmd = "cmd /c " + cmd;
		Process process = Runtime.getRuntime().exec(cmd);
	}

	public String getVersion(){
		return Version.getCurrentVersion();
	} 
} 