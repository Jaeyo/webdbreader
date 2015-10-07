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

import com.google.common.base.Preconditions;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.NotExistsException;
import com.igloosec.webdbreader.service.ConfigService;
import com.igloosec.webdbreader.util.jade.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class ConfigREST extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(ConfigREST.class);
	private ConfigService configService = SingletonInstanceRepo.getInstance(ConfigService.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/").match(pathInfo, pathParams)){
				resp.getWriter().print(getConfig(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/AutoStartScript/").match(pathInfo, pathParams)){
				resp.getWriter().print(getAutoStartScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			} 
		} catch(IllegalArgumentException e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} 
	} 

	private String getConfig(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		return new JSONObject().put("success", 1).put("configs", configService.load()).toString();
	} 
	
	private String getAutoStartScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		return new JSONObject().put("success", 1).put("scripts", configService.loadAutoStartScript()).toString();
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/").match(pathInfo, pathParams)){
				resp.getWriter().print(postConfig(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/AutoStartScript/").match(pathInfo, pathParams)){
				resp.getWriter().print(postAutoStartScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			} 
		} catch(IllegalArgumentException e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} 
	} 
	
	private String postConfig(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String jsonParamStr = req.getParameter("jsonParam");
		
		Preconditions.checkArgument(jsonParamStr != null, "jsonParam is null");
		
		JSONArray jsonParams = new JSONArray(jsonParamStr);
		
		for (int i = 0; i < jsonParams.length(); i++) {
			JSONObject jsonParam = jsonParams.getJSONObject(i);
			String configKey = jsonParam.getString("configKey");
			String configValue = jsonParam.getString("configValue");
			
			Preconditions.checkArgument(configKey != null, "configKey is null");
			Preconditions.checkArgument(configValue != null, "configValue is null");
			
			configService.save(configKey, configValue);
		} 
		
		return new JSONObject().put("success", 1).toString();
	} 
	
	private String postAutoStartScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotExistsException{
		String scriptName = req.getParameter("scriptName");
		
		configService.addAutoStartScript(scriptName);
		
		return new JSONObject().put("success", 1).toString();
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/AutoStartScript/{scriptName}/").match(pathInfo, pathParams)){
				resp.getWriter().print(removeAutoStartScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			} 
		} catch(IllegalArgumentException e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} 
	}
	
	private String removeAutoStartScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		String scriptName = pathParams.get("scriptName");
		
		configService.removeAutoStartScript(scriptName);
		
		return new JSONObject().put("success", 1).toString();
	}
} 