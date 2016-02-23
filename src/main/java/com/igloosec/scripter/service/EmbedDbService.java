package com.igloosec.scripter.service;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.dao.EmbedDbDAO;

public class EmbedDbService {
	private static final Logger logger = Logger.getLogger(EmbedDbService.class);
	private EmbedDbDAO embedDbDAO = SingletonInstanceRepo.getInstance(EmbedDbDAO.class);
	
	public JSONArray runQuery(String query){
		logger.info("query: " + query);
		
		String[] spliteds = query.split("\n");
		StringBuilder rebuildedQuery = new StringBuilder();
		for(String splited : spliteds){
			splited = splited.trim();
			if(splited.startsWith("--"))
				continue;
			rebuildedQuery.append(splited).append("\n");
		}
		
		query = rebuildedQuery.toString().trim();
		
		while(query.endsWith(";"))
			query = query.substring(0, query.length()-1);
		
		if(query.toLowerCase().startsWith("select")){
			return embedDbDAO.query(query);
		} else{
			embedDbDAO.execute(query);
			return new JSONArray().put(new JSONObject().put("success", 1));
		}
	}
}