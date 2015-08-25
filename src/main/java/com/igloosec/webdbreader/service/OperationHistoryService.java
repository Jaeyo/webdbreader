package com.igloosec.webdbreader.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.dao.OperationHistoryDAO;

public class OperationHistoryService {
	private static final Logger logger = LoggerFactory.getLogger(OperationHistoryService.class);
	private OperationHistoryDAO operationHistoryDAO = SingletonInstanceRepo.getInstance(OperationHistoryDAO.class);
	
	public void saveStartupHistory(String scriptName){
		operationHistoryDAO.saveHistory(scriptName, true);
	} //saveStartupHistory
	
	public void saveShutdownHistory(String scriptName){
		operationHistoryDAO.saveHistory(scriptName, false);
	} //saveShutdownHistory
} //class