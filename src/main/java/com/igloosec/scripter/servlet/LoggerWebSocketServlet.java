package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.service.LoggerService;
import com.igloosec.scripter.service.LoggerService.LoggerListener;
import com.sun.jersey.api.uri.UriTemplate;

public class LoggerWebSocketServlet extends WebSocketServlet {
	private static final Logger logger = LoggerFactory.getLogger(LoggerWebSocketServlet.class);
	private LoggerService loggerService = SingletonInstanceRepo.getInstance(LoggerService.class);
	
	@Override
	public WebSocket doWebSocketConnect(HttpServletRequest req, String protocol) {
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = Maps.newHashMap();
		
		try {
			if(new UriTemplate("/{scriptName}/").match(pathInfo, pathParams)) {
				return getLoggerWebSocket(req, pathParams);
			}
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
		}
		return null;
	}
	
	private WebSocket getLoggerWebSocket(HttpServletRequest req, Map<String, String> pathParams) {
		final String scriptName = pathParams.get("scriptName");
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		
		logger.info("startTail, scriptName: {}", scriptName);
		return new LoggerWebSocket(scriptName);
	}
	
	public class LoggerWebSocket implements WebSocket.OnTextMessage {
		private Connection conn = null;
		private String scriptName = null;
		private LoggerListener listener = null;
		
		public LoggerWebSocket(String scriptName) {
			this.scriptName = scriptName;
		}
		
		@Override
		public void onOpen(Connection _conn) {
			this.conn = _conn;
			this.listener = new LoggerListener() {
				@Override
				public void listen(String uuid, long timestamp, String logLevel, String msg) {
					try {
						JSONObject msgJson = new JSONObject();
						msgJson.put("type", "log");
						msgJson.put("uuid", uuid);
						msgJson.put("timestamp", timestamp);
						msgJson.put("level", logLevel);
						msgJson.put("msg", msg);
						conn.sendMessage(msgJson.toString());
					} catch (IOException e) {
						logger.error(String.format("%s, errmsg", e.getClass().getSimpleName(), e.getMessage()), e);
						loggerService.removeTailingListener(scriptName, this);
					}
				}
			};
			loggerService.addTailingListener(this.scriptName, listener);
		}

		@Override
		public void onClose(int closeCode, String message) {
			loggerService.removeTailingListener(this.scriptName, this.listener);
		}

		@Override
		public void onMessage(String data) {
		}
	}
}