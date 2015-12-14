package com.igloosec.SpDbReader.bindings;

public class StringUtil {
	public String stringAt(String line, String delimiter, int index){
		if(line==null)
			return null;
		
		String[] splitedLine=line.split(delimiter);
		
		if(splitedLine.length <= index)
			return null;
		
		return splitedLine[index];
	} //stringAt
} //class