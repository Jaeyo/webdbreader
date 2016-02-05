package com.igloosec.scripter.script.generate;

public class ScriptGenerator {
	String getTypeVarExp(Class<? extends ScriptGenerator> typeClazz, String bindingType) {
		if(typeClazz.equals(Db2FileScriptGenerator.class)) {
			return String.format("var type = 'db2file-%s';", bindingType);
		} else if(typeClazz.equals(Db2DbScriptGenerator.class)) {
			return String.format("var type = 'db2db-%s';", bindingType);
		} else {
			return null;
		}
	}
}
