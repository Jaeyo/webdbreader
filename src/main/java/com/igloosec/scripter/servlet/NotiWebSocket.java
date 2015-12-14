package com.igloosec.scripter.servlet;

import java.io.IOException;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.service.NotiService;

@WebSocket
public class NotiWebSocket {
	private static final Logger logger = LoggerFactory.getLogger(NotiWebSocket.class);
	private Session session;
	private NotiService notiService = SingletonInstanceRepo.getInstance(NotiService.class);
	
	@OnWebSocketConnect
	public void handleConnect(Session session) {
		this.session = session;
		notiService.addNotiWebSocket(this);
	}
	
	@OnWebSocketClose
	public void handleClose(int statusCode, String reason) {
		logger.info("statusCode: {}, reason: {}", statusCode, reason);
		notiService.removeNotiWebSocket(this);
	}
	
	@OnWebSocketMessage
	public void handleMessage(String msg) {
	}
	
	@OnWebSocketError
	public void handleError(Throwable e) {
		logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		
		if(session.isOpen())
			session.close();
	}

	public void sendErrorLogNotiMsg(String scriptName, String msg) {
		sendMsg(
			new JSONObject()
			.put("type", "error-log")
			.put("scriptName", scriptName)
			.put("msg", msg).toString()
		);
	}
	
	public void sendScriptEndNotiMsg(String scriptName) {
		sendMsg(
			new JSONObject()
			.put("type", "script-end")
			.put("scriptName", scriptName).toString()
		);
	}
	
	private synchronized void sendMsg(String msg) {
		try{
			if(session.isOpen())
				session.getRemote().sendString(msg);
		} catch(IOException e){
			e.printStackTrace();
		}
	}

	public static class NotiWebSocketServlet extends WebSocketServlet {
		@Override
		public void configure(WebSocketServletFactory factory) {
			factory.register(NotiWebSocket.class);
		}
	}
}