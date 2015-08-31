package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.Timer;
import java.util.UUID;

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

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.NotExistsException;
import com.igloosec.webdbreader.script.bindings.ScriptLoggerMessageQueueRepo;

@WebSocket
public class LoggerWebSocket {
	private static final Logger logger = LoggerFactory.getLogger(LoggerWebSocket.class);
	private ScriptLoggerMessageQueueRepo mq = SingletonInstanceRepo.getInstance(ScriptLoggerMessageQueueRepo.class);
	private Session session;
	private UUID uuid;
	private String scriptName;
	
	@OnWebSocketConnect
	public void handleConnect(Session session) {
		this.session = session;
	} //handleConnect
	
	@OnWebSocketClose
	public void handleClose(int statusCode, String reason) {
		logger.info("statusCode: {}, reason: {}", statusCode, reason);
		if(this.scriptName != null && this.uuid != null) {
			try {
				mq.unlisten(this.scriptName, this.uuid);
			} catch (NotExistsException e) {
				logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			} //catch
		} //if
	} //handleClose
	
	@OnWebSocketMessage
	public void handleMessage(String msg) {
		JSONObject msgObj = new JSONObject(msg);
		
		String type = msgObj.getString("type");
		logger.info("type: {}", type);
		if("listen".equals(type)) {
			this.scriptName = msgObj.getString("scriptName");
			this.uuid = mq.listen(scriptName, new SendFunction());
		} else {
			logger.error("unknown type: {}", type);
		} //if
	} //handleMessage
	
	@OnWebSocketError
	public void handleError(Throwable e) {
		logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		
		try {
			mq.unlisten(this.scriptName, this.uuid);
		} catch (NotExistsException e1) {
			logger.error(String.format("%s, errmsg: %s",  e.getClass().getSimpleName(), e.getMessage()), e);
		} //catch
	} //handleError
	
	private void sendMsg(String msg) {
		try{
			if(session.isOpen())
				session.getRemote().sendString(msg);
		} catch(IOException e){
			e.printStackTrace();
		} //catch
	} //send
	
	public static class LoggerWebSocketServlet extends WebSocketServlet {
		@Override
		public void configure(WebSocketServletFactory factory) {
			factory.register(LoggerWebSocket.class);
		} //configure
	} //class
	
	public class SendFunction {
		public void send(String msg) {
			sendMsg(msg);
		} //send
	} //class
} //class