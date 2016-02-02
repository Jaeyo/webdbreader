package com.igloosec.scripter.dao;

import org.json.JSONArray;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class EmbedDbDAO {
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public JSONArray query(String query){
		return ds.getJdbcTmpl().queryForJsonArray(query);
	}
	
	public void execute(String query){
		ds.getJdbcTmpl().execute(query);
	}
}