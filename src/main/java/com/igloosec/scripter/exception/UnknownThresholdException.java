package com.igloosec.scripter.exception;

public class UnknownThresholdException extends Exception {
	public UnknownThresholdException() {
		super();
	}

	public UnknownThresholdException(String message, Throwable cause) {
		super(message, cause);
	}

	public UnknownThresholdException(String message) {
		super(message);
	}

	public UnknownThresholdException(Throwable cause) {
		super(cause);
	}
}