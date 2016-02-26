package com.igloosec.scripter.script.bindingsV2;

import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import sun.org.mozilla.javascript.internal.Function;
import sun.org.mozilla.javascript.internal.NativeObject;

import com.igloosec.scripter.script.ScriptLogger;
import com.igloosec.scripter.script.ScriptThread;

public class QueryResultRow {
	private ScriptLogger logger = ScriptThread.currentLogger();
	private SqlRowSet sqlRowSet;

	public QueryResultRow(SqlRowSet sqlRowSet) {
		this.sqlRowSet = sqlRowSet;
	}

	public String join(String delimiter) {
		try {
			SqlRowSetMetaData meta = this.sqlRowSet.getMetaData();
			int colCount = meta.getColumnCount();
			StringBuilder line = new StringBuilder();

			if(colCount == 0) return "";

			for (int i = 1; i <= colCount; i++) {
				line.append(this.sqlRowSet.getString(i));
				if(i != colCount) line.append(delimiter);
			}

			return line.toString();
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			return null;
		}
	}

	public Object get(NativeObject args) {
		try {
			Object col = args.get("col", args);

			if(col instanceof String) {
				return sqlRowSet.getObject((String) col);
			} else if(col instanceof Double) {
				return sqlRowSet.getObject(((Double) col).intValue());
			} else if(col instanceof Integer) {
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

	public void eachColumn(Function callback) {
		try {
			int colCount = sqlRowSet.getMetaData().getColumnCount();
			for (int i = 1; i <= colCount; i++) {
				com.igloosec.scripter.util.Util.invokeFunction(callback, new Object[]{ sqlRowSet.getObject(i) });
			}
		} catch(Exception e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
		}
	}
}
