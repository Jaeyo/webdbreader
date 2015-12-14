package com.igloosec.SpDbReader.common.io;

import java.io.IOException;
import java.io.Reader;
import java.util.Scanner;


public class ScannerLineReader extends LineReader{
	private Scanner scanner;
	private String delimiter;
	
	public ScannerLineReader(String delimiter, Reader reader) {
		this.delimiter = delimiter;
		scanner = new Scanner(reader);
		scanner.useDelimiter(delimiter);
	} //INIT

	public String getDelimiter(){
		return delimiter;
	} //getDelimiter
	
	@Override
	public String readLine() throws IOException {
		if(scanner.hasNext() == false)
			return null;
		return scanner.next();
	} //readLine

	@Override
	public void close() throws IOException {
		if(scanner != null)
			scanner.close();
	} //close
} //class