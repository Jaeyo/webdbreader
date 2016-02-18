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

import sun.org.mozilla.javascript.internal.WrapFactory;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.ScriptDAO;
import com.igloosec.scripter.exception.AlreadyExistsException;
import com.igloosec.scripter.exception.AlreadyStartedException;
import com.igloosec.scripter.exception.CryptoException;
import com.igloosec.scripter.exception.NotFoundException;
import com.igloosec.scripter.exception.ScriptNotParsableException;
import com.igloosec.scripter.exception.ScriptNotRunningException;
import com.igloosec.scripter.exception.VersionException;
import com.igloosec.scripter.script.generate.Db2DbScriptGenerator;
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
			if(new UriTemplate("/scripts/info").match(pathInfo, pathParams)){
				resp.getWriter().print(getScriptInfo(req, resp, pathParams));
			} else if(new UriTemplate("/script-titles").match(pathInfo, pathParams)){
				resp.getWriter().print(getTitles(req, resp, pathParams));
			} else if(new UriTemplate("/db2file").match(pathInfo, pathParams)){
				resp.getWriter().print(generateDb2File(req, resp, pathParams));
			} else if(new UriTemplate("/db2db").match(pathInfo, pathParams)){
				resp.getWriter().print(generateDb2Db(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}").match(pathInfo, pathParams)){
				resp.getWriter().print(loadScript(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}/params").match(pathInfo, pathParams)){
				resp.getWriter().print(loadScriptParams(req, resp, pathParams));
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

	private String loadScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException{
		JSONObject script = scriptService.load(pathParams.get("title"));
		return new JSONObject().put("success", 1).put("script", script).toString();
	}
	
	private String loadScriptParams(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, ScriptException, ScriptNotParsableException, JSONException, CryptoException {
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
	
	private String generateDb2File(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws AlreadyExistsException, IOException, CryptoException {
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
	
	private String generateDb2Db(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws AlreadyExistsException, IOException, CryptoException {
		String srcDbVendor = req.getParameter("srcDbVendor");
		String srcDbIp = req.getParameter("srcDbIp");
		String srcDbPort = req.getParameter("srcDbPort");
		String srcDbSid = req.getParameter("srcDbSid");
		String srcJdbcDriver = req.getParameter("srcJdbcDriver");
		String srcJdbcConnUrl = req.getParameter("srcJdbcConnUrl");
		String srcJdbcUsername = req.getParameter("srcJdbcUsername");
		String srcJdbcPassword = req.getParameter("srcJdbcPassword");
		String srcTable = req.getParameter("srcTable");
		String srcColumns = req.getParameter("srcColumns");
		String destDbVendor = req.getParameter("destDbVendor");
		String destDbIp = req.getParameter("destDbIp");
		String destDbPort = req.getParameter("destDbPort");
		String destDbSid = req.getParameter("destDbSid");
		String destJdbcDriver = req.getParameter("destJdbcDriver");
		String destJdbcConnUrl = req.getParameter("destJdbcConnUrl");
		String destJdbcUsername = req.getParameter("destJdbcUsername");
		String destJdbcPassword = req.getParameter("destJdbcPassword");
		String destTable = req.getParameter("destTable");
		String destColumns = req.getParameter("destColumns");
		String bindingType = req.getParameter("bindingType");
		String srcBindingColumn = req.getParameter("srcBindingColumn");
		String period = req.getParameter("period");
		String deleteAllBeforeInsert = req.getParameter("deleteAllBeforeInsert");
		
		Preconditions.checkArgument(srcDbVendor != null, "srcDbVendor is null");
		Preconditions.checkArgument(srcDbIp != null, "srcDbPort is null");
		Preconditions.checkArgument(srcDbSid != null, "srcDbSid is null");
		Preconditions.checkArgument(srcJdbcDriver != null, "srcJdbcDriver is null");
		Preconditions.checkArgument(srcJdbcConnUrl != null, "srcJdbcConnUrl is null");
		Preconditions.checkArgument(srcJdbcUsername != null, "srcJdbcUsername is null");
		Preconditions.checkArgument(srcJdbcPassword != null, "srcJdbcPassword is null");
		Preconditions.checkArgument(srcTable != null, "srcTable is null");
		Preconditions.checkArgument(srcColumns != null, "srcColumns is null");
		Preconditions.checkArgument(destDbVendor != null, "destDbVendor is null");
		Preconditions.checkArgument(destDbIp != null, "destDbIp is null");
		Preconditions.checkArgument(destDbPort != null, "destDbPort is null");
		Preconditions.checkArgument(destDbSid != null, "destDbSid is null");
		Preconditions.checkArgument(destJdbcDriver != null, "destJdbcDriver is null");
		Preconditions.checkArgument(destJdbcConnUrl != null, "destJdbcConnUrl is null");
		Preconditions.checkArgument(destJdbcUsername != null, "destJdbcUsername is null");
		Preconditions.checkArgument(destJdbcPassword != null, "destJdbcPassword is null");
		Preconditions.checkArgument(destTable != null, "destTable is null");
		Preconditions.checkArgument(destColumns != null, "destColumns is null");
		Preconditions.checkArgument(bindingType != null, "bindingType is null");
		if(bindingType.equals("simple") == true) {
			Preconditions.checkArgument(deleteAllBeforeInsert != null, "deleteAllBeforeInsert is null");
		} else {
			Preconditions.checkArgument(srcBindingColumn != null, "srcBindingColumn is null");
		}
		Preconditions.checkArgument(period != null, "period is null");
	
		String script = new Db2DbScriptGenerator()
			.generate(srcDbVendor, srcDbIp, srcDbPort, srcDbSid, srcJdbcDriver, 
					srcJdbcConnUrl, srcJdbcUsername, srcJdbcPassword, srcTable, 
					srcColumns, destDbVendor, destDbIp, destDbPort, destDbSid, 
					destJdbcDriver, destJdbcConnUrl, destJdbcUsername, 
					destJdbcPassword, destTable, destColumns, bindingType, 
					srcBindingColumn, period, deleteAllBeforeInsert);
		
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
			if(new UriTemplate("/script/{title}").match(pathInfo, pathParams)){
				resp.getWriter().print(postScript(req, resp, pathParams));
			} else if(new UriTemplate("/ver1-script/script-name/{title}").match(pathInfo, pathParams)){
				resp.getWriter().print(importVer1Script(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}/edit").match(pathInfo, pathParams)){
				resp.getWriter().print(postEditScript(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}/start").match(pathInfo, pathParams)){
				resp.getWriter().print(postStartScript(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}/stop").match(pathInfo, pathParams)){
				resp.getWriter().print(postStopScript(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}/rename").match(pathInfo, pathParams)){
				resp.getWriter().print(postRename(req, resp, pathParams));
			} else if(new UriTemplate("/script/{title}/remove").match(pathInfo, pathParams)){
				resp.getWriter().print(postRemove(req, resp, pathParams));
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