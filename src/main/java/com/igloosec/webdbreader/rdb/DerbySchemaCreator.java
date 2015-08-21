package com.igloosec.webdbreader.rdb;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;

public class DerbySchemaCreator {
	
	public void check(){
		JdbcTemplate jdbcTmpl = new DerbyDataSource().getJdbcTmpl();
		
		checkSequence(jdbcTmpl);
		checkTables(jdbcTmpl);
	} //check
	
	private void checkSequence(JdbcTemplate jdbcTmpl){
		final Set<String> existingSequences = new HashSet<String>();
		
		jdbcTmpl.query("select sequencename from sys.syssequences", new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				existingSequences.add(rs.getString("sequencename"));
			} //processRow
		});
		
		if(existingSequences.contains("MAIN_SEQ") == false)
			jdbcTmpl.execute("create sequence main_seq");
	} //checkSequence
	
	private void checkTables(JdbcTemplate jdbcTmpl){
		final Set<String> existingTableNames = new HashSet<String>();

		jdbcTmpl.query("select tablename from sys.systables where tabletype='T'", new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				existingTableNames.add(rs.getString("tablename"));
			} //processRow
		});	
		
		if(existingTableNames.contains("SCRIPT") == false)
			jdbcTmpl.execute("create table script ( "
					+ "script_name varchar(100) not null primary key, "
					+ "script clob, "
					+ "memo long varchar, "
					+ "regdate timestamp not null )");
		
		if(existingTableNames.contains("FILEWRITE_STATISTICS") == false)
			jdbcTmpl.execute("create table filewrite_statistics ( "
					+ "script_name varchar(100) not null, "
					+ "count_timestamp timestamp not null, "
					+ "count_value integer not null )");
	} //checkTables
} // class