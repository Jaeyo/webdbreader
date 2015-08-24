package com.igloosec.webdbreader.exception;

public class VersionException extends Exception {

	public VersionException() {
		super();
	}

	public VersionException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

	public VersionException(String message, Throwable cause) {
		super(message, cause);
	}

	public VersionException(String message) {
		super(message);
	}

	public VersionException(Throwable cause) {
		super(cause);
	}
} // class