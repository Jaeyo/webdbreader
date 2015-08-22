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

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.EmbedDbService;
import com.igloosec.webdbreader.service.ScriptService;
import com.igloosec.webdbreader.util.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class EmbedDb extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(EmbedDb.class);
	private EmbedDbService embedDbSerivce = SingletonInstanceRepo.getInstance(EmbedDbService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();

		try{
			if(new UriTemplate("/EmbedDb/Query/").match(pathInfo, pathParams)){
				resp.getWriter().print(query(req, resp, pathParams));
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

	private String query(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String query = req.getParameter("query");

		JSONArray queryResult = embedDbSerivce.runQuery(query);
		return new JSONObject().put("success", 1).put("result", queryResult).toString();
	} //query
} //class