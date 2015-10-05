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
				resp.getWriter().print(getNewDb2Db(req, resp, pathParams));
				resp.getWriter().flush();
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
				resp.getWriter().print(jade("error.jade", null));
				resp.getWriter().flush();
			} //if
		} catch(IllegalArgumentException e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
			resp.getWriter().print(jade("error.jade", null));
			resp.getWriter().flush();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			resp.getWriter().print(jade("error.jade", null));
			resp.getWriter().flush();
		} //catch
	} //doGet
	
	private String getNewDb2File(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JadeCompilerException, IOException {
		return jade("new-db2file.jade", null);
	} //getNewDb2File
	
	private String getNewDb2Db(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JadeCompilerException, IOException {
		return jade("new-db2db.jade", null);
	} //getNewDb2File
	
	private String getViewScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException{
		String title = pathParams.get("title");
		
		Preconditions.checkNotNull(title, "title is null");
		
		return jade("view-script.jade", null);
	} //getViewScript
	
	private String getEditScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException {
		String title = pathParams.get("title");
		
		Preconditions.checkNotNull(title, "title is null");
		
		JSONObject scriptJSON = scriptService.load(title);
		Map<String, Object> model = Maps.newHashMap();
		model.put("script", scriptJSON);
		return jade("edit-script.jade", model);
	} //getEditScript
	
	private String getNewScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException {
		return jade("new-script.jade", null);
	} //getNewScript
	
	private String getEditNewScript(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws NotFoundException, JadeCompilerException, IOException {
		return jade("edit-script.jade", null);
	} //getEditScript
} //class