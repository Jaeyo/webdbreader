package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.LinkedBlockingQueue;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Queues;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.service.FileOutMsgService;
import com.igloosec.webdbreader.service.FileOutMsgService.FileOutListener;

@WebSocket
public class FileOutMsgWebSocket {
	private static final Logger logger = LoggerFactory.getLogger(FileOutMsgWebSocket.class);
	private FileOutMsgService fileOutMsgService = SingletonInstanceRepo.getInstance(FileOutMsgService.class);
	private Session session;
	
	private Map<String, FileOutListener> listeners = Maps.newHashMap();
	private List<Timer> pollingTimers = Lists.newArrayList();
	
	
	@OnWebSocketConnect
	public void handleConnect(Session session) {
		this.session = session;
	}
	
	@OnWebSocketClose
	public void handleClose(int statusCode, String reason) {
		logger.info("statusCode: {}, reason: {}", statusCode, reason);
		
		for(Timer pollingTimer: pollingTimers) {
			pollingTimer.cancel();
		}
		
		for(Entry<String, FileOutListener> listenerEntry: listeners.entrySet()) {
			String scriptName = listenerEntry.getKey();
			FileOutListener listener = listenerEntry.getValue();
			fileOutMsgService.removeTailingListener(scriptName, listener);
		}
	}
	
	@OnWebSocketMessage
	public void handleMessage(String msg) {
		JSONObject msgObj = new JSONObject(msg);
		
		if(msgObj.isNull("type")) {
			logger.error(String.format("no type parameter: %s", msg));
			sendMsg(
				new JSONObject()
				.put("type", "error")
				.put("errmsg", "no type parameter").toString()
			);
			session.close();
		}
		
		String type = msgObj.getString("type");
		
		switch(type.toLowerCase()) {
			case "start-tail" :
				startTail(msgObj);
				break;
		}
	}
	
	private void startTail(JSONObject msg) {
		String scriptName = msg.getString("scriptName");
		final LinkedBlockingQueue<JSONObject> fileOutMsgQueue = Queues.newLinkedBlockingQueue();
		FileOutListener listener = new FileOutListener() {
			@Override
			public void listen(long timestamp, String msg) {
				try {
					fileOutMsgQueue.put(
						new JSONObject()
						.put("type", "msg")
						.put("timestamp", timestamp)
						.put("msg", msg)
					);
				} catch (JSONException | InterruptedException e) {
					logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
				}
			}
		};
		this.listeners.put(scriptName, listener);
		fileOutMsgService.addTailingListener(scriptName, listener);
		
		Timer pollingTimer = new Timer();
		pollingTimer.schedule(new TimerTask() {
			@Override
			public void run() {
				for (int i = 0; i < fileOutMsgQueue.size(); i++) {
					JSONObject msg = fileOutMsgQueue.poll();
					if(msg != null) {
						sendMsg(msg.toString());
					}
				}
			}
		}, 1000, 100);
		pollingTimers.add(pollingTimer);
	}

	@OnWebSocketError
	public void handleError(Throwable e) {
		logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		
		if(session.isOpen())
			session.close();
	}

	private synchronized void sendMsg(String msg) {
		try{
			if(session.isOpen())
				session.getRemote().sendString(msg);
		} catch(IOException e){
			e.printStackTrace();
		}
	}

	public static class FileOutMsgWebSocketServlet extends WebSocketServlet {
		@Override
		public void configure(WebSocketServletFactory factory) {
			factory.register(FileOutMsgWebSocket.class);
		}
	}
}