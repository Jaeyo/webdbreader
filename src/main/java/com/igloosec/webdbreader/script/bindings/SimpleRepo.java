package com.igloosec.webdbreader.script.bindings;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.Path;

public class SimpleRepo {
	private static final Logger logger = LoggerFactory.getLogger(SimpleRepo.class);

	private Properties props = new Properties();
	private File repoFile = null;

	public SimpleRepo() {
		File confPath=new File(Path.getPackagePath(), "conf");
		if(!confPath.exists())
			confPath.mkdirs();
		this.repoFile = new File(confPath, "simple_repo.properties");
		if (!repoFile.exists()) {
			try {
				repoFile.createNewFile();
			} catch (IOException e) {
				logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			} // catch
		} // if

		try {
			props.load(new FileInputStream(repoFile));
		} catch (IOException e) {
			logger.error(String.format("failed to load simple_repo, %s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} // catch
	} // INIT

	public void store(String key, String value) {
		props.setProperty(key, value);
		storeProps2File();
	} // store

	public String load(String key) {
		return props.getProperty(key);
	} // load

	public String load(String key, String defaultValue) {
		return props.getProperty(key, defaultValue);
	} // load

	public void clear(){
		props.clear();
		storeProps2File();
	} //clear

	private void storeProps2File() {
		try {
			props.store(new FileOutputStream(repoFile), null);
		} catch (IOException e) {
			logger.error(String.format("failed to store simple_repo, %s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} // catch
	} // storeProps2File

	@Override
	public String toString() {
		StringWriter output = new StringWriter();
		try {
			props.store(output, null);
		} catch (IOException e) {
			logger.error(String.format("failed to convert simple_repo to string, %s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} // catch
		return output.toString();
	} // toString
} // class