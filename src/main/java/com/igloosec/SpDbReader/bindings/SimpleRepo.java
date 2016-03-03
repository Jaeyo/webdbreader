package com.igloosec.SpDbReader.bindings;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Properties;

import org.apache.log4j.Logger;

import com.igloosec.scripter.common.Path;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;

public class SimpleRepo {
	private static final ScriptLogger logger = ScriptThread.currentLogger();

	private Properties props = new Properties();
	private File repoFile = null;

	public SimpleRepo(String scriptName) {
		File confPath=new File(Path.getPackagePath(), "conf");
		if(!confPath.exists())
			confPath.mkdirs();
		this.repoFile = new File(confPath, scriptName + ".simple_repo.properties");
		if (!repoFile.exists()) {
			try {
				repoFile.createNewFile();
			} catch (IOException e) {
				logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			} 
		} 

		try {
			props.load(new FileInputStream(repoFile));
		} catch (IOException e) {
			logger.error(String.format("failed to load simple_repo, %s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} 
	} 

	public void store(String key, String value) {
		props.setProperty(key, value);
		storeProps2File();
	} 

	public String load(String key) {
		return props.getProperty(key);
	} 

	public String load(String key, String defaultValue) {
		return props.getProperty(key, defaultValue);
	} 

	public void clear(){
		props.clear();
		storeProps2File();
	} 

	private void storeProps2File() {
		try {
			props.store(new FileOutputStream(repoFile), null);
		} catch (IOException e) {
			logger.error(String.format("failed to store simple_repo, %s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} 
	} 

	@Override
	public String toString() {
		StringWriter output = new StringWriter();
		try {
			props.store(output, null);
		} catch (IOException e) {
			logger.error(String.format("failed to convert simple_repo to string, %s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} 
		return output.toString();
	} 
} 