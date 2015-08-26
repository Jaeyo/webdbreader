package com.igloosec.webdbreader;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.webapp.WebAppContext;

import com.igloosec.webdbreader.common.Conf;
import com.igloosec.webdbreader.common.Path;
import com.igloosec.webdbreader.common.SingletonInstanceRepo;
import com.igloosec.webdbreader.rdb.DerbySchemaCreator;
import com.igloosec.webdbreader.script.ScriptExecutor;
import com.igloosec.webdbreader.servlet.Config;
import com.igloosec.webdbreader.servlet.ConfigREST;
import com.igloosec.webdbreader.servlet.DatabaseREST;
import com.igloosec.webdbreader.servlet.EmbedDbREST;
import com.igloosec.webdbreader.servlet.Index;
import com.igloosec.webdbreader.servlet.MetaREST;
import com.igloosec.webdbreader.servlet.Script;
import com.igloosec.webdbreader.servlet.ScriptREST;

public class App {
	public static void main(String[] args) throws Exception {
		registerShutdownHook();
		
		new DerbySchemaCreator().check();
		
		QueuedThreadPool threadPool = new QueuedThreadPool(Conf.getAs(Conf.JETTY_THREAD_POOL_SIZE, 20));

		Server server = new Server(threadPool);
		server.setStopAtShutdown(true);
		server.setStopTimeout(5000);

		ServerConnector connector = new ServerConnector(server);
		connector.setPort(Conf.getAs(Conf.PORT, 1234));
		connector.setIdleTimeout(30000);
		server.setConnectors(new ServerConnector[] { connector });

		server.setHandler(getWebAppContext());
		server.start();
		server.join();
	} // main

	private static WebAppContext getWebAppContext() throws IOException{
		WebAppContext context = new WebAppContext();
		context.setClassLoader(Thread.currentThread().getContextClassLoader());
		context.setResourceBase(App.class.getClassLoader().getResource("./static").toExternalForm());
		context.addServlet(EmbedDbREST.class, "/REST/EmbedDb/*");
		context.addServlet(Script.class, "/Script/*");
		context.addServlet(ScriptREST.class, "/REST/Script/*");
		context.addServlet(DatabaseREST.class, "/REST/Database/*");
		context.addServlet(MetaREST.class, "/REST/Meta/*");
		context.addServlet(Config.class, "/Config/*");
		context.addServlet(ConfigREST.class, "/REST/Config/*");
		context.addServlet(Index.class, "");
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