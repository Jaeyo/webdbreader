package com.igloosec.webdbreader.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;

import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbyDataSource;

public class SimpleRepoDAO {
	private static final Logger logger = LoggerFactory.getLogger(SimpleRepoDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void insert(String scriptName, String key, String value) {
		ds.getJdbcTmpl().update("INSERT INTO simple_repo (script_name, simple_repo_key, simple_repo_value) VALUES(?, ?, ?)", scriptName, key, value);
	} //insert
	
	public void update(String scriptName, String key, String value) {
		ds.getJdbcTmpl().update("UPDATE simple_repo SET simple_repo_value = ? WHERE script_name = ? AND simple_repo_key = ?", value, scriptName, key);
	} //update
	
	public boolean isExists(String scriptName, String key) {
		return 1 == ds.getJdbcTmpl().queryForObject("SELECT COUNT(*) "
				+ "FROM simple_repo WHERE script_name = ? AND simple_repo_key = ?", 
				new Object[]{ scriptName, key}, Integer.class);
	} //isExists
	
	public String select(String scriptName, String key) {
		try{
			return ds.getJdbcTmpl().queryForObject("SELECT simple_repo_value FROM simple_repo "
					+ "WHERE script_name = ? AND simple_repo_key = ?", 
					new Object[]{scriptName, key}, String.class);
		} catch(EmptyResultDataAccessException e) {
			return null;
		} //catch
	} //select
	
	public void delete(String scriptName) {
		ds.getJdbcTmpl().update("DELETE FROM simple_repo WHERE script_name = ?", scriptName);
	} //delete
} //class