package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.SimpleRepoDAO;
import com.igloosec.scripter.service.ConfigService;
import com.sun.jersey.api.uri.UriTemplate;

public class ConfigREST extends HttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(ConfigREST.class);
	private ConfigService configService = SingletonInstanceRepo.getInstance(ConfigService.class);
	private SimpleRepoDAO simpleRepoDAO = SingletonInstanceRepo.getInstance(SimpleRepoDAO.class);
	
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
			} else if(new UriTemplate("/SimpleRepo/").match(pathInfo, pathParams)){
				resp.getWriter().print(getSimpleRepo(req, resp, pathParams));
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
			} 
			resp.getWriter().flush();
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
	
	private String getSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		String scriptName = req.getParameter("scriptName");
		String key = req.getParameter("key");
		
		if(scriptName != null && key != null) {
			String value = simpleRepoDAO.select(scriptName, key);
			return new JSONObject().put("success", 1).put("value", value).toString();
		} else if(scriptName == null && key == null) {
			JSONArray simpleRepoData = simpleRepoDAO.selectAll();
			return new JSONObject().put("success", 1).put("data", simpleRepoData).toString();
		} else {
			throw new IllegalArgumentException(String.format("scriptName: %s, key: %s", scriptName, key));
		}
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
			} else if(new UriTemplate("/AddSimpleRepo/").match(pathInfo, pathParams)){
				resp.getWriter().print(addSimpleRepo(req, resp, pathParams));
			} else if(new UriTemplate("/UpdateSimpleRepo/").match(pathInfo, pathParams)){
				resp.getWriter().print(updateSimpleRepo(req, resp, pathParams));
			} else if(new UriTemplate("/RemoveSimpleRepo/").match(pathInfo, pathParams)){
				resp.getWriter().print(removeSimpleRepo(req, resp, pathParams));
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
			} 
			resp.getWriter().flush();
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
	
	private String addSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String scriptName = req.getParameter("scriptName");
		String key = req.getParameter("key");
		String value = req.getParameter("value");
		
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		Preconditions.checkArgument(key != null, "key is null");
		Preconditions.checkArgument(value != null, "value is null");
		
		simpleRepoDAO.insert(scriptName, key, value);
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String updateSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String scriptName = req.getParameter("scriptName");
		String key = req.getParameter("key");
		
		String newKey = req.getParameter("newKey");
		String newValue = req.getParameter("newValue");
		
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		Preconditions.checkArgument(key != null, "key is null");
		Preconditions.checkArgument(newKey != null, "newKey is null");
		Preconditions.checkArgument(newValue != null, "newValue is null");
		
		simpleRepoDAO.update(scriptName, key, newKey, newValue);
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String removeSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String scriptName = req.getParameter("scriptName");
		String key = req.getParameter("key");
		
		Preconditions.checkArgument(scriptName != null);
		Preconditions.checkArgument(key != null);	
		
		simpleRepoDAO.delete(scriptName);
		
		return new JSONObject().put("success", 1).toString();
	}
} 