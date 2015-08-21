package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.ScriptService;
import com.igloosec.webdbreader.util.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class Script extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(Script.class);
	private ScriptService scriptService = SingletonInstanceRepo.getInstance(ScriptService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();

		try{
			if(new UriTemplate("/Script/Info/").match(pathInfo, pathParams)){
				resp.getWriter().print(getScriptInfo(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(jade("error.jade", null));
				resp.getWriter().flush();
			} //if
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			resp.getWriter().print(jade("error.jade", null));
			resp.getWriter().flush();
		} //catch
	} //doGet

	private String getScriptInfo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		JSONArray scripts = scriptService.getScriptInfo();
		return new JSONObject().put("success", 1).put("scriptInfos", scripts).toString();	
	} //getScriptInfo
} //class