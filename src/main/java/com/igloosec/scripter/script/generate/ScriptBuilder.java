package com.igloosec.scripter.script.generate;

public class ScriptBuilder {
	private StringBuilder stringBuilder = new StringBuilder();
	
	public ScriptBuilder append(String str, Object... args) {
		if(args != null && args.length > 0) str = String.format(str, args);
		stringBuilder.append(str);
		return this;
	}
	
	public ScriptBuilder appendLine(String line, Object... args) {
		return this.append(line, args).append("\n");
	}
	
	public ScriptBuilder appendLine() {
		return this.append("\n");
	}

	@Override
	public String toString() {
		return stringBuilder.toString();
	}
}