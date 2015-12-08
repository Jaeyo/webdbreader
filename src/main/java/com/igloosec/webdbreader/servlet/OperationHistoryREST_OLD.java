package com.igloosec.webdbreader.servlet;

import com.igloosec.webdbreader.util.servlet.JadeHttpServlet;

public class OperationHistoryREST_OLD extends JadeHttpServlet{
//	private static final Logger logger = LoggerFactory.getLogger(OperationHistoryREST.class);
//	private OperationHistoryService operationHistoryService = SingletonInstanceRepo.getInstance(OperationHistoryService.class);
//
//	@Override
//	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//		req.setCharacterEncoding("UTF-8");
//		resp.setContentType("application/json; charset=UTF-8");
//
//		String pathInfo = req.getPathInfo();
//		if(pathInfo == null) pathInfo = "/";
//		Map<String, String> pathParams = new HashMap<String, String>();
//		
//		try{
//			if(new UriTemplate("/").match(pathInfo, pathParams)){
//				resp.getWriter().print(getTotalOperationHistory(req, resp, pathParams));
//				resp.getWriter().flush();
//			} else{
//				resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", "invalid path uri").toString());
//				resp.getWriter().flush();
//			} //if
//		} catch(IllegalArgumentException e){
//			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
//			logger.error(errmsg);
//			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
//			resp.getWriter().flush();
//		} catch(Exception e){
//			String errmsg = String.format("%s, errmsg: %s", e.getClass().getSimpleName(), e.getMessage());
//			logger.error(errmsg, e);
//			resp.getWriter().print(new JSONObject().put("success", 0).put("errmsg", errmsg).toString());
//			resp.getWriter().flush();
//		} //catch
//	} //doGet
//
//	private String getTotalOperationHistory(HttpServletRequest req, HttpServletResponse resp, Map<String, String> pathParams){
//		JSONArray history = operationHistoryService.loadHistory(7);
//		return new JSONObject().put("success", 1).put("history", history).toString();	
//	} //getScriptInfo
} //class