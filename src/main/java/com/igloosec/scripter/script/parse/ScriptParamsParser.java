package com.igloosec.scripter.script.parse;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.json.JSONObject;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.exception.ScriptNotParsableException;

public class ScriptParamsParser {
	private ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
				
	public JSONObject parseParams(String scriptName, String script) throws ScriptException, ScriptNotParsableException {
		String type = null;
		
		for(String line: script.split("\n")) {
			if(type == null) {
				type = parseType(line);
			} else if(type.startsWith("db2file")) {
				evalDb2FileLine(line);
			} else {
				throw new ScriptNotParsableException(String.format("%s, unknown type: %s", scriptName, type));
			}
		}
		
		JSONObject params = parseDb2FileVariable();
	
		if(type == null || params == null) 
			throw new ScriptNotParsableException("type or params is null");
		
		return params;
	}
	
	private String parseType(String line) throws ScriptException {
		if(line.startsWith("var type =") == false)
			return null;
		
		scriptEngine.eval(line);
		return (String) scriptEngine.get("type");
	}
	
	private void evalDb2FileLine(String line) throws ScriptException {
		if(line.startsWith("var dbVendor =") ||
			line.startsWith("var dbIp =") ||
			line.startsWith("var dbPort =") ||
			line.startsWith("var dbSid =") ||
			line.startsWith("var jdbcDriver =") ||
			line.startsWith("var jdbcConnUrl =") ||
			line.startsWith("var jdbcUsername =") ||
			line.startsWith("var jdbcPassword =") ||
			line.startsWith("var table =") ||
			line.startsWith("var columns =") ||
			line.startsWith("var bindingType =") ||
			line.startsWith("var bindingColumn =") ||
			line.startsWith("var period =") ||
			line.startsWith("var charset =") ||
			line.startsWith("var delimiter =") ||
			line.startsWith("var outputPath =")) {
			scriptEngine.eval(line);
		}
	}
	
	private JSONObject parseDb2FileVariable() throws ScriptNotParsableException {
		JSONObject variables = new JSONObject();
		variables.put("type", scriptEngine.get("type"));
		variables.put("dbVendor", scriptEngine.get("dbVendor"));
		variables.put("dbIp", scriptEngine.get("dbIp"));
		variables.put("dbPort", scriptEngine.get("dbPort"));
		variables.put("dbSid", scriptEngine.get("dbSid"));
		variables.put("jdbcDriver", scriptEngine.get("jdbcDriver"));
		variables.put("jdbcConnUrl", scriptEngine.get("jdbcConnUrl"));
		variables.put("jdbcUsername", scriptEngine.get("jdbcUsername"));
		variables.put("jdbcPassword", scriptEngine.get("jdbcPassword"));
		variables.put("table", scriptEngine.get("table"));
		variables.put("columns", scriptEngine.get("columns"));
		variables.put("bindingType", scriptEngine.get("bindingType"));
		variables.put("bindingColumn", scriptEngine.get("bindingColumn"));
		variables.put("period", scriptEngine.get("period"));
		variables.put("charset", scriptEngine.get("charset"));
		variables.put("delimiter", scriptEngine.get("delimiter"));
		variables.put("outputPath", scriptEngine.get("outputPath"));
		
		try {
			Preconditions.checkArgument(variables.isNull("dbVendor") == false, "dbVendor is null");
			Preconditions.checkArgument(variables.isNull("dbIp") == false, "dbIp is null");
			Preconditions.checkArgument(variables.isNull("dbPort") == false, "dbPort is null");
			Preconditions.checkArgument(variables.isNull("dbSid") == false, "dbSid is null");
			Preconditions.checkArgument(variables.isNull("jdbcDriver") == false, "jdbcDriver is null");
			Preconditions.checkArgument(variables.isNull("jdbcConnUrl") == false, "jdbcConnUrl is null");
			Preconditions.checkArgument(variables.isNull("jdbcUsername") == false, "jdbcUsername is null");
			Preconditions.checkArgument(variables.isNull("jdbcPassword") == false, "jdbcPassword is null");
			Preconditions.checkArgument(variables.isNull("table") == false, "table is null");
			Preconditions.checkArgument(variables.isNull("columns") == false, "columns is null");
			Preconditions.checkArgument(variables.isNull("bindingType") == false, "bindingType is null");
			if(variables.getString("bindingType").equals("simple") == false)
				Preconditions.checkArgument(variables.isNull("bindingColumn") == false, "bindingColumn is null");
			Preconditions.checkArgument(variables.isNull("period") == false, "period is null");
			Preconditions.checkArgument(variables.isNull("charset") == false, "charset is null");
			Preconditions.checkArgument(variables.isNull("delimiter") == false, "delimiter is null");
			Preconditions.checkArgument(variables.isNull("outputPath") == false, "outputPath is null");
		} catch(IllegalArgumentException e) {
			throw new ScriptNotParsableException(e.getMessage());
		}
		
		return variables;
	}
}