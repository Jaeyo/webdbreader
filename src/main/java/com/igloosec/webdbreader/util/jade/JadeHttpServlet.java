package com.igloosec.webdbreader.util.jade;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;

import com.igloosec.webdbreader.App;

import de.neuland.jade4j.JadeConfiguration;
import de.neuland.jade4j.exceptions.JadeCompilerException;
import de.neuland.jade4j.template.JadeTemplate;
import de.neuland.jade4j.template.TemplateLoader;

public class JadeHttpServlet extends HttpServlet{
	private static JadeConfiguration jadeConfig = new JadeConfiguration();
	static {
		System.out.println("###DEBUG, static executed"); //DEBUG
		jadeConfig.setTemplateLoader(new TemplateLoader() {
			@Override
			public Reader getReader(String name) throws IOException {
				return new InputStreamReader(App.class.getClassLoader().getResourceAsStream("resource/view/" + name));
			} //getReader
			
			@Override
			public long getLastModified(String name) throws IOException {
				return 0;
			}
		});
	} //static
	
	protected void render(HttpServletResponse resp, String view, Map<String, Object> model) throws JadeCompilerException, IOException{
		if(model == null) model = new HashMap<String, Object>();
		resp.getWriter().println(jade(view, model));
	} //render
	
	protected String jade(String view, Map<String, Object> model) throws JadeCompilerException, IOException{
		if(model == null) model = new HashMap<String, Object>();
		JadeTemplate tmpl = jadeConfig.getTemplate(view);
		return jadeConfig.renderTemplate(tmpl, model);
	} //jade
} //lass