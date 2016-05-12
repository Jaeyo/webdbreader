package com.igloosec.scripter.exception;

public class ScripterException extends Exception {

	public ScripterException() {
		super();
	}

	public ScripterException(String message, Throwable cause) {
		super(message, cause);
	}

	public ScripterException(String message) {
		super(message);
	}

	public ScripterException(Throwable cause) {
		super(cause);
	}
} //class