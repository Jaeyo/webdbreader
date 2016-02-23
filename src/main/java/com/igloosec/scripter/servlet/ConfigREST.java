package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.common.Path;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.exception.UnknownThresholdException;
import com.igloosec.scripter.service.ConfigService;
import com.igloosec.scripter.service.SimpleRepoService;
import com.igloosec.scripter.util.Log4jConfig;
import com.sun.jersey.api.uri.UriTemplate;

public class ConfigREST extends HttpServlet {
	private static final Logger logger = Logger.getLogger(ConfigREST.class);
	private ConfigService configService = SingletonInstanceRepo.getInstance(ConfigService.class);
	private SimpleRepoService simpleRepoService = SingletonInstanceRepo.getInstance(SimpleRepoService.class);
	
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
			} else if(new UriTemplate("/enable-tail").match(pathInfo, pathParams)){
				resp.getWriter().print(getEnableTail(req, resp, pathParams));
			} else if(new UriTemplate("/simple-repos").match(pathInfo, pathParams)){
				resp.getWriter().print(getSimpleRepoAll(req, resp, pathParams));
			} else if(new UriTemplate("/simple-repo/script/{scriptName}/key/{key}").match(pathInfo, pathParams)){
				resp.getWriter().print(getSimpleRepo(req, resp, pathParams));
			} else if(new UriTemplate("/log4j/threshold").match(pathInfo, pathParams)){
				resp.getWriter().print(getLog4jThreshold(req, resp, pathParams));
			} else if(new UriTemplate("/homepath").match(pathInfo, pathParams)){
				resp.getWriter().print(getHomePath(req, resp, pathParams));
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
			} 
			resp.getWriter().flush();
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			if(e.getClass().equals(IllegalArgumentException.class)) logger.error(errmsg);
			else logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} 
	} 

	private String getConfig(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		return new JSONObject().put("success", 1).put("configs", configService.load()).toString();
	} 
	
	private String getEnableTail(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		return new JSONObject().put("success", 1).put("enable-tail", configService.isTailEnable()).toString();
	}
	
	private String getSimpleRepoAll(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		JSONArray simpleRepoData = simpleRepoService.get();
		return new JSONObject().put("success", 1).put("data", simpleRepoData).toString();
	}
	
	private String getSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		String scriptName = pathParams.get("scriptName");
		String key = pathParams.get("key");
		
		Preconditions.checkArgument(scriptName != null && scriptName.trim().length() > 0, "invalid scriptName");
		Preconditions.checkArgument(key != null && key.trim().length() > 0, "invalid key");
		
		String value = simpleRepoService.get(scriptName, key);
		return new JSONObject().put("success", 1).put("value", value).toString();
	}
	
	private String getLog4jThreshold(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		return new JSONObject().put("success", 1).put("threshold", Log4jConfig.getThreshold()).toString();
	}
	
	private String getHomePath(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		return new JSONObject().put("success", 1).put("homepath", Path.getPackagePath().getAbsolutePath()).toString();
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/enable-tail/{value}").match(pathInfo, pathParams)){
				resp.getWriter().print(postEnableTail(req, resp, pathParams));
			} else if(new UriTemplate("/simple-repo/script/{scriptName}/key/{key}").match(pathInfo, pathParams)){
				resp.getWriter().print(addSimpleRepo(req, resp, pathParams));
			} else if(new UriTemplate("/simple-repo/script/{scriptName}/key/{key}/update").match(pathInfo, pathParams)){
				resp.getWriter().print(updateSimpleRepo(req, resp, pathParams));
			} else if(new UriTemplate("/simple-repo/script/{scriptName}/key/{key}/remove").match(pathInfo, pathParams)){
				resp.getWriter().print(removeSimpleRepo(req, resp, pathParams));
			} else if(new UriTemplate("/update/log4j/threshold").match(pathInfo, pathParams)){
				resp.getWriter().print(updateLog4jThreshold(req, resp, pathParams));
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
			} 
			resp.getWriter().flush();
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			if(e.getClass().equals(IllegalArgumentException.class)) logger.error(errmsg);
			else logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} 
	} 
	
	private String postEnableTail(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String value = pathParams.get("value");
		
		Preconditions.checkArgument(value != null, "value is null");
		Preconditions.checkArgument(value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false"), "invalid value: " + value);
		
		configService.enableTail(Boolean.parseBoolean(value));
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String addSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String scriptName = pathParams.get("scriptName");
		String key = pathParams.get("key");
		String value = req.getParameter("value");
		
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		Preconditions.checkArgument(key != null, "key is null");
		Preconditions.checkArgument(value != null, "value is null");
		
		simpleRepoService.set(scriptName, key, value);
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String updateSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String scriptName = pathParams.get("scriptName");
		String key = pathParams.get("key");
		
		String newKey = req.getParameter("newKey");
		String newValue = req.getParameter("newValue");
		
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		Preconditions.checkArgument(key != null, "key is null");
		Preconditions.checkArgument(newKey != null, "newKey is null");
		Preconditions.checkArgument(newValue != null, "newValue is null");
		
		simpleRepoService.set(scriptName, key, newKey, newValue);
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String removeSimpleRepo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String scriptName = pathParams.get("scriptName");
		String key = pathParams.get("key");
		
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		Preconditions.checkArgument(key != null, "key is null");
		
		simpleRepoService.delete(scriptName);
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String updateLog4jThreshold(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws UnknownThresholdException{
		String threshold = req.getParameter("threshold");
		
		Preconditions.checkArgument(threshold != null, "threshold is null");
		
		Log4jConfig.setThreshold(threshold);
		
		return new JSONObject().put("success", 1).toString();
	}
} 