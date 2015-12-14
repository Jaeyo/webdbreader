package com.igloosec.scripter.exception;

public class AlreadyStartedException extends Exception {

	public AlreadyStartedException() {
		super();
	}

	public AlreadyStartedException(String message, Throwable cause) {
		super(message, cause);
	}

	public AlreadyStartedException(String message) {
		super(message);
	}

	public AlreadyStartedException(Throwable cause) {
		super(cause);
	}
	
}