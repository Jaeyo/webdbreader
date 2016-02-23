package com.igloosec.scripter.servlet;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;
import org.json.JSONObject;

import com.google.common.collect.Maps;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.service.NotiService;
import com.igloosec.scripter.service.NotiService.ErrLogListener;
import com.sun.jersey.api.uri.UriTemplate;

public class NotiWebSocketServlet extends WebSocketServlet {
	private static final Logger logger = Logger.getLogger(NotiWebSocketServlet.class);
	private NotiService notiService = SingletonInstanceRepo.getInstance(NotiService.class);
	
	@Override
	public WebSocket doWebSocketConnect(HttpServletRequest req, String protocol) {
		String pathInfo = req.getPathInfo();
		if(pathInfo == null) pathInfo = "/";
		Map<String, String> pathParams = Maps.newHashMap();
		
		try {
			if(new UriTemplate("/ErrorLog/").match(pathInfo, pathParams)) {
				return getErrorLogWebSocket(req, pathParams);
			}
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
		}
		return null;
	}
	
	private WebSocket getErrorLogWebSocket(HttpServletRequest req, Map<String, String> pathParams) {
		return new ErrorLogWebSocket();
	}
	
	public class ErrorLogWebSocket implements WebSocket.OnTextMessage {
		private Connection conn = null;
		private ErrLogListener listener = null;
		
		@Override
		public void onOpen(Connection _conn) {
			this.conn = _conn;
			this.listener = new ErrLogListener() {
				@Override
				public void listen(String uuid, String scriptName, long timestamp, String msg) {
					try {
						JSONObject msgJson = new JSONObject();
						msgJson.put("type", "errLog");
						msgJson.put("uuid", uuid);
						msgJson.put("scriptName", scriptName);
						msgJson.put("timestamp", timestamp);
						msgJson.put("msg", msg);
						conn.sendMessage(msgJson.toString());
					} catch (IOException e) {
						logger.error(String.format("%s, errmsg", e.getClass().getSimpleName(), e.getMessage()), e);
						notiService.removeErrLogListener(this);
					}
				}
			};
			
			notiService.addErrLogListener(this.listener);
		}

		@Override
		public void onClose(int closeCode, String message) {
			notiService.removeErrLogListener(this.listener);
		}

		@Override
		public void onMessage(String data) {
		}
	}
}