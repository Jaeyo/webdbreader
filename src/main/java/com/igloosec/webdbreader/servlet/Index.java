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
			if(new UriTemplate("/").match(uri, pathParams)){
				view(resp, "script.html");
			} else {
				view(resp, "404.html");
			}
			
//			if(new UriTemplate("/").match(uri, pathParams)){
//				resp.getWriter().print(jade("index.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Config/").match(uri, pathParams)){
//				resp.getWriter().print(jade("config.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/ApiDoc/").match(uri, pathParams)){
//				resp.getWriter().print(jade("api.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/NewDb2File/").match(uri, pathParams)){
//				resp.getWriter().print(jade("new-db2file.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/NewDb2Db/").match(uri, pathParams)){
//				resp.getWriter().print(jade("new-db2db.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/View/{title}/").match(uri, pathParams)){
//				resp.getWriter().print(jade("view-script.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/Edit/{title}/").match(uri, pathParams)){
//				resp.getWriter().print(jade("edit-script.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/EditNew/").match(uri, pathParams)){
//				resp.getWriter().print(jade("new-script.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/Edit/").match(uri, pathParams)){
//				resp.getWriter().print(jade("edit-script.jade", null));
//				resp.getWriter().flush();
//			} else if(new UriTemplate("/Script/TailFileOut/{title}/").match(uri, pathParams)){
//				resp.getWriter().print(jade("tail-fileout.jade", null));
//				resp.getWriter().flush();
//			} else{
//				resp.getWriter().print(jade("error.jade", null));
//				resp.getWriter().flush();
//			} 
		} catch(IllegalArgumentException e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
//			resp.getWriter().print(jade("error.jade", null));
//			resp.getWriter().flush();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
//			resp.getWriter().print(jade("error.jade", null));
//			resp.getWriter().flush();
		} 
	} 
	
	private void view(HttpServletResponse resp, String view) throws IOException {
		resp.getWriter().print(html(view));
		resp.getWriter().flush();
	} //view
} 