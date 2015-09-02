package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.NotFoundException;
import com.igloosec.webdbreader.service.ConfigService;
import com.igloosec.webdbreader.service.OperationHistoryService;
import com.igloosec.webdbreader.service.ScriptService;
import com.igloosec.webdbreader.util.Util;
import com.igloosec.webdbreader.util.jade.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

import de.neuland.jade4j.exceptions.JadeCompilerException;

public class Script extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(Script.class);
	private ScriptService scriptService = SingletonInstanceRepo.getInstance(ScriptService.class);
	private ConfigService configService = SingletonInstanceRepo.getInstance(ConfigService.class);
	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/NewDb2File/").match(pathInfo, pathParams)){
				resp.getWriter().print(getNewDb2File(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/NewDb2Db/").match(pathInfo, pathParams)){
				//TODO
			} else if(new UriTemplate("/View/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(getViewScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Edit/{title}/").match(pathInfo, pathParams)){
				resp.getWriter().print(getEditScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/EditNew/").match(pathInfo, pathParams)){
				resp.getWriter().print(getNewScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Edit/").match(pathInfo, pathParams)){
				resp.getWriter().print(getEditNewScript(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				Map<String, Object> model = Maps.newHashMap();
				model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
				resp.getWriter().print(jade("error.jade", model));
				resp.getWriter().flush();
			} //if
		} catch(IllegalArgumentException e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
			Map<String, Object> model = Maps.newHashMap();
			model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
			resp.getWriter().print(jade("error.jade", model));
			resp.getWriter().flush();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			Map<String, Object> model = Maps.newHashMap();
			model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
			resp.getWriter().print(jade("error.jade", model));
			resp.getWriter().flush();
		} //catch
	} //doGet
	
	private String getNewDb2File(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JadeCompilerException, IOException {
		Map<String, Object> model = Maps.newHashMap();
		model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
		model.put("scriptEditorTheme", configService.load("script.editor.theme"));
		return jade("new-db2file.jade", model);
	} //getNewDb2File
	
	private String getViewScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException{
		String title = pathParams.get("title");
		
		Preconditions.checkNotNull(title, "title is null");
		
		Map<String, Object> model = Maps.newHashMap();
		model.put("script", scriptService.load(title));
		model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
		model.put("operationHistories", Util.jsonArray2JsonObjectList(operationHistoryService.loadHistory(title, 10)));
		return jade("view-script.jade", model);
	} //getViewScript
	
	private String getEditScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException {
		String title = pathParams.get("title");
		
		Preconditions.checkNotNull(title, "title is null");
		
		JSONObject scriptJSON = scriptService.load(title);
		Map<String, Object> model = Maps.newHashMap();
		model.put("script", scriptJSON);
		model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
		model.put("scriptEditorTheme", configService.load("script.editor.theme"));
		return jade("edit-script.jade", model);
	} //getEditScript
	
	private String getNewScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException {
		Map<String, Object> model = Maps.newHashMap();
		model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
		model.put("scriptEditorTheme", configService.load("script.editor.theme"));
		return jade("new-script.jade", model);
	} //getNewScript
	
	private String getEditNewScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException {
		Map<String, Object> model = Maps.newHashMap();
		model.put("scriptInfos", Util.jsonArray2JsonObjectList(scriptService.getScriptInfo()));
		model.put("scriptEditorTheme", configService.load("script.editor.theme"));
		return jade("edit-script.jade", model);
	} //getEditScript
} //class