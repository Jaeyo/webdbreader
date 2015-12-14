package com.igloosec.scripter.rdb;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.logging.Logger;

import javax.sql.DataSource;

public class SingleConnectionDataSource implements DataSource{
	private Connection conn;
	
	public SingleConnectionDataSource(Connection conn) {
		this.conn = conn;
	} //INIT
	
	@Override
	public Connection getConnection() throws SQLException {
		return this.conn;
	}

	@Override
	public Connection getConnection(String username, String password) throws SQLException {
		return this.conn;
	}

	@Override
	public PrintWriter getLogWriter() throws SQLException {
		return null;
	}

	@Override
	public void setLogWriter(PrintWriter out) throws SQLException {
		
	}

	@Override
	public void setLoginTimeout(int seconds) throws SQLException {
		
	}

	@Override
	public int getLoginTimeout() throws SQLException {
		return 0;
	}

	@Override
	public <T> T unwrap(Class<T> iface) throws SQLException {
		return null;
	}

	@Override
	public boolean isWrapperFor(Class<?> iface) throws SQLException {
		return false;
	}

	@Override
	public Logger getParentLogger() throws SQLFeatureNotSupportedException {
		return null;
	}
} //class