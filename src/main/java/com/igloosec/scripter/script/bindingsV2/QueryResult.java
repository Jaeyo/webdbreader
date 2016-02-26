package com.igloosec.scripter.script.bindingsV2;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;
import com.igloosec.scripter.util.Util;

public class QueryResult {
	private ScriptLogger logger = ScriptThread.currentLogger();
	private static ScriptScoreStatistics scriptScoreStatistics = SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
	private SqlRowSet sqlRowSet;
	
	public QueryResult(SqlRowSet sqlRowSet) {
		this.sqlRowSet = sqlRowSet;
	}
	
	public Object get(NativeObject args) {
		try {
			int row = 0;

			Object rowObj = args.get("row", args);
			if(rowObj instanceof Double) {
				row = ((Double) rowObj).intValue();
			} else if(rowObj instanceof String) {
				row = Integer.parseInt((String) rowObj);
			} else {
				row = (Integer) rowObj;
			}

			Object col = args.get("col", args);

			boolean isRowExists = sqlRowSet.absolute(row);
			if(isRowExists == false) {
				logger.error(String.format("no row: %s", row));
				return null;
			}

			if(col instanceof String) {
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
				return sqlRowSet.getObject((String) col);
			} else if(col instanceof Double) {
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
				return sqlRowSet.getObject(((Double) col).intValue());
			} else if(col instanceof Integer) {
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
				return sqlRowSet.getObject((Integer) col);
			} else {
				logger.error(String.format("invalid col type: %s", col.getClass().toString()));
				return null;
			}
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		}
	}

	public void eachRow(Function callback) {
		try {
			while(sqlRowSet.next() == true) {
				scriptScoreStatistics.incrementCount(ScriptScoreStatistics.INPUT);
				Util.invokeFunction(callback, new QueryResultRow[]{ new QueryResultRow(this.sqlRowSet) });
			}
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
}