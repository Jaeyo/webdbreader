package com.igloosec.scripter.exception;

public class ScriptNotParsableException extends Exception {
	public ScriptNotParsableException() {
		super();
	}

	public ScriptNotParsableException(String message, Throwable cause) {
		super(message, cause);
	}

	public ScriptNotParsableException(String message) {
		super(message);
	}

	public ScriptNotParsableException(Throwable cause) {
		super(cause);
	}
}