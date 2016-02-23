package com.igloosec.SpDbReader.bindings;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;

import org.apache.log4j.Logger;

import com.igloosec.SpDbReader.OutputFileLastModified;

public class FileExporter {
	private static final Logger logger = Logger.getLogger(FileExporter.class);

	public void write(String filename, String content) {
		write(filename, content, null);
	} // write
	
	public void write(String filename, String content, String charsetName){
		if(content==null)
			return;
		
		File exportFile = new File(filename);

		try {
			if(exportFile.getParentFile()!=null && !exportFile.getParentFile().exists())
				exportFile.getParentFile().mkdirs();
			if (!exportFile.exists())
				exportFile.createNewFile();

			Charset charset=null;
			if(charsetName==null)
				charset=Charset.defaultCharset();
			else
				charset=Charset.forName(charsetName);
			
			PrintWriter output = new PrintWriter(new OutputStreamWriter(new FileOutputStream(exportFile, false), charset));
			output.println(content);
			output.flush();
			output.close();
			OutputFileLastModified.getInstance().pushLastModifiedTime(exportFile.getAbsolutePath(), System.currentTimeMillis());
		} catch (IOException e) {
			logger.error("", e);
		} // catch
	} //write
	
	public void append(String filename, String content){
		append(filename, content, null);
	} //append

	public void append(String filename, String content, String charsetName){
		if(content==null)
			return;
		
		File exportFile = new File(filename);

		try {
			if(exportFile.getParentFile()!=null && !exportFile.getParentFile().exists())
				exportFile.getParentFile().mkdirs();
			if (!exportFile.exists())
				exportFile.createNewFile();

			Charset charset=null;
			if(charsetName==null)
				charset=Charset.defaultCharset();
			else
				charset=Charset.forName(charsetName);
			
			PrintWriter output = new PrintWriter(new OutputStreamWriter( new FileOutputStream(exportFile, true), charset));
			output.append(content);
			output.flush();
			output.close();
			OutputFileLastModified.getInstance().pushLastModifiedTime(exportFile.getAbsolutePath(), System.currentTimeMillis());
		} catch (IOException e) {
			logger.error("", e);
		} // catch
	} //append
	
	public void createFile(String filename) {
		File file = new File(filename);
		if (!file.exists()) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				logger.error("", e);
			} // catch
		} // if
	} // createFile
} // class