package com.igloosec.scripter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.ConnectException;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.igloosec.scripter.common.Conf;
import com.igloosec.scripter.exception.ScripterException;
import com.igloosec.scripter.util.Util;

import jline.TerminalFactory;
import jline.console.ConsoleReader;
import jline.console.completer.StringsCompleter;

public class InteractiveShell {
	public static final String CMD_STARTUP = "startup";
	public static final String CMD_SHUTDOWN = "shutdown";
	public static final String CMD_ADD_SCRIPT = "add-script";
	public static final String CMD_VIEW_SCRIPT = "view-script";
	public static final String CMD_EXPORT_SCRIPT = "export-script";
	public static final String CMD_SCRIPT_LIST = "script-list";
	public static final String CMD_REMOVE_SCRIPT = "remove-script";
	public static final String CMD_RENAME_SCRIPT = "rename-script";
	public static final String CMD_EDIT_SCRIPT = "edit-script";
	public static final String CMD_START_SCRIPT = "start-script";
	public static final String CMD_STOP_SCRIPT = "stop-script";
	public static final String CMD_HELP = "help";
	public static final String CMD_EXIT = "exit";
	public static final String CMD_QUIT = "quit";

	public static void main(String[] args) {
		try {
			if(Conf.isOpenJdk()) {
				System.err.println("ERR: OpenJDK not allowed, use another jdk");
				System.exit(-1);
			}
	
			ScripterConsoleReader console = new ScripterConsoleReader();
			try {
				boolean result = init(console);
				if(result == false) return;
			} catch(Exception e) {
				console.println(String.format("ERR: %s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
				return;
			}
			
			String line = null;
			while((line = console.readLine()) != null) {
				try {
					if(line.equalsIgnoreCase(CMD_STARTUP)) {
						Bootstrap.startup(null);
						console.println("startup scripter");
					} else if(line.equalsIgnoreCase(CMD_SHUTDOWN)) {
						Shutdown.shutdown();
						console.println("shutdown scripter");
					} else if(line.equalsIgnoreCase(CMD_ADD_SCRIPT)) {
						addScript(console);
					} else if(line.equalsIgnoreCase(CMD_VIEW_SCRIPT)) {
						viewScript(console);
					} else if(line.equalsIgnoreCase(CMD_EXPORT_SCRIPT)) {
						exportScript(console);
					} else if(line.equalsIgnoreCase(CMD_SCRIPT_LIST)) {
						list(console);
					} else if(line.equalsIgnoreCase(CMD_REMOVE_SCRIPT)) {
						removeScript(console);
					} else if(line.equalsIgnoreCase(CMD_RENAME_SCRIPT)) {
						renameScript(console);
					} else if(line.equalsIgnoreCase(CMD_EDIT_SCRIPT)) {
						editScript(console);
					} else if(line.equalsIgnoreCase(CMD_START_SCRIPT)) {
						startScript(console);
					} else if(line.equalsIgnoreCase(CMD_STOP_SCRIPT)) {
						stopScript(console);
					} else if(line.equalsIgnoreCase(CMD_HELP)) {
						console.println(help());
					} else if(line.equalsIgnoreCase(CMD_EXIT) || line.equalsIgnoreCase(CMD_QUIT)) {
						return;
					} else if(line.trim().length() == 0) {
						continue;
					} else {
						console.println("ERR: unknown cmd: " + line);
					}
				} catch(Exception e) {
					console.println(String.format("ERR: %s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
				}
			}
		} catch (IOException e) {
			System.err.println(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
			e.printStackTrace();
		} finally {
			try {
				TerminalFactory.get().restore();
			} catch (Exception e) {
				e.printStackTrace();
			}
			System.exit(0);
		}
	}
	
	static class ScripterConsoleReader extends ConsoleReader {
		static final String DEFAULT_PROMPT = "scripter> ";
		private Map<String, StringsCompleter> stringCompleters = Maps.newHashMap();
		
		public ScripterConsoleReader() throws IOException {
//			super(System.in, System.out);
			super();
			setPrompt(DEFAULT_PROMPT);
			
			addStringCompleter(CMD_STARTUP);
			addStringCompleter(CMD_SHUTDOWN);
			addStringCompleter(CMD_ADD_SCRIPT);
			addStringCompleter(CMD_VIEW_SCRIPT);
			addStringCompleter(CMD_EXPORT_SCRIPT);
			addStringCompleter(CMD_SCRIPT_LIST);
			addStringCompleter(CMD_REMOVE_SCRIPT);
			addStringCompleter(CMD_RENAME_SCRIPT);
			addStringCompleter(CMD_EDIT_SCRIPT);
			addStringCompleter(CMD_START_SCRIPT);
			addStringCompleter(CMD_STOP_SCRIPT);
			addStringCompleter(CMD_HELP);
			addStringCompleter(CMD_EXIT);
			addStringCompleter(CMD_QUIT);

		}

		public void addStringCompleter(String completer) {
			StringsCompleter stringCompleter = new StringsCompleter(completer);
			stringCompleters.put(completer, stringCompleter);
			addCompleter(stringCompleter);
		}
		
		public void removeStringCompleter(String completer) {
			StringsCompleter stringCompleter = stringCompleters.remove(completer);
			removeCompleter(stringCompleter);
		}
		
		@Override
		public String readLine() throws IOException {
			return super.readLine().trim();
		}

		public String readValueNotEmpty(String prompt) throws IOException, ScripterException {
			return readValueNotEmpty(prompt, "invalid input");
		}
		
		public String readValueNotEmpty(String prompt, String errmsg) throws IOException, ScripterException {
			setPrompt(prompt);
			try {
				String line = readLine();
				if(line == null || line.trim().length() == 0)
					throw new ScripterException(errmsg);
				return line;
			} finally {
				setPrompt(DEFAULT_PROMPT);
			}
		}
		
		public boolean readYesOrNo(String prompt) throws IOException, ScripterException {
			return readYesOrNo(prompt, "invalid input");
		}
		
		public boolean readYesOrNo(String prompt, String errmsg) throws IOException, ScripterException {
			setPrompt(prompt);
			try {
				String line = readLine();
				if(line.equalsIgnoreCase("y")) {
					return true;
				}
				return false;
			} finally {
				setPrompt(DEFAULT_PROMPT);
			}
		}
	}
	
	private static boolean init(ScripterConsoleReader console) throws IOException {
		try {
			List<JSONObject> scriptInfos = null;
			try {
				scriptInfos = list();
			} catch(ConnectException e) {
				boolean startScripter = console.readYesOrNo("scripter is not running, start scripter? [y/n] ");
				if(startScripter) {
					Bootstrap.startup(null);
					Thread.sleep(2 * 1000);
					scriptInfos = list();
				} else {
					return false;
				}
			}
			
			for (int i = 0; i < scriptInfos.size(); i++) {
				JSONObject scriptInfo = scriptInfos.get(i);
				console.addStringCompleter(scriptInfo.getString("SCRIPT_NAME"));
			}
			
			return true;
		} catch(Exception e) {
			console.println(String.format("ERR: %s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()));
			e.printStackTrace();
			return false;
		}
	}
	
	private static void addScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptFilename = console.readValueNotEmpty("script filename: ");
		String script = Util.readStringAndClose(new FileInputStream(scriptFilename));
		String scriptName = console.readValueNotEmpty("script name: ");
	
		console.println("script name: " + scriptName);
		console.println("script:\n " + script);
		boolean goahead = console.readYesOrNo("right? [y/n]");
		
		if(goahead == false) return;
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName));
		PostMethod postMethod = new PostMethod(url);
		postMethod.addParameter("script", script);
		new HttpClient().executeMethod(postMethod);
		
		if(postMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + postMethod.getStatusCode() + ", " + postMethod.getStatusText());
		
		JSONObject resp = new JSONObject(postMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
		
		console.println(scriptName + " added");
		console.addStringCompleter(scriptName);
	}
	
	private static void viewScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptName = console.readValueNotEmpty("script name: ");
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName));
		GetMethod getMethod = new GetMethod(url);
		new HttpClient().executeMethod(getMethod);
		
		if(getMethod.getStatusCode() != HttpStatus.SC_OK) {
			throw new ScripterException("ERR: " + getMethod.getStatusCode() + ", " + getMethod.getStatusText());
		}
		
		JSONObject resp = new JSONObject(getMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1) {
			console.println("ERR: " + resp.getString("errmsg"));
			return;
		}
		
		JSONObject scriptJson = resp.getJSONObject("script");
		String script = scriptJson.getString("SCRIPT");
		console.println("script: \n" + script);
	}
	
	private static void exportScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptName = console.readValueNotEmpty("script name: ");
	
		String url = String.format("http://localhost:%s/REST/Script/script/%s", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName));
		GetMethod getMethod = new GetMethod(url);
		new HttpClient().executeMethod(getMethod);
		
		if(getMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + getMethod.getStatusCode() + ", " + getMethod.getStatusText());
		
		JSONObject resp = new JSONObject(getMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1) {
			console.println("ERR: " + resp.getString("errmsg"));
			return;
		}
		
		JSONObject scriptJson = resp.getJSONObject("script");
		String script = scriptJson.getString("SCRIPT");
		
		File scriptFile = new File(scriptName + ".js");
		while(scriptFile.exists()) {
			scriptName += "(1)";
			scriptFile = new File(scriptName + ".js");
		}
		scriptFile.createNewFile();
		Util.writeAndClose(script, new FileOutputStream(scriptFile));
		
		console.println("exported filename: " + scriptFile.getName());
	}
	
