package com.igloosec.scripter.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowCallbackHandler;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbyDataSource;

public class MainDAO {
	private static final Logger logger = LoggerFactory.getLogger(MainDAO.class);
	private DerbyDataSource ds = SingletonInstanceRepo.getInstance(DerbyDataSource.class);
	
	public void addNewTask(String label, String title){
		logger.info("label: {}, title: {}", label, title);
		ds.getJdbcTmpl().update("insert into task (sequence, title, label, regdate) values(next value for main_seq, ?, ?, ?)", title, label, new Date());
	} //addNewTask
	
	public void deleteTask(long sequence){
		logger.info("sequence: {}", sequence);
		ds.getJdbcTmpl().update("delete from task where sequence = ?", sequence);
		ds.getJdbcTmpl().update("delete from task_history where task_sequence = ?", sequence);
	} //deleteTask
	
	public void deleteTaskHistory(long sequence){
		logger.info("sequence: {}", sequence);
		ds.getJdbcTmpl().update("delete from task_history where sequence = ?", sequence);
	} //deleteTaskHistory
	
	public void addTaskHistory(String label, long sequence, String content){
		logger.info("label: {}, sequence: {}, content: {}", label, sequence, content);
		Long historySequence = nextSequence();
		ds.getJdbcTmpl().update("insert into task_history (sequence, task_sequence, content, regdate) "
				+ "values (?, ?, ?, ?)", historySequence, sequence, content, new Date());
	} //addTaskHistory
	
	public void addTaskReHistory(String label, long parentHistorySequence, String content){
		logger.info("label: {}, historySequence: {}, content: {}", label, parentHistorySequence, content);
		Long taskSequence = ds.getJdbcTmpl().queryForObject("select task_sequence from task_history where sequence = ?", new String[]{ parentHistorySequence+"" }, Long.class);
		Long historySequence = nextSequence();
		ds.getJdbcTmpl().update("insert into task_history (sequence, task_sequence, content, regdate) "
				+ "values (?, ?, ?, ?)", historySequence, taskSequence, content, new Date());
	} //addtaskReHistory
	
	public void setTaskLabel(long sequence, String label){
		logger.info("sequence: {}, label: {}", sequence, label);
		ds.getJdbcTmpl().update("update task set label = ? where sequence = ?", label, sequence);
	} //setTaskLabel
	
	public void editTaskHistory(long sequence, String content){
		logger.info("sequence: {}, content: {}", sequence, content);
		ds.getJdbcTmpl().update("update task_history set content = ?, regdate = ? where sequence = ?", content, new Date(), sequence);
	} //editTaskHistory
	
	public void editTaskTitle(long sequence, String title){
		logger.info("sequence: {}, title: {}", sequence, title);
		ds.getJdbcTmpl().update("update task set title = ? where sequence = ?", title, sequence);
	} //editTaskTitle
	
	public JSONArray getAllTasks(String label){
		logger.info("label: {}", label);
		
		final Map<Long, JSONObject> taskRowsMap = new HashMap<Long, JSONObject>();
		String query = "select sequence , title, regdate from task where label = ? order by sequence";
		final SimpleDateFormat fullFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		ds.getJdbcTmpl().query(query, new String[]{ label }, new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				JSONObject row = new JSONObject();
				Long sequence = rs.getLong("sequence");
				row.put("task_sequence", sequence);
				row.put("title", rs.getString("title"));
				row.put("task_regdate", fullFormat.format(new Date(rs.getTimestamp("regdate").getTime())));
				row.put("histories", new JSONArray());
				taskRowsMap.put(sequence, row);
			} //processRow
		});
		
		final SimpleDateFormat mmddFormat = new SimpleDateFormat("MMdd");
		query = "select th.sequence, th.task_sequence, th.content, th.regdate "
				+ "from task t, task_history th "
				+ "where t.sequence = th.task_sequence "
				+ "and t.label = ? "
				+ "order by th.sequence ";
		ds.getJdbcTmpl().query(query, new String[]{ label }, new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				JSONObject taskRow = taskRowsMap.get(rs.getLong("task_sequence"));
				if(taskRow == null) return;
				JSONObject historyJson = new JSONObject();
				historyJson.put("history_sequence", rs.getLong("sequence"));
				historyJson.put("content", rs.getString("content"));
				historyJson.put("history_regdate", mmddFormat.format(new Date(rs.getTimestamp("regdate").getTime())));
				taskRow.getJSONArray("histories").put(historyJson);
			} //processRow
		});
	
		JSONArray retJsonArr = new JSONArray();
		for(JSONObject taskRow : taskRowsMap.values())
			retJsonArr.put(taskRow);
		return retJsonArr;
	} //getAllTasks
	
	private JSONArray convertListMap2JsonArray(List<Map<String, Object>> rows){
		JSONArray rowsJsonArr = new JSONArray();
		
		for(Map<String, Object> row : rows){
			JSONObject rowJson = new JSONObject();
			Iterator<Entry<String, Object>> iter = row.entrySet().iterator();
			while(iter.hasNext()){
				Entry<String, Object> next = iter.next();
				String key = next.getKey();
				Object value = next.getValue();
				rowJson.put(key, value);
			} //while
			rowsJsonArr.put(rowJson);
		} //for row
		
		return rowsJsonArr;
	} //convertListMap2JsonArray
	
	private Long nextSequence(){
		return ds.getJdbcTmpl().queryForObject("select next value for main_seq from SYSIBM.SYSDUMMY1", Long.class);
	} //nextSequence
} //class