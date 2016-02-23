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
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.service.EmbedDbService;
import com.sun.jersey.api.uri.UriTemplate;

public class EmbedDbREST extends HttpServlet {
	private static final Logger logger = Logger.getLogger(EmbedDbREST.class);
	private EmbedDbService embedDbSerivce = SingletonInstanceRepo.getInstance(EmbedDbService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();

		try{
			if(new UriTemplate("/query").match(pathInfo, pathParams)){
				resp.getWriter().print(query(req, resp, pathParams));
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

	private String query(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
		String query = req.getParameter("query");
		
		Preconditions.checkArgument(query != null, "query is null");

		JSONArray queryResult = embedDbSerivce.runQuery(query);
		return new JSONObject().put("success", 1).put("result", queryResult.toString(4)).toString();
	}
}