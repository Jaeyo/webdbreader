package com.igloosec.scripter;

import java.io.IOException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;

import com.igloosec.scripter.common.Conf;
import com.igloosec.scripter.servlet.ShutdownREST;


public class Shutdown {
	public static void main(String[] args) throws IOException {
		shutdown();
	}

	static void shutdown() throws IOException {
		String url = String.format("http://localhost:%s/REST/Shutdown/?shutdownKey=%s", Conf.getAs(Conf.PORT, 8098), ShutdownREST.SHUTDOWN_KEY);
		
		GetMethod getMethod = new GetMethod(url);
		new HttpClient().executeMethod(getMethod);
		
		int respCode = getMethod.getStatusCode();
		System.out.println(String.format("shutdown request sent, resp code: %s", respCode));
	}
}