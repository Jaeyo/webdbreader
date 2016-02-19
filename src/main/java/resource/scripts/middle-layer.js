importPackage(Packages.com.igloosec.scripter.script.bindingsV2);

var newRepeat = function(args) {
	if(args == null || args.period == null || typeof args.period !== 'number') throw new Error('illegal argument');

	return new Repeat(args.period);
};

var newDatabase = function(jdbc) {
	if(jdbc == null) throw new Error('illegal argument');
	else if(jdbc.driver == null) throw new Error('missing argument: driver');
	else if(jdbc.connUrl == null) throw new Error('missing argument: connUrl');
	else if(jdbc.username == null) throw new Error('missing argument: username');
	else if(jdbc.password == null) throw new Error('missing argument: password');

	return Database(jdbc.driver, jdbc.connUrl, jdbc.username, jdbc.password);
};

var newFile = function(args) {
	if(args == null) throw new Error('illegal argument');
	else if(args.filename == null) throw new Error('missing argument: filename');

	if(args.charset == null) args.charset = 'UTF-8';
	
	return new File(args.filename, args.charset);
};

var newLogger = function() {
	return com.igloosec.scripter.script.ScriptThread.currentLogger();
};

var newRepo = function() {
	return new Repo();
};

var newCrypto = function() {
	return {
		encrypt: function(cleartext) {
			return com.igloosec.scripter.util.SimpleCrypto.encrypt(cleartext);
		}, 
		decrypt: function(encrypted) {
			return com.igloosec.scripter.util.SimpleCrypto.decrypt(encrypted);
		}
	};
};

var dateFormat = function(timestamp, format) {
	if(typeof timestamp !== 'number') throw new Error('illegal timestamp type');
	else if(typeof format !== 'string') throw new Error('illegal format type');

	format = format.replace('$yyyy', 'yyyy')
									.replace('$mm', 'MM')
									.replace('$dd', 'dd')
									.replace('$hh', 'HH')
									.replace('$mi', 'mm')
									.replace('$ss', 'ss');

	return com.igloosec.scripter.util.Util.dateFormat(timestamp, format);
};

var getType = function(arg) {
	return com.igloosec.scripter.script.bindingsV2.Util.getType(arg);
};

var isNumber = function(arg) {
	return com.igloosec.scripter.script.bindingsV2.Util.isNumber(arg);
};

var isDate = function(arg) {
	return com.igloosec.scripter.script.bindingsV2.Util.isDate(arg);
};





// old api --------------------------------------------------------
var apiV1 = function(callback) {
	var dateUtil = new DateUtil();
	var dbHandler = new DbHandler();
	var fileExporter = new FileExporter();
	var httpUtil = new HttpUtil();
	var runtimeUtil = new RuntimeUtil();
	var scheduler = new Scheduler();
	var simpleRepo = new SimpleRepo();
	var stringUtil = new StringUtil();
	return callback(dateUtil, dbHandler, fileExporter, httpUtil, runtimeUtil, scheduler, simpleRepo, stringUtil);
};