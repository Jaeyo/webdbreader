package com.igloosec.webdbreader.util.servlet;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;

import org.apache.commons.io.IOUtils;

import com.google.common.collect.Maps;
import com.igloosec.webdbreader.Server;

public class HtmlHttpServlet extends HttpServlet{
	private static Map<String, String> views = Maps.newHashMap();
	
	protected String html(String view) throws IOException {
		String html = views.get(view);
		if(html == null) {
			html = IOUtils.toString(Server.class.getClassLoader().getResourceAsStream("resource/html/" + view));
			views.put(view, html);
		}
		return html;
	}
} 