package com.igloosec.scripter.script;


public class ScriptExecutor_OLD {
//	private static final Logger logger = LoggerFactory.getLogger(ScriptExecutor_OLD.class);
//	private Map<String, ScriptThread> runningScripts = new HashMap<String, ScriptThread>();
//	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);
//	private ConfigService configService = SingletonInstanceRepo.getInstance(ConfigService.class);
//	private NotiService notiService = SingletonInstanceRepo.getInstance(NotiService.class);
//
//	public void execute(final String scriptName, final String script) throws AlreadyStartedException, ScriptException, VersionException {
//		if(runningScripts.containsKey(scriptName))
//			throw new AlreadyStartedException(scriptName);
//		
//		versionCheck(script);
//		
//		ScriptThread thread = new ScriptThread(scriptName){
//			@Override
//			public void run() {
//				try{
//					operationHistoryService.saveStartupHistory(getScriptName());
//					
//					Bindings bindings = new SimpleBindings();
////					bindings.put("dateUtil", new DateUtil());
////					bindings.put("dbHandler", new DbHandler());
////					bindings.put("fileReaderFactory", new FileReaderFactory());
////					bindings.put("fileWriterFactory", new FileWriterFactory());
////					bindings.put("runtimeUtil", new RuntimeUtil());
////					bindings.put("scheduler", new Scheduler());
////					bindings.put("simpleRepo", new SimpleRepo());
////					bindings.put("stringUtil", new StringUtil());
////					bindings.put("logger", getLogger());
//					
//					ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
//					scriptEngine.eval(script, bindings);
//				} catch(Exception e){
//					if(e.getClass().equals(InterruptedException.class) == true)
//						return;
//					getLogger().error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
//				} finally{
//					if(isScheduled() == false && isFileReaderMonitoring() == false){
//						operationHistoryService.saveShutdownHistory(getScriptName());
//						runningScripts.remove(getScriptName()).stopScript();
//						
//						notiService.sendScriptEndNoti(scriptName);
//					} 
//				} 
//			} 
//		};
//	
//		thread.start();
//		logger.info("{} start to running", scriptName);
//		runningScripts.put(scriptName, thread);
//	} 
//	
//	private void versionCheck(String script) throws ScriptException, VersionException{
//		if("false".equals(configService.load("version.check")) == true)
//			return;
//		
//		Bindings bindings = new SimpleBindings();
////		bindings.put("dateUtil", Mockito.mock(DateUtil.class));
////		bindings.put("dbHandler", Mockito.mock(DbHandler.class));
////		bindings.put("fileReaderFactory", Mockito.mock(FileReaderFactory.class));
////		bindings.put("fileWriterFactory", Mockito.mock(FileWriterFactory.class));
////		bindings.put("runtimeUtil", Mockito.mock(RuntimeUtil.class));
////		bindings.put("scheduler", Mockito.mock(Scheduler.class));
////		bindings.put("simpleRepo", Mockito.mock(SimpleRepo.class));
////		bindings.put("stringUtil", Mockito.mock(StringUtil.class));
////		bindings.put("logger", Mockito.mock(Logger.class));
//
//		ScriptEngine scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
//		try{
//			scriptEngine.eval(script, bindings);
//		} catch(Exception e){}
//		
//		String version = (String) bindings.get("availableVersion");
//		
//		if(version == null)
//			throw new VersionException("no availableVersion in script");
//		
//		int majorVersion = Integer.parseInt(Version.getCurrentVersion().split("\\.")[0]);
//		int scriptMajorVersion = Integer.parseInt(version.split("\\.")[0]);
//		if(majorVersion != scriptMajorVersion)
//			throw new VersionException("unsupported major version: " + version);
//		
//		int minorVersion = Integer.parseInt(Version.getCurrentVersion().split("\\.")[1]);
//		int scriptMinorVersion = Integer.parseInt(version.split("\\.")[1]);
//		if(scriptMinorVersion > minorVersion)
//			throw new VersionException("unsupported minor version: " + version);
//	} 
//	
//	public void stop(String scriptName) throws ScriptNotRunningException {
//		logger.info("{} stop to running", scriptName);
//		ScriptThread thread = runningScripts.remove(scriptName);
//		if(thread == null)
//			throw new ScriptNotRunningException(scriptName);
//		thread.stopScript();
//	} 
//	
//	public void stopAllScript(){
//		logger.info("stop all scripts");
//		for(String scriptName : runningScripts.keySet()){
//			try {
//				stop(scriptName);
//			} catch (ScriptNotRunningException e) {
//				logger.error(String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage()), e);
//			} 
//		} 
//	} 
//
//	public Set<String> getRunningScripts(){
//		Set<String> runningScriptNames = new HashSet<String>();
//		for(String scriptName: runningScripts.keySet())
//			runningScriptNames.add(scriptName);
//		return runningScriptNames;
//	} 
//	
//	public ScriptThread getScriptThread(String scriptName){
//		return runningScripts.get(scriptName);
//	} 
} 