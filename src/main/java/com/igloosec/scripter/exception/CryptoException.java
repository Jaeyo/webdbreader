package com.igloosec.scripter.exception;

public class CryptoException extends Exception{
	public CryptoException() {
		super();
	}

	public CryptoException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

	public CryptoException(String message, Throwable cause) {
		super(message, cause);
	}

	public CryptoException(String message) {
		super(message);
	}

	public CryptoException(Throwable cause) {
		super(cause);
	}
} //class