package com.igloosec.scripter.exception;

public class AlreadyExistsException extends Exception {

	public AlreadyExistsException() {
		super();
	}

	public AlreadyExistsException(String message, Throwable cause) {
		super(message, cause);
	}

	public AlreadyExistsException(String message) {
		super(message);
	}

	public AlreadyExistsException(Throwable cause) {
		super(cause);
	}
} //class