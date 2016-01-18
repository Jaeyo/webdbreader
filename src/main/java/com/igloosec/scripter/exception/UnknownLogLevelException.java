package com.igloosec.scripter.exception;

public class UnknownLogLevelException extends Exception {

	public UnknownLogLevelException() {
		super();
	}

	public UnknownLogLevelException(String message, Throwable cause) {
		super(message, cause);
	}

	public UnknownLogLevelException(String message) {
		super(message);
	}

	public UnknownLogLevelException(Throwable cause) {
		super(cause);
	}
}