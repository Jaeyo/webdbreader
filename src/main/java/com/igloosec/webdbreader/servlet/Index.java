package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.util.servlet.HtmlHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class Index extends HtmlHttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(Index.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html; charset=UTF-8");
		
		String uri = req.getRequestURI();
		if(uri == null) uri = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			req.getRequestDispatcher("/html/index.html").forward(req, resp);
			
//			if(new UriTemplate("/").match(uri, pathParams)){
//				viewWithBundleJs(resp, "new.script.bundle.js");
//			} else if(new UriTemplate("/Script").match(uri, pathParams)){
//				viewWithBundleJs(resp, "new.script.bundle.js");
//			} else if(new UriTemplate("/Script/NewDb2File").match(uri, pathParams)){
//				viewWithBundleJs(resp, "new.newdb2file.bundle.js");
//			} else if(new UriTemplate("/Api").match(uri, pathParams)){
//				viewWithBundleJs(resp, "new.api.bundle.js");
//			} else {
//				viewWithBundleJs(resp, "404.bundle.js");
//			}
		} catch(IllegalArgumentException e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		} 
	} 
	
	private void viewWithBundleJs(HttpServletResponse resp, String bundleJs) throws IOException {
		resp.getWriter().print(html("index.html").replace("{bundle.js}", "/js/bundle/" + bundleJs));
		resp.getWriter().flush();
	} //viewWithBundleJS
	
	private void view(HttpServletResponse resp, String view) throws IOException {
		resp.getWriter().print(html(view));
		resp.getWriter().flush();
	} //view
} 