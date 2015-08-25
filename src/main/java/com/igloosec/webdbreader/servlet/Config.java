package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Maps;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.ConfigService;
import com.igloosec.webdbreader.service.ScriptService;
import com.igloosec.webdbreader.util.Util;
import com.igloosec.webdbreader.util.jade.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

import de.neuland.jade4j.exceptions.JadeCompilerException;

public class Config extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(Config.class);
	private ScriptService scriptService = SingletonInstanceRepo.getInstance(ScriptService.class);
	private ConfigService configService = SingletonInstanceRepo.getInstance(ConfigService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/").match(pathInfo, pathParams)){
				resp.getWriter().print(getConfig(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				Map<String, Object> model = Maps.newHashMap();
				model.put("scriptInfos", Util.jsonArray2JsonObjectArray(scriptService.getScriptInfo()));
				resp.getWriter().print(jade("error.jade", model));
				resp.getWriter().flush();
			} //if
		} catch(IllegalArgumentException e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
			Map<String, Object> model = Maps.newHashMap();
			model.put("scriptInfos", Util.jsonArray2JsonObjectArray(scriptService.getScriptInfo()));
			resp.getWriter().print(jade("error.jade", model));
			resp.getWriter().flush();
		} catch(Exception e){
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			Map<String, Object> model = Maps.newHashMap();
			model.put("scriptInfos", Util.jsonArray2JsonObjectArray(scriptService.getScriptInfo()));
			resp.getWriter().print(jade("error.jade", model));
			resp.getWriter().flush();
		} //catch
	} //doGet
	
	private String getConfig(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JadeCompilerException, IOException{
		Map<String, Object> model = Maps.newHashMap();
		model.put("scriptInfos", Util.jsonArray2JsonObjectArray(scriptService.getScriptInfo()));
		model.put("configs", configService.load());
		return jade("config.jade", model);
	} //getConfig
} //class