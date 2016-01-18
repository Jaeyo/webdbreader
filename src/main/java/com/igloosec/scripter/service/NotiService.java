package com.igloosec.scripter.service;

import java.util.List;

import com.google.common.collect.Lists;
import com.igloosec.scripter.servlet.NotiWebSocket;

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
//			notiWebSocket.sendErrorLogNotiMsg(scriptName, msg);
		}
	}
	
	public void sendScriptEndNoti(String scriptName) {
		for(NotiWebSocket notiWebSocket: notiWebSockets) {
//			notiWebSocket.sendScriptEndNotiMsg(scriptName);
		}
	}
}