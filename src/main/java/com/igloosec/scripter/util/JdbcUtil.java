package com.igloosec.scripter.util;

import java.sql.Types;

public class JdbcUtil {
	public static String convertDataTypeCode2String(int code){
		switch(code){
		case Types.BIT: return "bit";
		case Types.TINYINT: return "tinyint";
		case Types.SMALLINT: return "smallint";
		case Types.INTEGER: return "integer";
		case Types.BIGINT: return "bigint";
		case Types.FLOAT: return "float";
		case Types.REAL: return "real";
		case Types.DOUBLE: return "double";
		case Types.NUMERIC: return "numeric";
		case Types.DECIMAL: return "decimal";
		case Types.CHAR: return "char";
		case Types.VARCHAR: return "varchar";
		case Types.LONGVARCHAR: return "longvarchar";
		case Types.DATE: return "date";
		case Types.TIME : return "time";
		case Types.TIMESTAMP: return "timestamp";
		case Types.BINARY: return "binary";
		case Types.VARBINARY: return "varbinary";
		case Types.LONGVARBINARY: return "longvarbinary";
		case Types.NULL: return "null";
		case Types.OTHER: return "other";
		case Types.JAVA_OBJECT: return "java_object";
		case Types.DISTINCT: return "distinct";
		case Types.STRUCT: return "struct";
		case Types.ARRAY: return "array";
		case Types.BLOB: return "blob";
		case Types.CLOB: return "clob";
		case Types.REF: return "ref";
		case Types.DATALINK: return "datalink";
		case Types.BOOLEAN: return "boolean";
		case Types.ROWID: return "rowid";
		case Types.NCHAR: return "nchar";
		case Types.NVARCHAR: return "nvarchar";
		case Types.LONGNVARCHAR: return "longnvarchar";
		case Types.NCLOB: return "nclob";
		case Types.SQLXML: return "sqlxml";
		default: return "unknown";
		} //switch	
	} //convertDataTypeCode2String
} //class