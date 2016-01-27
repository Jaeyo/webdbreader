importPackage(Packages.com.igloosec.scripter.script.bindingsV2);

var newRepeat = function(args) {
	if(args == null || args.period == null || typeof args.period !== 'number') throw new Error('illegal argument');

	return new Repeat(args.period);
};

var newDatabase = function(jdbc) {
	if(args == null) throw new Error('illegal argument');
	else if(args.driver == null) throw new Error('missing argument: driver');
	else if(args.connUrl == null) throw new Error('missing argument: connUrl');
	else if(args.username == null) throw new Error('missing argument: username');
	else if(args.password == null) throw new Error('missing argument: password');

	return Database(args.driver, args.connUrl, args.username, args.password);
};

var newFile = function(args) {
	if(args == null) throw new Error('illegal argument');
	else if(args.filename == null) throw new Error('missing argument: filename');

	if(args.charset == null) args.charset = 'UTF-8';

	args.filename = args.filename.replace('$yyyy', 'yyyy')
																.replace('$mm', 'MM')
																.replace('$dd', 'dd')
																.replace('$hh', 'HH')
																.replace('$mi', 'mm')
																.replace('$ss', 'ss');

	return new File(args.filename, args.charset);
};

var newLogger = function() {
	return com.igloosec.scripter.script.ScriptThread.currentLogger();
};

var newRepo = function() {
	return new Repo();
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







/*
importPackage(Packages.com.igloosec.scripter.script.bindingsV1);
importPackage(Packages.com.igloosec.scripter.script.bindingsV2);
importPackage(Packages.com.igloosec.scripter.script.bindingsV2.base);
importPackage(Packages.com.igloosec.scripter.script.bindingsV2.headpipe);
importPackage(Packages.com.igloosec.scripter.script.bindingsV2.pipe);


var dummy = function(count) {
	return new DummyPipeHead(count);
};

// common --------------------------------------------------------
var data = function(data) {
	return new DataPipeHead(data);
};

var repo = function(key, value) {
	if(value == null) {
		return new SimpleRepo().get(key);
	} else {
		return new SimpleRepo().set(key, value);
	}
};

// date --------------------------------------------------------
var now = function() {
	return date(new Date());
};

var date = function(arg) {
	var javaDateObj = null;
	if(arg instanceof java.util.Date) {
		javaDateObj = arg;
	} else if(arg instanceof java.lang.Integer || arg instanceof java.lang.Long || typeof arg === 'number') {
		javaDateObj = new Date(arg);
	} else if(arg instanceof Date) {
		javaDateObj = new Date(arg.getTime());
	}

	return {
		getDate: function() {
			return javaDateObj;
		}, 
		format: function(format) {
			return new java.text.SimpleDateFormat(format).format(javaDateObj);
		}
	};
};


// schedule --------------------------------------------------------
var schedule = function(period) {
	var scheduler;
	return {
		run: function(callback) {
			scheduler = new SchedulePipeHead(period, callback);
			scheduler.run();
		}
	};
}

// logger --------------------------------------------------------
var log = function(msg) {
	return data(msg).log('info').run();
};

var debug = function(msg) {
	return data(msg).log('debug').run();
};

var warn = function(msg) {
	return data(msg).log('warn').run();
};

var error = function(msg) {
	return data(msg).log('error').run();
};

// database --------------------------------------------------------
var database = function(jdbc) {
	return {
		select: function(query) {
			return DBSelectPipe({
				driver: jdbc.driver,
				connUrl: jdbc.connUrl,
				username: jdbc.username,
				password: jdbc.password,
				query: query
			});
		}, update: function(query) {
			return data(query).dbUpdate(jdbc);
		}
	};
};
*/

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