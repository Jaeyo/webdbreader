package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.service.FileOutMsgService;
import com.igloosec.scripter.service.FileOutMsgService.FileOutListener;
import com.sun.jersey.api.uri.UriTemplate;

public class FileOutputEventSourceServlet extends HttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(FileOutputEventSourceServlet.class);
	private FileOutMsgService fileOutMsgService = SingletonInstanceRepo.getInstance(FileOutMsgService.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/event-stream");
		resp.setHeader("Cache-Control", "no-cache");
		resp.setCharacterEncoding("UTF-8");
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = Maps.newHashMap();
		
		if(new UriTemplate("/{scriptName}/").match(pathInfo, pathParams)) {
			startTail(req, resp, pathParams);
		} else {
			resp.getWriter().print(new JSONObject().put("type", "error").put("errmsg", "invalid path uri").toString());
			resp.getWriter().flush();
		}
	}
	
	private void startTail(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams) throws IOException {
		final String scriptName = pathParams.get("scriptName");
		
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		
		logger.info("startTail, scriptName: {}", scriptName);
		
		final PrintWriter output = resp.getWriter();
	
		FileOutListener listener = new FileOutListener() {
			@Override
			public void listen(String filename, long timestamp, String msg) {
				try {
					output.write(
						new JSONObject()
							.put("type", "fileOutMsg")
							.put("filename", filename)
							.put("timestamp", timestamp)
							.put("msg", msg)
							.toString()
					);
					output.flush();
				} catch(Exception e) {
					logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
					fileOutMsgService.removeTailingListener(scriptName, this);
				}
			}
		};
		fileOutMsgService.addTailingListener(scriptName, listener);
	}
}