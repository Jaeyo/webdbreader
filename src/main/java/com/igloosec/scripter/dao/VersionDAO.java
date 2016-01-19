package com.igloosec.scripter.dao;

import java.util.Date;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class VersionDAO {
	private static final Logger logger = LoggerFactory.getLogger(VersionDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public String getLastVersion() {
		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("SELECT version, MAX(regdate) FROM version GROUP BY (version)");
		if(result == null || result.length() == 0) 
			return null;
		return result.getJSONObject(0).getString("VERSION");
	}
	
	public void insertVersion(String version) {
		ds.getJdbcTmpl().update("insert into version (version, regdate) values(?, ?)", version, new Date());
	}
}