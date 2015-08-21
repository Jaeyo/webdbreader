package com.igloosec.webdbreader.rdb;

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
	} //INIT

	public JsonJdbcTemplate(DataSource dataSource, boolean lazyInit) {
		super(dataSource, lazyInit);
	} //INIT

	public JsonJdbcTemplate(DataSource dataSource) {
		super(dataSource);
	} //INIT
	
	public JSONArray queryForJsonArray(String sql){
		return convertListMap2JsonArray(queryForList(sql));
	} //queryForJsonArray
	
	public JSONArray queryForJsonArray(String sql, Object... args){
		return convertListMap2JsonArray(queryForList(sql, args));
	} //queryForJsonArray
	
	private JSONArray convertListMap2JsonArray(List<Map<String, Object>> rows){
		JSONArray jsonArr = new JSONArray();
		for(Map<String, Object> row : rows){
			JSONObject rowJson = new JSONObject();
			Iterator<Entry<String, Object>> iter = row.entrySet().iterator();
			while(iter.hasNext()){
				Entry<String, Object> next = iter.next();
				String key = next.getKey();
				Object value = next.getValue();
				rowJson.put(key, value);
			} //while
			jsonArr.put(rowJson);
		} //for row
		return jsonArr;
	} //convertListMap2JsonArray
} //class