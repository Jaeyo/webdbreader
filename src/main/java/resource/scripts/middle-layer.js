var apiV1 = function(callback) {
	var dateUtil = new com.igloosec.webdbreader.script.bindingsV1.DateUtil();
	var dbHandler = new com.igloosec.webdbreader.script.bindingsV1.DbHandler();
	var fileExporter = new com.igloosec.webdbreader.script.bindingsV1.FileExporter();
	var httpUtil = new com.igloosec.webdbreader.script.bindingsV1.HttpUtil();
	var runtimeUtil = new com.igloosec.webdbreader.script.bindingsV1.RuntimeUtil();
	var scheduler = new com.igloosec.webdbreader.script.bindingsV1.Scheduler();
	var simpleRepo = new com.igloosec.webdbreader.script.bindingsV1.SimpleRepo();
	var stringUtil = new com.igloosec.webdbreader.script.bindingsV1.StringUtil();
	return callback(dateUtil, dbHandler, fileExporter, httpUtil, runtimeUtil, scheduler, simpleRepo, stringUtil);
};

var test = function(count) {
	return new com.igloosec.webdbreader.script.bindingsV2.headpipe.TestHeadPipe(count);
};



test(10)
	.map(function(data) {
		return '__' + data + '__';
	})
	.group(3)
	.print()
	.run();