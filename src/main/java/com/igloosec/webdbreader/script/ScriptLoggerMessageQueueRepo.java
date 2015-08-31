package com.igloosec.webdbreader.script;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.LinkedBlockingQueue;

import com.google.common.collect.LinkedListMultimap;
import com.igloosec.webdbreader.common.Conf;
import com.igloosec.webdbreader.exception.NotExistsException;
import com.igloosec.webdbreader.servlet.LoggerWebSocket.SendFunction;

public class ScriptLoggerMessageQueueRepo {
	private LinkedListMultimap<String, ScriptLoggerMessageQueue> mqs = LinkedListMultimap.create();

	public UUID listen(String scriptName, SendFunction sendFunc){
		UUID uuid = UUID.randomUUID();
		ScriptLoggerMessageQueue mq = new ScriptLoggerMessageQueue(scriptName, uuid, sendFunc);
		
		synchronized (mqs) {
			mqs.put(scriptName, mq);
		} //sync
		
		return uuid;
	} //listen
	
	public void unlisten(String scriptName, UUID uuid) throws NotExistsException{
		synchronized (mqs) {
			List<ScriptLoggerMessageQueue> mqList = mqs.get(scriptName);
			if(mqList == null)
				throw new NotExistsException(scriptName);

			Integer foundIndex = null;
			for (int i = 0; i < mqList.size(); i++) {
				if(mqList.get(i).getUuid().equals(uuid)){
					foundIndex = i;
					break;
				} //if
			} //for i
			
			if(foundIndex == null)
				throw new NotExistsException(String.format("%s, %s", scriptName, uuid.toString()));
			
			mqList.remove(foundIndex.intValue()).close();;
		} //sync
	} //unlisten
	
	public void pushMsg(String scriptName, String msg) {
		List<ScriptLoggerMessageQueue> mqList = mqs.get(scriptName);
		if(mqList != null) {
			for(ScriptLoggerMessageQueue mq : mqList)
				mq.pushMsg(msg);
		} //if
	} //pushMsg

	public class ScriptLoggerMessageQueue { 
		private String scriptName;
		private UUID uuid;
		private LinkedBlockingQueue<String> queue = new LinkedBlockingQueue<String>(Conf.getAs(Conf.SCRIPT_LOGGER_WEBSOCKET_QUEUE_SIZE, 512));
		private Thread pollingThread;

		public ScriptLoggerMessageQueue(String scriptName, UUID uuid, final SendFunction sendFunc) {
			this.scriptName = scriptName;
			this.uuid = uuid;
			
			this.pollingThread = new Thread(){
				@Override
				public void run() {
					try {
						for(;;){
							sendFunc.send(queue.take());
						} //for ;;
					} catch (InterruptedException e) {} //catch
				} //run
			};
			this.pollingThread.start();
		} //INIT

		public String getScriptName() {
			return scriptName;
		}

		public UUID getUuid() {
			return uuid;
		}

		public void pushMsg(String msg) {
			queue.add(msg);
		} //enqueueMsg
		
		public void close() {
			this.pollingThread.interrupt();
		} //close
	} // class
} // class