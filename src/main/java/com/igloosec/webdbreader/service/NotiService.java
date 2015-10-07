package com.igloosec.webdbreader.service;

import java.util.List;

import com.google.common.collect.Lists;
import com.igloosec.webdbreader.servlet.NotiWebSocket;

public class NotiService {
	private List<NotiWebSocket> notiWebSockets = Lists.newArrayList();
	
	public void addNotiWebSocket(NotiWebSocket notiWebSocket) {
		notiWebSockets.add(notiWebSocket);
	}
	
	public void removeNotiWebSocket(NotiWebSocket notiWebSocket) {
		notiWebSockets.remove(notiWebSocket);
	}
	
	public void sendErrorLogNoti(String scriptName, String msg) {
		for(NotiWebSocket notiWebSocket: notiWebSockets) {
			notiWebSocket.sendErrorLogNotiMsg(scriptName, msg);
		}
	}
}