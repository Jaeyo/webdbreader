package com.igloosec.scripter.script.bindingsV2.headpipe;

import java.sql.Connection;
import java.sql.DriverManager;

import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.JsonJdbcTemplate;
import com.igloosec.scripter.rdb.SingleConnectionDataSource;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.script.bindingsV2.base.PipeHead;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class DBSelectPipe extends PipeHead {
	private static ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	
	private String driver = null;
	private String connUrl = null;
	private String username = null;
	private String password = null;
	private String query = null;
	
	public DBSelectPipe(NativeObject args) {
		this.driver = (String) args.get("driver");
		this.connUrl = (String) args.get("connUrl");
		this.username = (String) args.get("username");
		this.password = (String) args.get("password");
		this.query = (String) args.get("query");
	}
	
	@Override
	public void run() throws Exception {
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = DriverManager.getConnection(this.connUrl, this.username, this.password);
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			SqlRowSet result = jdbcTmpl.queryForRowSet(this.query);
	
			while(result.next()) {
				SqlRowSetMetaData metadata = result.getMetaData();
				int colCount = metadata.getColumnCount();
				Object[] valueArr = new Object[colCount];
				for (int i = 1; i <= colCount; i++)
					valueArr[i-1] = result.getObject(i);
				next(valueArr);
			}
			complete();
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.QUERY);
		} finally {
			if(conn != null) conn.close();
		}
	}
}