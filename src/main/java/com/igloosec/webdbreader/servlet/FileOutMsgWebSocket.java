package com.igloosec.webdbreader.servlet;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
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
import com.google.common.collect.Queues;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.exception.NotExistsException;
import com.igloosec.webdbreader.script.ScriptExecutor;
import com.igloosec.webdbreader.script.ScriptMessageQueueRepo;
import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.script.bindings.FileWriterFactory.FileOutListener;
import com.igloosec.webdbreader.script.bindings.FileWriterFactory.FileWriter;

@WebSocket
public class FileOutMsgWebSocket {
	private static final Logger logger = LoggerFactory.getLogger(FileOutMsgWebSocket.class);
	private ScriptExecutor scriptExecutor = SingletonInstanceRepo.getInstance(ScriptExecutor.class);
	private Session session;
	private Timer pollingTimer = new Timer();
	
	private List<FileWriter> tailingFilewriters = Lists.newArrayList();
	private List<FileOutListener> fileOutListeners = Lists.newArrayList();
	
	@OnWebSocketConnect
	public void handleConnect(Session session) {
		this.session = session;
	}
	
	@OnWebSocketClose
	public void handleClose(int statusCode, String reason) {
		logger.info("statusCode: {}, reason: {}", statusCode, reason);
		pollingTimer.cancel();
		
		for(FileWriter fileWriter : this.tailingFilewriters) {
			for(FileOutListener listener: fileOutListeners) {
				fileWriter.unlistenFileOut(listener);
			}
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
			case "init-tail" :
				initTail(msgObj);
				break;
			case "start-tail" :
				startTail(msgObj);
				break;
		}
	}
	
	private void initTail(JSONObject msg) {
		String scriptName = msg.getString("scriptName");
		ScriptThread scriptThread = scriptExecutor.getScriptThread(scriptName);
		if(scriptThread == null) {
			logger.warn(String.format("script(%s) not running", scriptName));
			sendMsg(
				new JSONObject()
				.put("type", "init-tail-resp")
				.put("success", 0)
				.put("errmsg", "script not running").toString()
			);
			return;
		}
		
		sendMsg(
			new JSONObject()
			.put("type", "init-tail-resp")
			.put("success", 1).toString()
		);
	}
	
	private void startTail(JSONObject msg) {
		String scriptName = msg.getString("scriptName");
		ScriptThread scriptThread = scriptExecutor.getScriptThread(scriptName);
		this.tailingFilewriters = scriptThread.getFileWriters();
		final LinkedBlockingQueue<JSONObject> fileOutMsgQueue = Queues.newLinkedBlockingQueue();
		
		for(FileWriter fileWriter : this.tailingFilewriters) {
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

			fileWriter.listenFileOut(listener);
			fileOutListeners.add(listener);
		}
		
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
	}

	@OnWebSocketError
	public void handleError(Throwable e) {
		logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		pollingTimer.cancel();
		if(session.isOpen())
			session.close();
	}

	private void sendMsg(String msg) {
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