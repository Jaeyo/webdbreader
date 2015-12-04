package com.igloosec.webdbreader.script.bindingsV1;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.commons.lang3.SystemUtils;

import com.igloosec.webdbreader.Version;
import com.igloosec.webdbreader.script.ScriptThread;

public class RuntimeUtil {
	private ScriptLogger logger = ScriptThread.currentThread().getLogger();

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