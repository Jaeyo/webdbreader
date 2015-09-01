package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.Iterator;
import java.util.Timer;
import java.util.TimerTask;
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
import com.igloosec.webdbreader.script.ScriptLoggerMessageQueueRepo;

@WebSocket
public class LoggerWebSocket {
	private static final Logger logger = LoggerFactory.getLogger(LoggerWebSocket.class);
	private ScriptLoggerMessageQueueRepo logQueues = SingletonInstanceRepo.getInstance(ScriptLoggerMessageQueueRepo.class);
	private Session session;
	private Timer pollingTimer = new Timer();
	
	@OnWebSocketConnect
	public void handleConnect(Session session) {
		this.session = session;
	} //handleConnect
	
	@OnWebSocketClose
	public void handleClose(int statusCode, String reason) {
		logger.info("statusCode: {}, reason: {}", statusCode, reason);
		pollingTimer.cancel();
	} //handleClose
	
	@OnWebSocketMessage
	public void handleMessage(String msg) {
		JSONObject msgObj = new JSONObject(msg);
		
		final String scriptName = msgObj.getString("scriptName");
	
		pollingTimer.schedule(new TimerTask() {
			private Iterator<JSONObject> iter;
			
			@Override
			public void run() {
				if(iter == null)
					iter = logQueues.getLogQueueIterator(scriptName);
				if(iter == null)
					return;
				
				while(iter.hasNext()) {
					JSONObject logMsg = iter.next();
					sendMsg(logMsg.toString());
				} //while
			} //run
		}, 1000, 1000);
	} //handleMessage
	
	@OnWebSocketError
	public void handleError(Throwable e) {
		logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		pollingTimer.cancel();
		if(session.isOpen())
			session.close();
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
} //class