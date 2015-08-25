package com.igloosec.webdbreader.dao;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class OperationHistoryDAO {
	public static final int HISTORY_LIMIT = 1000;
	private static final Logger logger = LoggerFactory.getLogger(OperationHistoryDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void saveHistory(String scriptName, boolean isStartup){
		ds.getJdbcTmpl().update("INSERT INTO operation_history (regdate, script_name, is_startup) VALUES(?, ?, ?)", new Date(), scriptName, isStartup);
		removeOldestHistoryIfLimit(scriptName);
	} //saveHistory
	
	private void removeOldestHistoryIfLimit(String scriptName){
		int count = ds.getJdbcTmpl().queryForObject("SELECT count(*) FROM operation_history WHERE script_name = ?", new Object[]{ scriptName }, Integer.class);
		if(count >= HISTORY_LIMIT)
			ds.getJdbcTmpl().update("DELETE FROM operation_history "
					+ "WHERE script_name = ? "
					+ "AND regdate <= (SELECT MIN(regdate) FROM operation_history WHERE script_name = ?)", scriptName, scriptName);
	} //removeOldestHistoryIfLimit
} //class