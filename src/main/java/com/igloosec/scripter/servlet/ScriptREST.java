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
import com.igloosec.scripter.dao.ScriptDAO;
import com.igloosec.scripter.exception.AlreadyExistsException;
import com.igloosec.scripter.exception.AlreadyStartedException;
import com.igloosec.scripter.exception.NotFoundException;
import com.igloosec.scripter.exception.ScriptNotParsableException;
import com.igloosec.scripter.exception.ScriptNotRunningException;
import com.igloosec.scripter.exception.VersionException;
import com.igloosec.scripter.script.generate.Db2FileScriptGenerator;
import com.igloosec.scripter.script.parse.ScriptParamsParser;
import com.igloosec.scripter.service.ScriptService;
import com.sun.jersey.api.uri.UriTemplate;

public class ScriptREST extends HttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(ScriptREST.class);
	private ScriptService scriptService = SingletonInstanceRepo.getInstance(ScriptService.class);
	private ScriptDAO scriptDAO = SingletonInstanceRepo.getInstance(ScriptDAO.class);

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
			} else if(new UriTemplate("/Titles/").match(pathInfo, pathParams)){
				resp.getWriter().print(getTitles(req, resp, pathParams));
			} else if(new UriTemplate("/Generate/Db2File/").match(pathInfo, pathParams)){
				resp.getWriter().print(generateDb2File(req, resp, pathParams));
			} else if(new UriTemplate("/Load/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(loadScript(req, resp, pathParams));
			} else if(new UriTemplate("/LoadParams/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(loadScriptParams(req, resp, pathParams));
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

	private String loadScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException{
		JSONObject script = scriptService.load(pathParams.get("title"));
		return new JSONObject().put("success", 1).put("script", script).toString();
	}
	
	private String loadScriptParams(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, ScriptException, ScriptNotParsableException {
		JSONObject scriptJSON = scriptService.load(pathParams.get("title"));
		String scriptName = scriptJSON.getString("SCRIPT_NAME");
		String script = scriptJSON.getString("SCRIPT");
		
		try {
			JSONObject parsedParams = new ScriptParamsParser().parseParams(scriptName, script);
			logger.info(String.format("script %s parsed: %s", scriptName, parsedParams.toString()));
			return new JSONObject()
				.put("success", 1)
				.put("parsable", 1)
				.put("params", parsedParams).toString();
		} catch(ScriptNotParsableException e) {
			logger.info(String.format("script %s not parsable, %s", scriptName, e.getMessage()));
			return new JSONObject()
				.put("success", 1)
				.put("parsable", 0)
				.put("msg", e.getMessage()).toString();
		}
	}
	
	private String generateDb2File(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws AlreadyExistsException, IOException{
		String period = req.getParameter("period");
		String dbVendor = req.getParameter("dbVendor");
		String dbIp = req.getParameter("dbIp");
		String dbPort = req.getParameter("dbPort");
		String dbSid = req.getParameter("dbSid");
		String jdbcDriver = req.getParameter("jdbcDriver");
		String jdbcConnUrl = req.getParameter("jdbcConnUrl");
		String jdbcUsername = req.getParameter("jdbcUsername");
		String jdbcPassword = req.getParameter("jdbcPassword");
		String columns = req.getParameter("columns");
		String table = req.getParameter("table");
		String bindingType = req.getParameter("bindingType");
		String bindingColumn = req.getParameter("bindingColumn");
		String delimiter = req.getParameter("delimiter");
		String charset = req.getParameter("charset");
		String outputPath = req.getParameter("outputPath");
		
		Preconditions.checkArgument(period != null, "period is null");
		Preconditions.checkArgument(dbVendor != null, "dbVendor is null");
		Preconditions.checkArgument(dbIp != null, "dbIp is null");
		Preconditions.checkArgument(dbPort != null, "dbPort is null");
		Preconditions.checkArgument(dbSid != null, "dbSid is null");
		Preconditions.checkArgument(jdbcDriver != null, "jdbcDriver is null");
		Preconditions.checkArgument(jdbcConnUrl != null, "jdbcConnUrl is null");
		Preconditions.checkArgument(jdbcUsername != null, "jdbcUsername is null");
		Preconditions.checkArgument(jdbcPassword != null, "jdbcPassword is null");
		Preconditions.checkArgument(columns != null, "columns is null");
		Preconditions.checkArgument(table != null, "table is null");
		Preconditions.checkArgument(bindingType != null, "bindingType is null");
		if(bindingType.equals("simple") == false)
			Preconditions.checkArgument(bindingColumn != null, "bindingColumn is null");
		Preconditions.checkArgument(delimiter != null, "delimiter is null");
		Preconditions.checkArgument(charset != null, "charset is null");
		Preconditions.checkArgument(outputPath != null, "outputPath is null");
		
		String script = new Db2FileScriptGenerator()
			.generate(period, dbVendor, dbIp, dbPort, dbSid, jdbcDriver, jdbcConnUrl, 
					jdbcUsername, jdbcPassword, columns, table, bindingType, bindingColumn, 
					delimiter, charset, outputPath);
		
		return new JSONObject().put("success", 1).put("script", script).toString();
	}
	
	private String getScriptInfo(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		JSONArray scripts = scriptService.getScriptInfo();
		return new JSONObject().put("success", 1).put("scriptInfos", scripts).toString();
	}
	
	private String getTitles(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		JSONArray titles = scriptDAO.selectTitles();
		return new JSONObject().put("success", 1).put("titles", titles).toString();
	}

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
			
			} else if(new UriTemplate("/ImportVer1Script/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(importVer1Script(req, resp, pathParams));
			} else if(new UriTemplate("/Edit/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postEditScript(req, resp, pathParams));
			} else if(new UriTemplate("/Start/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postStartScript(req, resp, pathParams));
			} else if(new UriTemplate("/Stop/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postStopScript(req, resp, pathParams));
			} else if(new UriTemplate("/Rename/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postRename(req, resp, pathParams));
			} else if(new UriTemplate("/Remove/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(postRemove(req, resp, pathParams));
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
			}
			resp.getWriter().flush();
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
		}
	}
	
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
	}
	
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
	}
	
	private String postStartScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JSONException, NotFoundException, AlreadyStartedException, ScriptException, VersionException, IOException{
		String title = pathParams.get("title");
		
		Preconditions.checkArgument(title != null, "title is null");
		
		scriptService.startScript(title);
		
		return new JSONObject().put("success", 1).toString();
	}
	
	private String postStopScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws ScriptNotRunningException {
		String title = pathParams.get("title");
		
		Preconditions.checkArgument(title != null, "title is null");
		
		scriptService.stopScript(title);
		
		return new JSONObject().put("success", 1).toString();
	}
	
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
	}
	
	private String postRemove(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) {
		String title = pathParams.get("title");
		
		Preconditions.checkArgument(title != null, "title is null");
		
		scriptService.remove(title);
		
		return new JSONObject().put("success", 1).toString();
	}
}