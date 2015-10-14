package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.igloosec.webdbreader.Version;
import com.igloosec.webdbreader.exception.CryptoException;
import com.igloosec.webdbreader.util.SimpleCrypto;
import com.igloosec.webdbreader.util.servlet.JadeHttpServlet;
import com.sun.jersey.api.uri.UriTemplate;

public class MetaREST extends JadeHttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(MetaREST.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("application/json; charset=UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = new HashMap<String, String>();
		
		try{
			if(new UriTemplate("/Version/").match(pathInfo, pathParams)){
				resp.getWriter().print(new JSONObject().put("success", 1).put("version", Version.getCurrentVersion()).toString());
				resp.getWriter().flush();
			} else if(new UriTemplate("/Encrypt/").match(pathInfo, pathParams)){
				resp.getWriter().print(getEncrypt(req, resp, pathParams));
				resp.getWriter().flush();
			} else if(new UriTemplate("/Decrypt/").match(pathInfo, pathParams)){
				resp.getWriter().print(getDecrypt(req, resp, pathParams));
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
	
	private String getEncrypt(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JSONException, CryptoException {
		String value = req.getParameter("value");
		
		Preconditions.checkArgument(value != null, "value shouldn't be null");
		Preconditions.checkArgument(value.trim().length() != 0, "value shouldn't be zero length");
		
		return new JSONObject().put("success", 1).put("value", SimpleCrypto.encrypt(value)).toString();
	} //getEncrypt
	
	private String getDecrypt(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws JSONException, CryptoException {
		String value = req.getParameter("value");
		
		Preconditions.checkArgument(value != null, "value shouldn't be null");
		Preconditions.checkArgument(value.trim().length() != 0, "value shouldn't be zero length");
		
		return new JSONObject().put("success", 1).put("value", SimpleCrypto.decrypt(value)).toString();
	} //getDecrypt
} //class