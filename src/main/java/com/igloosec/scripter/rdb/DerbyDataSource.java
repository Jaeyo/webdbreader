package com.igloosec.scripter.rdb;

import java.io.File;

import org.apache.derby.jdbc.EmbeddedConnectionPoolDataSource;
import org.apache.log4j.Logger;

import com.igloosec.scripter.common.Conf;

public class DerbyDataSource {
	private static Logger logger = Logger.getLogger(DerbyDataSource.class);
	private EmbeddedConnectionPoolDataSource ds;
		
	public DerbyDataSource(){
		String derbyPath = Conf.get(Conf.DERBY_PATH);
		if(derbyPath == null){
			derbyPath = new File(System.getProperty("java.io.tmpdir"), "derby").getAbsolutePath();
			logger.warn("derby.path is null, set to " + derbyPath);
		}
		
		this.ds = new EmbeddedConnectionPoolDataSource();
		this.ds.setDatabaseName(derbyPath);
		this.ds.setCreateDatabase("create");
		this.ds.setUser("");
		this.ds.setPassword("");
	}
	
	public JsonJdbcTemplate getJdbcTmpl(){
		return new JsonJdbcTemplate(this.ds);
	}
}