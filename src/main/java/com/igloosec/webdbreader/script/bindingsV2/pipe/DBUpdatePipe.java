package com.igloosec.webdbreader.script.bindingsV2.pipe;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

import com.igloosec.webdbreader.rdb.JsonJdbcTemplate;
import com.igloosec.webdbreader.rdb.SingleConnectionDataSource;
import com.igloosec.webdbreader.script.ScriptThread;
import com.igloosec.webdbreader.script.bindingsV2.base.Pipe;
import com.igloosec.webdbreader.script.bindingsV2.base.PipeHead;

public class DBUpdatePipe extends Pipe {
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
			} else {
				jdbcTmpl.update(data.toString());
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
