package com.igloosec.scripter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.igloosec.scripter.common.Conf;
import com.igloosec.scripter.util.HttpUtil;

import jline.TerminalFactory;
import jline.console.ConsoleReader;
import jline.console.completer.StringsCompleter;

public class InteractiveShell {
	private static final Logger logger = Logger.getLogger(Bootstrap.class);
	public static final String CMD_STARTUP = "startup";
	public static final String CMD_SHUTDOWN= "shutdown";
	public static final String CMD_LIST = "list";
	public static final String CMD_START_SCRIPT= "start-script";
	public static final String CMD_STOP_SCRIPT = "stop-script";
	public static final String CMD_HELP = "help";
	public static final String CMD_EXIT = "exit";
	public static final String CMD_QUIT= "quit";
	
	public static void main(String[] args) {
		try {
			if(Conf.isOpenJdk()) {
				System.err.println("ERR: OpenJDK not allowed, use another jdk");
				System.exit(-1);
			}
			
			ScripterConsoleReader console = new ScripterConsoleReader();
			String line = null;
			while((line = console.readLine()) != null) {
				if(line.equalsIgnoreCase(CMD_STARTUP)) {
					Bootstrap.startup(null);
					console.println("startup scripter");
				} else if(line.equalsIgnoreCase(CMD_SHUTDOWN)) {
					Shutdown.shutdown();
					console.println("shutdown scripter");
				} else if(line.equalsIgnoreCase(CMD_LIST)) {
					console.println(list());
				} else if(line.equalsIgnoreCase(CMD_START_SCRIPT)) {
					console.println(startScript(line));
				} else if(line.equalsIgnoreCase(CMD_STOP_SCRIPT)) {
					console.println(stopScript(line));
				} else if(line.equalsIgnoreCase(CMD_HELP)) {
					console.println(help());
				} else if(line.equalsIgnoreCase(CMD_EXIT) || line.equalsIgnoreCase(CMD_QUIT)) {
					return;
				} else {
					console.println("ERR: unknown cmd: " + line);
				}
			}
		} catch (IOException e) {
			logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
			System.exit(0);
		} finally {
			try {
				TerminalFactory.get().restore();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	static class ScripterConsoleReader extends ConsoleReader {
		public ScripterConsoleReader() throws IOException {
			super();
			setPrompt("scripter>");
			addCompleter(new StringsCompleter("start"));
		}

		@Override
		public String readLine() throws IOException {
			return super.readLine().trim();
		}
	}
	
	private static String list() throws ClassCastException, IOException {
		String resp = HttpUtil.get(String.format("http://localhost:%s/REST/Script/scripts/info", Conf.getAs(Conf.PORT, 8098)));
		JSONObject respJson = new JSONObject(resp);
		if(respJson.getInt("success") != 1)
			return "ERR: " + respJson.getString("errmsg");
		JSONArray scriptInfos = respJson.getJSONArray("scriptInfos");
		
		StringBuilder result = new StringBuilder();
		result.append("script count: " + scriptInfos.length() + "\n");
		for (int i = 0; i < scriptInfos.length(); i++) {
			JSONObject scriptInfo = scriptInfos.getJSONObject(i);
			result.append(String.format("\tscript: %s (running: %s)\n", scriptInfo.getString("SCRIPT_NAME"), scriptInfo.getBoolean("IS_RUNNING")));
		}
		return result.toString();
	}
	
	private static String startScript(String line) throws UnsupportedEncodingException, IOException {
		if(line.split(" ").length <= 1) return "ERR: invalid command: " + line;
		String scriptName = line.substring(CMD_START_SCRIPT.length() + 1).trim();
		
		String resp = HttpUtil.post(String.format("http://localhost:%s/REST/Script/script/%s/start", Conf.getAs(Conf.PORT, 8098), URLEncoder.encode(scriptName, "utf8"))); 
		JSONObject respJson = new JSONObject(resp);
		if(respJson.getInt("success") != 1)
			return "ERR: " + respJson.getString("errmsg");
	
		return "start script " + scriptName + " success";
	}
	
	private static String stopScript(String line) throws UnsupportedEncodingException, IOException {
		if(line.split(" ").length <= 1) return "ERR: invalid command: " + line;
		String scriptName = line.substring(CMD_START_SCRIPT.length() + 1).trim();
		
		String resp = HttpUtil.post(String.format("http://localhost:%s/REST/Script/script/%s/stop", Conf.getAs(Conf.PORT, 8098), URLEncoder.encode(scriptName, "utf8"))); 
		JSONObject respJson = new JSONObject(resp);
		if(respJson.getInt("success") != 1)
			return "ERR: " + respJson.getString("errmsg");
	
		return "stop script " + scriptName + " success";
	}

	
	private static String help() {
		return "\tstartup: startup scripter\n" + 
				"\tshutdown: shutdown scripter\n" +
				"\tlist: get script list\n" +
				"\tstart-script <script_name>: send script start command to scripter\n" +
				"\tstop-script <script_name>: send script stop command to scripter\n";
	}
}