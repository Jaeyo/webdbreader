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
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.ScriptScoreStatisticsService;
import com.igloosec.webdbreader.util.jade.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class ChartREST extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(ChartREST.class);
	private ScriptScoreStatisticsService scriptScoreStatisticsService = SingletonInstanceRepo.getInstance(ScriptScoreStatisticsService.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");

		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/ScriptScoreStatistics/Total/").match(pathInfo, pathParams)){
				resp.getWriter().print(getTotalChartData(req, resp, pathParams));
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
	
	private String getTotalChartData(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParmas){
		JSONObject totalStatistics = scriptScoreStatisticsService.getTotalScriptStatistics();
		return totalStatistics.put("success", 1).toString();
	} //getCategoryChart
} //class