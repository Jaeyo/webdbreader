package com.igloosec.scripter.script.bindings_pipe_OLD.pipe;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.JsonJdbcTemplate;
import com.igloosec.scripter.rdb.SingleConnectionDataSource;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.Pipe;
import com.igloosec.scripter.script.bindings_pipe_OLD.base.PipeHead;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class DBUpdatePipe extends Pipe {
	private static ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	
	private String driver = null;
	private String connUrl = null;
	private String username = null;
	private String password = null;
	
	public DBUpdatePipe(PipeHead pipeHead, String driver, String connUrl, String username, String password) throws ClassNotFoundException {
		super(pipeHead);
		this.driver = driver;
		this.connUrl = connUrl;
		this.username = username;
		this.password = password;
	}

	@Override
	public void onNext(Object data) throws Exception {
		Connection conn = null;
		try {
			Class.forName(this.driver);
			conn = DriverManager.getConnection(this.connUrl, this.username, this.password);
			JsonJdbcTemplate jdbcTmpl = new JsonJdbcTemplate(new SingleConnectionDataSource(conn));
			
			if(data instanceof List) {
				List<Object> list = (List<Object>) data;
				String[] queries = list.toArray(new String[list.size()]);
				jdbcTmpl.batchUpdate(queries);
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.OUTPUT, queries.length);
			} else {
				jdbcTmpl.update(data.toString());
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.OUTPUT);
			}
		} finally {
			if(conn != null) conn.close();
		}
	}
	
	@Override
	public void onComplete() {
	}

	@Override
	public void onException(Exception e) {
	}
}
