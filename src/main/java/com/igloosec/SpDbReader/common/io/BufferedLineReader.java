package com.igloosec.SpDbReader.common.io;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;


public class BufferedLineReader extends LineReader{
	private BufferedReader input;
	
	public BufferedLineReader(Reader reader) {
		this.input = new BufferedReader(reader);
	} //INIT

	@Override
	public String readLine() throws IOException {
		return input.readLine();
	} //readLine

	@Override
	public void close() throws IOException {
		if(input != null)
			input.close();
	} //close
} //class