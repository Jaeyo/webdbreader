package com.igloosec.scripter.rdb;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.sql.DataSource;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.jdbc.core.JdbcTemplate;

public class JsonJdbcTemplate extends JdbcTemplate{

	public JsonJdbcTemplate() {
		super();
	}

	public JsonJdbcTemplate(DataSource dataSource, boolean lazyInit) {
		super(dataSource, lazyInit);
	}

	public JsonJdbcTemplate(DataSource dataSource) {
		super(dataSource);
	}
	
	public JSONArray queryForJsonArray(String sql) {
		return convertListMap2JsonArray(queryForList(sql));
	}
	
	public JSONArray queryForJsonArray(String sql, Object... args) {
		return convertListMap2JsonArray(queryForList(sql, args));
	}
	
	private JSONArray convertListMap2JsonArray(List<Map<String, Object>> rows) {
		JSONArray jsonArr = new JSONArray();
		for(Map<String, Object> row : rows){
			JSONObject rowJson = new JSONObject();
			Iterator<Entry<String, Object>> iter = row.entrySet().iterator();
			while(iter.hasNext()){
				Entry<String, Object> next = iter.next();
				String key = next.getKey();
				Object value = next.getValue();
				rowJson.put(key, value);
			}
			jsonArr.put(rowJson);
		}
		return jsonArr;
	}
}