package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.CryptoException;
import com.igloosec.webdbreader.service.DatabaseService;
import com.igloosec.webdbreader.util.jade.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class DatabaseREST extends JadeHttpServlet{
	private static final Logger logger = LoggerFactory.getLogger(DatabaseREST.class);
	private DatabaseService databaseService = SingletonInstanceRepo.getInstance(DatabaseService.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/Tables/").match(pathInfo, pathParams)){
				resp.getWriter().print(tables(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Columns/{tableName}/").match(pathInfo, pathParams)){
				resp.getWriter().print(columns(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/QuerySampleData/").match(pathInfo, pathParams)){
				resp.getWriter().print(querySampleData(req, resp, pathParams));
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

	private String tables(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws ClassNotFoundException, JSONException, SQLException, CryptoException{
		JSONObject jdbcParams = new JSONObject()
		.put("driver", req.getParameter("driver"))
		.put("connUrl", req.getParameter("connUrl"))
		.put("username", req.getParameter("username"))
		.put("password", req.getParameter("password"));

		Preconditions.checkArgument(jdbcParams.get("driver") != null, "driver is null");
		Preconditions.checkArgument(jdbcParams.get("connUrl") != null, "connUrl is null");
		Preconditions.checkArgument(jdbcParams.get("username") != null, "username is null");
		Preconditions.checkArgument(jdbcParams.get("password") != null, "password is null");
		
		JSONArray tables = databaseService.getTables(jdbcParams);
		return new JSONObject().put("success", 1).put("tables", tables).toString();
	} //tables

	private String columns(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws ClassNotFoundException, JSONException, SQLException, CryptoException {
		JSONObject jdbcParams = new JSONObject()
		.put("driver", req.getParameter("driver"))
		.put("connUrl", req.getParameter("connUrl"))
		.put("username", req.getParameter("username"))
		.put("password", req.getParameter("password"));
		String tableName = pathParams.get("tableName");

		Preconditions.checkArgument(jdbcParams.get("driver") != null, "driver is null");
		Preconditions.checkArgument(jdbcParams.get("connUrl") != null, "connUrl is null");
		Preconditions.checkArgument(jdbcParams.get("username") != null, "username is null");
		Preconditions.checkArgument(jdbcParams.get("password") != null, "password is null");
		Preconditions.checkArgument(tableName != null, "tableName is null");
		
		JSONArray columns = databaseService.getColumns(jdbcParams, tableName);
		return new JSONObject().put("success", 1).put("columns", columns).toString();
	} //column

	private String querySampleData(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JSONException, ClassNotFoundException, SQLException, CryptoException {
		JSONObject jdbcParams = new JSONObject()
		.put("driver", req.getParameter("driver"))
		.put("connUrl", req.getParameter("connUrl"))
		.put("username", req.getParameter("username"))
		.put("password", req.getParameter("password"));
		String query = req.getParameter("query");
		int rowCount = Integer.parseInt(req.getParameter("rowCount"));
	
		Preconditions.checkArgument(jdbcParams.get("driver") != null, "driver is null");
		Preconditions.checkArgument(jdbcParams.get("connUrl") != null, "connUrl is null");
		Preconditions.checkArgument(jdbcParams.get("username") != null, "username is null");
		Preconditions.checkArgument(jdbcParams.get("password") != null, "password is null");
		Preconditions.checkArgument(query != null, "query is null");
		Preconditions.checkArgument(rowCount > 0, "invalid row count: " + rowCount);

		JSONArray sampleData = databaseService.querySampleData(jdbcParams, query, rowCount);
		return new JSONObject().put("success", 1).put("sampleData", sampleData).toString();
	} //querySampleData
} //class