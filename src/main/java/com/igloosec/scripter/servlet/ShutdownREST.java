package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.uri.UriTemplate;

public class ShutdownREST extends HttpServlet {
	public static final String SHUTDOWN_KEY = "547c64cd-56a8-46e1-b269-e939acae354b";
	private static final Logger logger = LoggerFactory.getLogger(ShutdownREST.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/").match(pathInfo, pathParams)){
				String shutdownKey = req.getParameter("shutdownKey");
				if(SHUTDOWN_KEY.equals(shutdownKey)) {
					resp.getWriter().print(new JSONObject().put("success", 1).put("msg", "scripter start to shutdown").toString());
					resp.getWriter().flush();
					
					new Thread(){
						@Override
						public void run() {
							try{
								Thread.sleep(3000);
							} catch(Exception e) {
								e.printStackTrace();
							}
							logger.info("WebDbReader shutdown");
							System.exit(0);	
						}
					}.start();
					
				}
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			}
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			if(e.getClass().equals(IllegalArgumentException.class)) logger.error(errmsg);
			else logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		}
	}
}