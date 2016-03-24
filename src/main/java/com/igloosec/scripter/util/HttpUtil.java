package com.igloosec.scripter.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.commons.io.IOUtils;

public class HttpUtil {
	public static String get(String url) throws IOException {
		return request(url, "GET");
	}
	
	public static String post(String url) throws IOException {
		return request(url, "POST");
	}
	
	private static String request(String url, String method) throws IOException {
		HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
		conn.setRequestMethod(method);
		InputStream input = conn.getInputStream();
	
		try {
			return IOUtils.toString(input);
		} finally {
			input.close();
		}

	}
}