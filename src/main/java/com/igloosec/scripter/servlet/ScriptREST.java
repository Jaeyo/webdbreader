package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.script.ScriptException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.exception.AlreadyExistsException;
import com.igloosec.scripter.exception.AlreadyStartedException;
import com.igloosec.scripter.exception.NotFoundException;
import com.igloosec.scripter.exception.ScriptNotRunningException;
import com.igloosec.scripter.exception.VersionException;
import com.igloosec.scripter.service.ScriptService;
import com.sun.jersey.api.uri.UriTemplate;

public class ScriptREST extends HttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(ScriptREST.class);
	private ScriptService scriptService = SingletonInstanceRepo.getInstance(ScriptService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/Info/").match(pathInfo, pathParams)){
				resp.getWriter().print(getScriptInfo(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Load/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(loadScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			} //if
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
		} //catch
	} //doGet

	private String loadScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException{
		JSONObject script = scriptService.load(pathParams.get("title"));
		return new JSONObject().put("success", 1).put("script", script).toString();
	} //loadScript
	
	private String getScriptInfo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		JSONArray scripts = scriptService.getScriptInfo();
		return new JSONObject().put("success", 1).put("scriptInfos", scripts).toString();
	} //getScriptInfo

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/New/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/ImportVer1Script/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(importVer1Script(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Edit/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postEditScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Start/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postStartScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Stop/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postStopScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Rename/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postRename(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Remove/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postRemove(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			} //if
		} catch(IllegalArgumentException | VersionException e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		} //catch
	} //doPost
	
	private String postScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws AlreadyExistsException{
		String title = pathParams.get("title");
		String script = req.getParameter("script");
		
		Preconditions.checkArgument(title != null, "title is null");
		Preconditions.checkArgument(script != null, "script is null");
		Preconditions.checkArgument(title.trim().length() != 0, "title's length shouldn't be zero");
		Preconditions.checkArgument(title.contains("&") == false, "'&' shouldn't be in title");
		Preconditions.checkArgument(title.contains("%") == false, "'%' shouldn't be in title");
		Preconditions.checkArgument(title.contains("+") == false, "'+' shouldn't be in title");
		Preconditions.checkArgument(title.contains(";") == false, "';' shouldn't be in title");
		Preconditions.checkArgument(title.contains("\'") == false, "'(\')' shouldn't be in title");
		Preconditions.checkArgument(title.contains("\"") == false, "'(\")' shouldn't be in title");
		Preconditions.checkArgument(title.contains("/") == false, "'/' shouldn't be in title");
		
		scriptService.save(title, script);
		return new JSONObject().put("success", 1).toString();
	} //postScript
	
	private String importVer1Script(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws AlreadyExistsException, IOException{
		String title = pathParams.get("title");
		String script = req.getParameter("script");
		String dbName = req.getParameter("dbName");
		String jdbcDriver = req.getParameter("jdbcDriver");
		String jdbcConnUrl = req.getParameter("jdbcConnUrl");
		String jdbcUsername = req.getParameter("jdbcUsername");
		String jdbcPassword = req.getParameter("jdbcPassword");
		
		Preconditions.checkArgument(title != null, "title is null");
		Preconditions.checkArgument(script != null, "script is null");
		Preconditions.checkArgument(title.trim().length() != 0, "title's length shouldn't be zero");
		Preconditions.checkArgument(title.contains("&") == false, "'&' shouldn't be in title");
		Preconditions.checkArgument(title.contains("%") == false, "'%' shouldn't be in title");
		Preconditions.checkArgument(title.contains("+") == false, "'+' shouldn't be in title");
		Preconditions.checkArgument(title.contains(";") == false, "';' shouldn't be in title");
		Preconditions.checkArgument(title.contains("\'") == false, "'(\')' shouldn't be in title");
		Preconditions.checkArgument(title.contains("\"") == false, "'(\")' shouldn't be in title");
		Preconditions.checkArgument(title.contains("/") == false, "'/' shouldn't be in title");
		
		scriptService.importVer1Script(title, script, dbName, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword);
		return new JSONObject().put("success", 1).toString();
	}
	
	private String postEditScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String title = pathParams.get("title");
		String script = req.getParameter("script");
		
		Preconditions.checkArgument(title != null, "title is null");
		Preconditions.checkArgument(script != null, "script is null");
		
		scriptService.edit(title, script);
		return new JSONObject().put("success", 1).toString();
	} //postEditScript
	
	private String postStartScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JSONException, NotFoundException, AlreadyStartedException, ScriptException, VersionException, IOException{
		String title = pathParams.get("title");
		
		Preconditions.checkArgument(title != null, "title is null");
		
		scriptService.startScript(title);
		
		return new JSONObject().put("success", 1).toString();
	} //postStartScript
	
	private String postStopScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws ScriptNotRunningException {
		String title = pathParams.get("title");
		
		Preconditions.checkArgument(title != null, "title is null");
		
		scriptService.stopScript(title);
		
		return new JSONObject().put("success", 1).toString();
	} //postStartScript
	
	private String postRename(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws AlreadyExistsException {
		String title = pathParams.get("title");
		String newTitle = req.getParameter("newTitle");
		
		Preconditions.checkArgument(title != null, "title is null");
		Preconditions.checkArgument(newTitle != null, "newTitle is null");
		Preconditions.checkArgument(newTitle.equals(title) == false, "same title");
		Preconditions.checkArgument(newTitle.trim().length() != 0, "newTitle's length shouldn't be zero");
		Preconditions.checkArgument(newTitle.contains("&") == false, "'&' shouldn't be in title");
		Preconditions.checkArgument(newTitle.contains("%") == false, "'%' shouldn't be in title");
		Preconditions.checkArgument(newTitle.contains("+") == false, "'+' shouldn't be in title");
		Preconditions.checkArgument(newTitle.contains(";") == false, "';' shouldn't be in title");
		Preconditions.checkArgument(newTitle.contains("\'") == false, "'(\')' shouldn't be in title");
		Preconditions.checkArgument(newTitle.contains("\"") == false, "'(\")' shouldn't be in title");
		Preconditions.checkArgument(newTitle.contains("/") == false, "'/' shouldn't be in title");
		
		scriptService.rename(title, newTitle);
		
		return new JSONObject().put("success", 1).toString();
	} //postRename
	
	private String postRemove(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		String title = pathParams.get("title");
		
		Preconditions.checkArgument(title != null, "title is null");
		
		scriptService.remove(title);
		
		return new JSONObject().put("success", 1).toString();
	} //postDelete
} //class