	private static void list(ScripterConsoleReader console) throws ScripterException, IOException {
		List<JSONObject> scriptInfos = list();
		
		console.println("script count: " + scriptInfos.size());
		
		for (int i = 0; i < scriptInfos.size(); i++) {
			JSONObject scriptInfo = scriptInfos.get(i);
			console.println(String.format("\tscript: %s (running: %s)", scriptInfo.getString("SCRIPT_NAME"), scriptInfo.getBoolean("IS_RUNNING")));
		}
	}
	
	private static void removeScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptName = console.readValueNotEmpty("script name: ");
		boolean goahead = console.readYesOrNo("script name: " + scriptName + ", right? [y/n]");
		
		if(goahead == false) return;
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s/remove", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName));
		PostMethod postMethod = new PostMethod(url);
		new HttpClient().executeMethod(postMethod);
		
		if(postMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + postMethod.getStatusCode() + ", " + postMethod.getStatusText());
		
		JSONObject resp = new JSONObject(postMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
		
		console.println(scriptName + " removed");
		console.removeStringCompleter(scriptName);
	}
	
	private static void renameScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptName = console.readValueNotEmpty("script name: ");
		String newScriptName = console.readValueNotEmpty("new script name: ");
		boolean goahead = console.readYesOrNo("script name: " + scriptName + ", new script name: " + newScriptName + ", right? [y/n]");
		
