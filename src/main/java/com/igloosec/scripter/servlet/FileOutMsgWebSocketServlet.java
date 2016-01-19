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
import com.igloosec.scripter.service.FileOutMsgService;
import com.igloosec.scripter.service.FileOutMsgService.FileOutListener;
import com.sun.jersey.api.uri.UriTemplate;

public class FileOutMsgWebSocketServlet extends WebSocketServlet {
	private static final Logger logger = LoggerFactory.getLogger(FileOutMsgWebSocketServlet.class);
	private FileOutMsgService fileOutMsgService = SingletonInstanceRepo.getInstance(FileOutMsgService.class);
	
	@Override
	public WebSocket doWebSocketConnect(HttpServletRequest req, String protocol) {
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = Maps.newHashMap();
		
		try {
			if(new UriTemplate("/{scriptName}/").match(pathInfo, pathParams)) {
				return getFileOutMsgWebSocket(req, pathParams);
			}
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
		}
		return null;
	}
	
	private WebSocket getFileOutMsgWebSocket(HttpServletRequest req, Map<String, String> pathParams) {
		final String scriptName = pathParams.get("scriptName");
		Preconditions.checkArgument(scriptName != null, "scriptName is null");
		
		logger.info("startTail, scriptName: {}", scriptName);
		return new FileOutMsgWebSocket(scriptName);
	}
	
	public class FileOutMsgWebSocket implements WebSocket.OnTextMessage {
		private Connection conn = null;
		private String scriptName = null;
		private FileOutListener listener = null;
		
		public FileOutMsgWebSocket(String scriptName) {
			this.scriptName = scriptName;
		}
		
		@Override
		public void onOpen(Connection _conn) {
			this.conn = _conn;
			this.listener = new FileOutListener() {
				@Override
				public void listen(String uuid, String filename, long timestamp, String msg) {
					try {
						JSONObject msgJson = new JSONObject();
						msgJson.put("type", "fileOutMsg");
						msgJson.put("uuid", uuid);
						msgJson.put("filename", filename);
						msgJson.put("timestamp", timestamp);
						msgJson.put("msg", msg);
						conn.sendMessage(msgJson.toString());
					} catch (IOException e) {
						logger.error(String.format("%s, errmsg", e.getClass().getSimpleName(), e.getMessage()), e);
						fileOutMsgService.removeTailingListener(scriptName, this);
					}
				}
			};
			fileOutMsgService.addTailingListener(this.scriptName, listener);
		}

		@Override
		public void onClose(int closeCode, String message) {
			fileOutMsgService.removeTailingListener(this.scriptName, this.listener);
		}

		@Override
		public void onMessage(String data) {
		}
	}
}