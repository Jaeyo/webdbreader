package com.igloosec.scripter.script.parse;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.common.base.Preconditions;
import com.igloosec.scripter.exception.CryptoException;
import com.igloosec.scripter.exception.ScriptNotParsableException;
import com.igloosec.scripter.util.SimpleCrypto;

public class ScriptParamsParser {
	private ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
	
	public JSONObject parseParams(String scriptName, String script) throws ScriptException, ScriptNotParsableException, JSONException, CryptoException {
		String type = null;
		
		for(String line: script.split("\n")) {
			if(type == null) {
				type = parseType(line);
				continue;
			}
			
			if(type.startsWith("db2file")) {
				evalDb2FileLine(line);
			} else {
				throw new ScriptNotParsableException(String.format("%s, unknown type: %s", scriptName, type));
			}
		}
	
		if(type == null) throw new ScriptNotParsableException("type or params is null");
		
		JSONObject params = parseDb2FileVariable();
		
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
	
	private JSONObject parseDb2FileVariable() throws ScriptNotParsableException, JSONException, CryptoException {
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
		variables.put("period", makeReadablePeriod(Math.round((Double) scriptEngine.get("period"))));
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
		
		variables.put("jdbcUsername", SimpleCrypto.decrypt(variables.getString("jdbcUsername")));
		variables.put("jdbcPassword", SimpleCrypto.decrypt(variables.getString("jdbcPassword")));
		
		return variables;
	}
	
	public static String makeReadablePeriod(long period) {
		long day = 24 * 60 * 60 * 1000;
		long hour = 60 * 60 * 1000;
		long min = 60 * 1000;
		long sec = 1000;
		
		if(period >= day && period % day == 0)
			return (period / day) + " * 24 * 60 * 60 * 1000";
		else if(period >= hour && period % hour == 0)
			return (period / hour) + " * 60 * 60 * 1000";
		else if(period >= min && period % min == 0)
			return (period / min) + " * 60 * 1000";
		else 
			return (period / sec) + " * 1000";
	}
}