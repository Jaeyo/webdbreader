package com.igloosec.scripter.script.bindingsV2;

import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;
import com.igloosec.scripter.util.Util;

public class QueryResult {
	private static final ScriptLogger logger = ScriptThread.currentLogger();
	private static ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private SqlRowSet sqlRowSet;
	
	public QueryResult(SqlRowSet sqlRowSet) {
		this.sqlRowSet = sqlRowSet;
	}
	
	public Object get(NativeObject args) {
		int row = (Integer) args.get("row", args);
		Object col = args.get("col", args);
		
		boolean isRowExists = sqlRowSet.absolute(row);
		if(isRowExists == false) {
			logger.error("no row: " + row);
			return null;
		}
		
		if(col instanceof String) {
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
			return sqlRowSet.getObject((String) col);
		} else if(col instanceof Integer) {
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
			return sqlRowSet.getObject((Integer) col);
		} else {
			logger.error("invalid col type: " + col.getClass().toString());
			return null;
		}
	}
	
	public void eachRow(Function callback) {
		while(sqlRowSet.next() == true) {
			scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
			Util.invokeFunction(callback, new Object[]{ new QueryResultRow(this.sqlRowSet) });
		}
	}
	
	class QueryResultRow {
		SqlRowSet sqlRowSet;
		
		public QueryResultRow(SqlRowSet sqlRowSet) {
			this.sqlRowSet = sqlRowSet;
		}
		
		public String join(String delimiter) {
			SqlRowSetMetaData meta = this.sqlRowSet.getMetaData();
			int colCount = meta.getColumnCount();
			StringBuilder line = new StringBuilder();
			
			if(colCount == 0) return "";
			
			for (int i = 1; i <= colCount; i++) {
				line.append(this.sqlRowSet.getString(i));
				if(i != colCount) line.append(delimiter);
			}
			
			return line.toString();
		}
		
		public Object get(NativeObject args) {
			Object col = args.get("col", args);
			
			if(col instanceof String) {
				return sqlRowSet.getObject((String) col);
			} else if(col instanceof Integer) {
				return sqlRowSet.getObject((Integer) col);
			} else {
				logger.error("invalid col type: " + col.getClass().toString());
				return null;
			}
		}
	}
}