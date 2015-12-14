package com.igloosec.scripter;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import com.igloosec.scripter.common.Conf;
import com.igloosec.scripter.servlet.ShutdownREST;


public class Shutdown {
	public static void main(String[] args) throws IOException {
		String url = String.format("http://localhost:%s/REST/Shutdown/?shutdownKey=%s", Conf.getAs(Conf.PORT, 8098), ShutdownREST.SHUTDOWN_KEY);
		URL urlObj = new URL(url);
		HttpURLConnection conn = (HttpURLConnection) urlObj.openConnection();
		conn.setRequestMethod("GET");
		int respCode = conn.getResponseCode();
		System.out.println(String.format("shutdown request sent, resp code: %s", respCode));
	} // main
} // class