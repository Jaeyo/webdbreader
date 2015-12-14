package com.igloosec.scripter;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.xml.DOMConfigurator;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.webapp.WebAppContext;

import com.igloosec.scripter.common.Conf;
import com.igloosec.scripter.common.Path;
import com.igloosec.scripter.common.SingletonInstanceRepo;
import com.igloosec.scripter.rdb.DerbySchemaCreator;
import com.igloosec.scripter.script.ScriptExecutor;
import com.igloosec.scripter.service.ScriptService;
import com.igloosec.scripter.servlet.ChartREST;
import com.igloosec.scripter.servlet.ConfigREST;
import com.igloosec.scripter.servlet.DatabaseREST;
import com.igloosec.scripter.servlet.EmbedDbREST;
import com.igloosec.scripter.servlet.FileOutMsgWebSocket.FileOutMsgWebSocketServlet;
import com.igloosec.scripter.servlet.Index;
import com.igloosec.scripter.servlet.LoggerWebSocket.LoggerWebSocketServlet;
import com.igloosec.scripter.servlet.MetaREST;
import com.igloosec.scripter.servlet.NotiWebSocket.NotiWebSocketServlet;
import com.igloosec.scripter.servlet.ScriptREST;
import com.igloosec.scripter.servlet.ShutdownREST;
import com.igloosec.scripter.statistics.ScriptScoreStatistics;

public class Server {
	public static void main(String[] args) throws Exception {
		// log tailing 하는 부분 queue 빼고 ScriptLogger 에 바로 빨대 꽃도록 수정 필요
		
		configureLog4j();
		registerShutdownHook();
		
		new DerbySchemaCreator().check();
		
		SingletonInstanceRepo.getInstance(ScriptService.class).startAutoStartScript();
		
		SingletonInstanceRepo.getInstance(ScriptScoreStatistics.class);
		
		QueuedThreadPool threadPool = new QueuedThreadPool(Conf.getAs(Conf.JETTY_THREAD_POOL_SIZE, 20));

		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(threadPool);
		server.setStopAtShutdown(true);
		server.setStopTimeout(5000);

		ServerConnector connector = new ServerConnector(server);
		connector.setPort(Conf.getAs(Conf.PORT, 8098));
		connector.setIdleTimeout(30000);
		server.setConnectors(new ServerConnector[] { connector });

		WebAppContext context = getWebAppContext();
		server.setHandler(context);
		
		server.start();
		server.join();
	} // main
	
	private static void configureLog4j() {
		System.setProperty("home.path", Path.getPackagePath().getAbsolutePath());
		
		File log4jXml = new File(Path.getPackagePath(), "conf/log4j.xml");
		if(log4jXml.exists() == false) return;
		
		DOMConfigurator.configure(log4jXml.getAbsolutePath());
	} //configureLog4j

	private static WebAppContext getWebAppContext() throws IOException{
		WebAppContext context = new WebAppContext();
		context.setClassLoader(Thread.currentThread().getContextClassLoader());
		context.setResourceBase(Server.class.getClassLoader().getResource("resource/static").toExternalForm());
		context.addServlet(EmbedDbREST.class, "/REST/EmbedDb/*");
		context.addServlet(ScriptREST.class, "/REST/Script/*");
		context.addServlet(DatabaseREST.class, "/REST/Database/*");
		context.addServlet(MetaREST.class, "/REST/Meta/*");
		context.addServlet(ConfigREST.class, "/REST/Config/*");
		context.addServlet(ChartREST.class, "/REST/Chart/*");
		context.addServlet(ShutdownREST.class, "/REST/Shutdown/*");
//		context.addServlet(OperationHistoryREST.class, "/REST/OperationHistory/*");
		
		context.addServlet(LoggerWebSocketServlet.class, "/WebSocket/Logger/*");
		context.addServlet(FileOutMsgWebSocketServlet.class, "/WebSocket/FileOutMsg/*");
		context.addServlet(NotiWebSocketServlet.class, "/WebSocket/Noti/*");
		
		context.addServlet(Index.class, "");
		context.addServlet(Index.class, "/Script/*");
		context.addServlet(Index.class, "/Config/*");
		context.addServlet(Index.class, "/ApiDoc/*");
		
		//new
		context.addServlet(Index.class, "/Api");
		context.addServlet(Index.class, "/Api/*");
		
		context.setContextPath("/");
		
		File workDir = new File(Path.getPackagePath().getAbsolutePath(), "work");
		FileUtils.deleteDirectory(workDir);
		context.setTempDirectory(workDir);
		return context;
	} //getWebAppContext
	
	private static void registerShutdownHook(){
		Runtime.getRuntime().addShutdownHook(new Thread(){
			@Override
			public void run() {
				SingletonInstanceRepo.getInstance(ScriptExecutor.class).stopAllScript();
			} //run
		});
	} //registerShutdownHook
} // class