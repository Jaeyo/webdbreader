package com.igloosec.webdbreader.script.bindings;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.igloosec.webdbreader.Version;

public class RuntimeUtil {
	private static final Logger logger = LoggerFactory.getLogger(RuntimeUtil.class);

	public void sleep(long timeMillis){
		try {
			Thread.sleep(timeMillis);
		} catch (InterruptedException e) {
			logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
			e.printStackTrace();
		} //catch
	} //sleep
	
	public String getVersion(){
		return Version.getCurrentVersion();
	} //getVersion
	
	public void shutdown(){
		logger.info("shutdown");
		System.exit(0);
	} //shutdown
	
	public void openShutdownPort() {
		openShutdownPort(8021);
	} // openShutdownPort

	public void openShutdownPort(final int port) {
		Runnable shutdownListenerRun = new Runnable() {
			@Override
			public void run() {
				try {
					ServerSocket server = new ServerSocket(port);

					for (;;) {
						final Socket socket = server.accept();
						
						new Thread() {
							@Override
							public void run() {
								BufferedReader input = null;
								PrintWriter output = null;
								
								try {
									input = new BufferedReader(new InputStreamReader(socket.getInputStream()));
									output = new PrintWriter(new OutputStreamWriter(socket.getOutputStream()));

									for(;;){
										String line=input.readLine();
										if(line.equals("shutdown")){
											System.exit(0);
										} else if(line.equals("ping")){
											output.println("pong");
											output.flush();
										} //if
									} //for ;;
								} catch (IOException e) {
									logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
								} finally{
										try {
											if(input != null)
												input.close();
											if(output != null)
												output.close();
										} catch (IOException e) {} //catch
								} //finally
							} // run
						}.start();

					} // for ;;

				} catch (IOException e) {
					logger.error(String.format("%s, errmsg : %s", e.getClass().getSimpleName(), e.getMessage()), e);
				} // catch
			} // run
		};

		new Thread(shutdownListenerRun).start();
	} // openShutdownPort
} // class