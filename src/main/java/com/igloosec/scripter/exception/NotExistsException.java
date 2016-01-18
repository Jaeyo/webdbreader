package com.igloosec.scripter.exception;

public class NotExistsException extends Exception {

	public NotExistsException() {
		super();
	}

	public NotExistsException(String message, Throwable cause) {
		super(message, cause);
	}

	public NotExistsException(String message) {
		super(message);
	}

	public NotExistsException(Throwable cause) {
		super(cause);
	}

} // class