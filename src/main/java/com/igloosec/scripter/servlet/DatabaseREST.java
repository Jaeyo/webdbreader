package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.common.base.Preconditions;
import com.google.common.collect.Sets;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.exception.CryptoException;
import com.igloosec.scripter.service.DatabaseService;
import com.sun.jersey.api.uri.UriTemplate;

public class DatabaseREST extends HttpServlet {
	private static final Logger logger = Logger.getLogger(DatabaseREST.class);
	private DatabaseService databaseService = SingletonInstanceRepo.getInstance(DatabaseService.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/tables").match(pathInfo, pathParams)){
				resp.getWriter().print(tables(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/table/{tableName}/columns").match(pathInfo, pathParams)){
				resp.getWriter().print(columns(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/query").match(pathInfo, pathParams)){
				resp.getWriter().print(querySampleData(req, resp, pathParams));
				resp.getWriter().flush();
			} else{
				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
				resp.getWriter().flush();
			}
		} catch(Exception e){
			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
			if(e.getClass().equals(IllegalArgumentException.class)) logger.error(errmsg);
			else logger.error(errmsg, e);
			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
			resp.getWriter().flush();
		}
	}

	private String tables(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws ClassNotFoundException, JSONException, SQLException, CryptoException{
		JSONObject jdbcParams = new JSONObject()
		.put("driver", req.getParameter("driver"))
		.put("connUrl", req.getParameter("connUrl"))
		.put("username", req.getParameter("username"))
		.put("password", req.getParameter("password"));
	
		Iterator<Entry<String, String[]>> iter = req.getParameterMap().entrySet().iterator();
		
		Preconditions.checkArgument(jdbcParams.isNull("driver") == false, "driver is null");
		Preconditions.checkArgument(jdbcParams.isNull("connUrl") == false, "connUrl is null");
		Preconditions.checkArgument(jdbcParams.isNull("username") == false, "username is null");
		Preconditions.checkArgument(jdbcParams.isNull("password") == false, "password is null");
		
		logger.debug(String.format("jdbcParams: %s", jdbcParams.toString()));
		JSONArray tables = databaseService.getTables(jdbcParams);
		
		//DEBUG
		Set<String> dupls = Sets.newHashSet();
		for (int i = 0; i < tables.length(); i++) {
			String table = tables.getString(i);
			if(dupls.contains(table)) System.out.println("###DEBUG, duplication: " + table);
			else dupls.add(table);
		}
		
		return new JSONObject().put("success", 1).put("tables", tables).toString();
	}

	private String columns(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws ClassNotFoundException, JSONException, SQLException, CryptoException {
		JSONObject jdbcParams = new JSONObject()
		.put("driver", req.getParameter("driver"))
		.put("connUrl", req.getParameter("connUrl"))
		.put("username", req.getParameter("username"))
		.put("password", req.getParameter("password"));
		String tableName = pathParams.get("tableName");

		Preconditions.checkArgument(jdbcParams.isNull("driver") == false, "driver is null");
		Preconditions.checkArgument(jdbcParams.isNull("connUrl") == false, "connUrl is null");
		Preconditions.checkArgument(jdbcParams.isNull("username") == false, "username is null");
		Preconditions.checkArgument(jdbcParams.isNull("password") == false, "password is null");
		Preconditions.checkArgument(tableName != null, "tableName is null");
		
		logger.debug(String.format("jdbcParams: %s", jdbcParams.toString()));
		JSONArray columns = databaseService.getColumns(jdbcParams, tableName);
		return new JSONObject().put("success", 1).put("columns", columns).toString();
	}

	private String querySampleData(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JSONException, ClassNotFoundException, SQLException, CryptoException {
		JSONObject jdbcParams = new JSONObject()
		.put("driver", req.getParameter("driver"))
		.put("connUrl", req.getParameter("connUrl"))
		.put("username", req.getParameter("username"))
		.put("password", req.getParameter("password"));
		
		String query = req.getParameter("query");
		int rowCount = Integer.parseInt(req.getParameter("rowCount"));
		
		String isEncryptedStr = req.getParameter("isEncrypted");
		boolean isEncrypted = (isEncryptedStr == null ? true : Boolean.parseBoolean(isEncryptedStr));
	
		Preconditions.checkArgument(jdbcParams.isNull("driver") == false, "driver is null");
		Preconditions.checkArgument(jdbcParams.isNull("connUrl") == false, "connUrl is null");
		Preconditions.checkArgument(jdbcParams.isNull("username") == false, "username is null");
		Preconditions.checkArgument(jdbcParams.isNull("password") == false, "password is null");
		Preconditions.checkArgument(query != null, "query is null");
		Preconditions.checkArgument(rowCount > 0, "invalid row count: " + rowCount);

		logger.debug(String.format("jdbcParams: %s, query: %s, rowCount: %s", jdbcParams.toString(), query, rowCount));
		JSONArray sampleData = databaseService.querySampleData(jdbcParams, query, rowCount, isEncrypted);
		return new JSONObject().put("success", 1).put("sampleData", sampleData).toString();
	}
}