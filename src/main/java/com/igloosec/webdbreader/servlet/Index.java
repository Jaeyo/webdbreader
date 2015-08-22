package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.ScriptService;
import com.igloosec.webdbreader.util.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

import de.neuland.jade4j.exceptions.JadeCompilerException;

public class Index extends JadeHttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(Index.class);
	private ScriptService scriptService = SingletonInstanceRepo.getInstance(ScriptService.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//		req.setCharacterEncoding("UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/").match(pathInfo, pathParams)){
				resp.getWriter().print(getIndex(req, resp, pathParams)); TODO why korean converted to ???
				resp.getWriter().flush();
			} else if(new UriTemplate("/View/NewDb2File/").match(pathInfo, pathParams)){
				resp.getWriter().print(jade("new-db2file.jade", null));
				resp.getWriter().flush();
			} else if(new UriTemplate("/View/EmbedDb/").match(pathInfo, pathParams)){
				resp.getWriter().print(jade("embed-db.jade", null));
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
	
	private String getIndex(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JadeCompilerException, IOException{
		JSONArray scriptInfos = scriptService.getScriptInfo();
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("scriptInfos", scriptInfos);
		return jade("index.jade", model);
	} //getIndex
} //class