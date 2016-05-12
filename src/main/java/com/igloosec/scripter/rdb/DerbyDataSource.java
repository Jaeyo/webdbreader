package com.igloosec.scripter.rdb;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;

import org.apache.derby.jdbc.EmbeddedConnectionPoolDataSource;
import org.apache.log4j.Logger;

import com.igloosec.scripter.common.Conf;

public class DerbyDataSource implements Closeable {
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
		
		deferClose();
	}
	
	private void deferClose() {
		final DerbyDataSource self = this;
		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					self.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}));
	}
	
	public JsonJdbcTemplate getJdbcTmpl(){
		return new JsonJdbcTemplate(this.ds);
	}

	@Override
	public void close() throws IOException {
		this.ds.setShutdownDatabase("shutdown");
		try {
			this.ds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}