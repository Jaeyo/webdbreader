package com.igloosec.webdbreader.script.bindings;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Properties;

import com.igloosec.webdbreader.common.Path;

public class SimpleRepo {
	private ScriptLogger logger;

	public SimpleRepo(ScriptLogger logger) {
		this.logger = logger;
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
} // class