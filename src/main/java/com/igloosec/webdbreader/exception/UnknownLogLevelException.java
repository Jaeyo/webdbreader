package com.igloosec.webdbreader.exception;

public class UnknownLogLevelException extends Exception {

	public UnknownLogLevelException() {
		super();
	}

	public UnknownLogLevelException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
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
