package com.igloosec.SpDbReader.common.io;

import java.io.IOException;

public abstract class LineReader {
	public abstract String readLine() throws IOException;
	public abstract void close() throws IOException;
} //class