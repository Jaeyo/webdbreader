package com.igloosec.webdbreader.dao;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class EmbedDbDAO {
	private static final Logger logger = LoggerFactory.getLogger(EmbedDbDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public JSONArray query(String query){
		logger.info("query: {}", query);
		return ds.getJdbcTmpl().queryForJsonArray(query);
	} //runQuery
	
	public void execute(String query){
		logger.info("query: {}", query);
		ds.getJdbcTmpl().execute(query);
	} //execute
}  //class