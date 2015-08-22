package com.igloosec.webdbreader;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.webapp.WebAppContext;
import org.json.JSONArray;

import com.igloosec.webdbreader.common.Conf;
import com.igloosec.webdbreader.common.Path;
import com.igloosec.webdbreader.rdb.DerbySchemaCreator;
import com.igloosec.webdbreader.servlet.EmbedDb;
import com.igloosec.webdbreader.servlet.Index;
import com.igloosec.webdbreader.servlet.Script;

public class App {
	public static void main(String[] args) throws Exception {
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
		context.addServlet(EmbedDb.class, "/EmbedDb/*");
		context.addServlet(Script.class, "/Script/*");
		context.addServlet(Index.class, "/View/*");
		context.addServlet(Index.class, "");
		context.setContextPath("/");
		
		File workDir = new File(Path.getPackagePath().getAbsolutePath(), "work");
		FileUtils.deleteDirectory(workDir);
		context.setTempDirectory(workDir);
		return context;
	} //getWebAppContext
} // class