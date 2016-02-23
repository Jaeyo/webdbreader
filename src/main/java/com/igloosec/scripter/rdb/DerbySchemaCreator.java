package com.igloosec.scripter.rdb;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.springframework.jdbc.core.RowCallbackHandler;

import com.google.common.collect.Sets;
import com.igloosec.scripter.Version;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.VersionDAO;

public class DerbySchemaCreator {
	private static final Logger logger = Logger.getLogger(DerbySchemaCreator.class);
	  
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void check(){
		checkSequence();
		checkTables();
		checkConfig();
		checkVersion();
	}
	
	private void checkSequence(){
		logger.info("check sequence...");
		
		final Set<String> existingSequences = new HashSet<String>();
		ds.getJdbcTmpl().query("SELECT sequencename FROM sys.syssequences", new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				existingSequences.add(rs.getString("sequencename"));
			}
		});
		
		if(existingSequences.contains("MAIN_SEQ") == false)
			ds.getJdbcTmpl().execute("CREATE SEQUENCE main_seq");
	}
	
	private void checkVersion() {
		logger.info("check version...");
		
		String lastVersion = new VersionDAO().getLastVersion();
		String currentVersion = Version.getCurrentVersion();
		
		if(lastVersion == null || Version.isANewerThanB(currentVersion, lastVersion)) {
			new VersionDAO().insertVersion(currentVersion);
			logger.info(String.format("old version(%s) replaced with new version(%s)", lastVersion, currentVersion));
		}
	}
	
	private void checkTables(){
		logger.info("check tables...");
		
		Set<String> existingTableNames = Sets.newHashSet();

		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("SELECT tablename FROM sys.systables WHERE tabletype='T'");
		for (int i = 0; i < result.length(); i++)
			existingTableNames.add(result.getJSONObject(i).getString("TABLENAME"));
		
		if(existingTableNames.contains("SCRIPT") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE script ( "
					+ "script_name VARCHAR(100) NOT NULL PRIMARY KEY, "
					+ "script CLOB, "
					+ "regdate TIMESTAMP NOT NULL )");
		
		if(existingTableNames.contains("SCRIPT_SCORE_STATISTICS") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE script_score_statistics ( "
					+ "category VARCHAR(50) NOT NULL, "
					+ "script_name VARCHAR(100) NOT NULL, "
					+ "count_timestamp TIMESTAMP NOT NULL, "
					+ "count_value INTEGER NOT NULL )");
		
		if(existingTableNames.contains("AUTO_START_SCRIPT") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE auto_start_script ( "
					+ "script_name VARCHAR(100) PRIMARY KEY, "
					+ "regdate TIMESTAMP NOT NULL )");
		
		if(existingTableNames.contains("CONFIG") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE config ( "
					+ "config_key VARCHAR(50) NOT NULL PRIMARY KEY, "
					+ "config_value VARCHAR(50) NOT NULL )");
		
		if(existingTableNames.contains("SIMPLE_REPO") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE simple_repo ( "
					+ "script_name VARCHAR(100) NOT NULL , "
					+ "simple_repo_key VARCHAR(255) NOT NULL , "
					+ "simple_repo_value VARCHAR(255) NOT NULL )");
		
		if(existingTableNames.contains("OPERATION_HISTORY") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE operation_history ( "
					+ "regdate TIMESTAMP NOT NULL, "
					+ "script_name VARCHAR(100) NOT NULL, "
					+ "is_startup BOOLEAN NOT NULL )");
		
		if(existingTableNames.contains("VERSION") == false)
			ds.getJdbcTmpl().execute("CREATE TABLE version ( "
					+ "version VARCHAR(30) NOT NULL, "
					+ "regdate TIMESTAMP NOT NULL ) ");
	}
	
	private void checkConfig() {
		logger.info("check config...");
		
		Set<String> existingConfigKeys = Sets.newHashSet();
		JSONArray result = ds.getJdbcTmpl().queryForJsonArray("SELECT config_key FROM config");
		for (int i = 0; i < result.length(); i++)
			existingConfigKeys.add(result.getJSONObject(i).getString("CONFIG_KEY"));
		
		if(existingConfigKeys.contains("enable.tail") == false)
			ds.getJdbcTmpl().update("INSERT INTO config (config_key, config_value) VALUES('enable.tail', 'true')");
	}
}