		if(goahead == false) return;
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s/rename", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName));
		PostMethod postMethod = new PostMethod(url);
		postMethod.addParameter("newTitle", newScriptName);
		new HttpClient().executeMethod(postMethod);
		
		if(postMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + postMethod.getStatusCode() + ", " + postMethod.getStatusText());
		
		JSONObject resp = new JSONObject(postMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
	
		console.println(scriptName + " renamed to " + newScriptName);
		console.removeStringCompleter(scriptName);
		console.addStringCompleter(newScriptName);
	}
	
	private static void editScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptFilename = console.readValueNotEmpty("script file name: ");
		String scriptName = console.readValueNotEmpty("script name: ");
		String script = Util.readStringAndClose(new FileInputStream(scriptFilename));
		boolean goahead = console.readYesOrNo("script name: " + scriptName + ", script: \n" + script + "\n\nright? [y/n]");
		
		if(goahead == false) return;
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s/edit", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName));
		PostMethod postMethod = new PostMethod(url);
		postMethod.addParameter("script", script);
		new HttpClient().executeMethod(postMethod);
		
		if(postMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + postMethod.getStatusCode() + ", " + postMethod.getStatusText());
		
		JSONObject resp = new JSONObject(postMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
		
		console.println(scriptName + " edited");
	}
	
	private static List<JSONObject> list() throws ScripterException, IOException {
		String url = String.format("http://localhost:%s/REST/Script/scripts/info", Conf.getAs(Conf.PORT, 8098));
		GetMethod getMethod = new GetMethod(url);
		new HttpClient().executeMethod(getMethod);
		
		if(getMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + getMethod.getStatusCode() + ", " + getMethod.getStatusText());
		
		JSONObject resp = new JSONObject(getMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
		
		JSONArray scriptInfos = resp.getJSONArray("scriptInfos");
	
		List<JSONObject> scripts = Lists.newArrayList();
		for (int i = 0; i < scriptInfos.length(); i++) {
			JSONObject scriptInfo = scriptInfos.getJSONObject(i);
			scripts.add(scriptInfo);
		}
		return scripts;
	}
	
	private static void startScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptName = console.readValueNotEmpty("script name: ");
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s/start", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName)); 
		PostMethod postMethod = new PostMethod(url);
		new HttpClient().executeMethod(postMethod);
		
		if(postMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + postMethod.getStatusCode() + ", " + postMethod.getStatusText());
		
		JSONObject resp = new JSONObject(postMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
		
		console.println("start script " + scriptName + " success");
	}
	
	private static void stopScript(ScripterConsoleReader console) throws IOException, ScripterException {
		String scriptName = console.readValueNotEmpty("script name: ");
		
		String url = String.format("http://localhost:%s/REST/Script/script/%s/stop", Conf.getAs(Conf.PORT, 8098), Util.encodeURI(scriptName)); 
		PostMethod postMethod = new PostMethod(url);
		new HttpClient().executeMethod(postMethod);
		
		if(postMethod.getStatusCode() != HttpStatus.SC_OK)
			throw new ScripterException("ERR: " + postMethod.getStatusCode() + ", " + postMethod.getStatusText());
		
		JSONObject resp = new JSONObject(postMethod.getResponseBodyAsString());
		if(resp.getInt("success") != 1)
			throw new ScripterException(resp.getString("errmsg"));
		
		console.println("stop script " + scriptName + " success");
	}
	
	private static String help() {
		return "\tstartup: startup scripter\n" + 
				"\tshutdown: shutdown scripter\n" +
				"\tlist: get script list\n" +
				"\tstart-script <script_name>: send script start command to scripter\n" +
				"\tstop-script <script_name>: send script stop command to scripter\n";
	}
}