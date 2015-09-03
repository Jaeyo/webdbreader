Db2FileScriptMaker= function(){
	this.id = new Date().getTime();
	this.model = null; //Db2FileModel
}; //INIT

Db2FileScriptMaker.prototype = {
	setModel: function(model){
		this.model = model;
		return this;
	}, //setModel
	
	script: function(){
		var helper = {
			step1_availableVersion: function(model){
				var script = '\n var availableVersion = "{}"; '.format(model.version);
				script += '\n';
				return script;
			}, //step1_availableVersion

			step2_initConf: function(id, model){
				var script = '\n var conf = { ';
				script += '\n 	period: {}, '.format(model.period);
				script += '\n 	selectColumn: "{}", '.format(model.selectColumn.toString());
				script += '\n 	tableName: "{}", '.format(model.tableName);
				script += '\n 	outputPath: "{}", '.format(model.outputPath);
				script += '\n 	delimiter: "{}", '.format(model.delimiter);
				script += '\n 	charset: "{}", '.format(model.charset);
				if(model.condition.type !== 'no-condition')
					script += '\n 	conditionColumn: "{}", '.format(model.condition.column);
				script += '\n ';
				script += '\n 	database: { ';
				script += '\n 		driver: "{}", '.format(model.database.driver);
				script += '\n 		connUrl: "{}", '.format(model.database.connUrl);
				script += '\n 		encryptedUsername: "{}", '.format(model.database.username);
				script += '\n 		encryptedPassword: "{}" '.format(model.database.password);
				script += '\n 	} //database ';
				script += '\n }; ';
				script += '\n ';
				return script;
			}, //step2_initConf	

			step3_initConditionVar: function(model){
				if(model.condition.type === 'no-condition')
					return '';
				var script = '';
				if(model.condition.type === 'date-condition'){
					script += '\n var condition = { ';
					script += '\n 	smallValue: simpleRepo.load("small-value"), ';
					script += '\n 	bigValue: dateUtil.format(dateUtil.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss") ';
					script += '\n }; ';
					script += '\n';
					script += '\n if(condition.smallValue === null) ';
					script += '\n 	condition.smallValue = dateUtil.format(0, "yyyy-MM-dd HH:mm:ss"); ';
				} else if(model.condition.type === 'sequence-condition'){
					script += '\n var condition = { ';
					script += '\n 	smallValue: simpleRepo.load("small-value"), ';
					script += '\n 	bigValue: dbHandler.query({ ';
					script += '\n 		database: conf.database, '
					script += '\n 		query: "SELECT MAX(" + conf.conditionColumn + ") FROM " + dateUtil.formatReplace(conf.tableName) ';
					script += '\n 	}) ';
					script += '\n }; ';
					script += '\n if(condition.smallValue === null) ';
					script += '\n 	condition.smallValue = 0; ';
				} //if
				script += '\n ';
				return script;
			}, //step3_initConditionVar

			step4_initWriter: function(model){
				var script = '\n var writer = fileWriterFactory.getWriter({ ';
				script += '\n	filename: conf.outputPath + "output_$yyyy$mm$dd$hh$mi.txt", ';
				script += '\n	charset: conf.charset ';
				script += '\n }); ';
				script += '\n';
				return script;
			}, //step4_initWriter

			step5_mainFunction: function(model){
				var script = '\n function main(){ ';
				if(model.condition.type === 'date-condition'){
					script += '\n 	condition.bigValue = dateUtil.format(dateUtil.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss"); ';
					script += '\n';
					script += '\n 	var query = " SELECT " + conf.selectColumn + ';
					script += '\n 				" FROM " + dateUtil.formatReplace(conf.tableName) + ';
					if(model.database.vendor === 'mysql'){
						script += '\n 				" WHERE " + conf.conditionColumn + " > str_to_date(\'" + condition.smallValue + "\', \'%Y-%m-%d %H:%i:%s\') "';
						script += '\n 				" AND " + conf.conditionColumn + " <= str_to_date(\'" + condition.bigValue + "\', \'%Y-%m-%d %H:%i:%s\') ";';
					} else if(model.database.vendor === 'mssql'){
						script += '\n 				" WHERE " + conf.conditionColumn + " > \'" + condition.smallValue + "\'" ';
						script += '\n 				" AND " + conf.conditionColumn + " <= \'" + condition.smallValue + "\'"; ';
					} else{
						script += '\n 				" WHERE " + conf.conditionColumn + " > to_date(\'" + condition.smallValue + "\', \'YYYY-MM-DD HH24:MI:SS\') "';
						script += '\n 				" AND " + conf.conditionColumn + " <= to_date(\'" + condition.bigValue + "\', \'YYYY-MM-DD HH24:MI:SS\') ";';
					} //if
				} else if(model.condition.type === 'sequence-condition'){
					script += '\n 	condition.bigValue = dbHandler.query({ ';
					script += '\n 		database: conf.database, ';
					script += '\n 		query: "SELECT MAX(" + conf.conditionColumn + ") FROM " + dateUtil.formatReplace(conf.tableName), ';
					script += '\n 		delimiter: "", ';
					script += '\n 		lineDelimiter: "" ';
					script += '\n 	}); ';
					script += '\n ';
					script += '\n 	var query = " SELECT " + conf.selectColumn + ';
					script += '\n 				" FROM " + dateUtil.formatReplace(conf.tableName) + ';
					script += '\n 				" WHERE " + conf.conditionColumn + " > " + condition.smallValue + ';
					script += '\n 				" AND " + conf.conditionColumn + " <= " + condition.bigValue; ';
				} else {
					script += '\n 	var query = " SELECT " + conf.selectColumn + ';
					script += '\n 				" FROM " + dateUtil.formatReplace(conf.tableName); ';
				} //if
				
				script += '\n'
				script += '\n 	dbHandler.selectAndAppend({ ';
				script += '\n 		database: conf.database, ';
				script += '\n 		query: query, ';
				script += '\n 		delimiter: conf.delimiter, ';
				script += '\n 		writer: writer ';
				script += '\n 	}); ';
				script += '\n';

				if(model.condition.type !== 'no-condition'){
					script += '\n 	condition.smallValue = condition.bigValue; ';
					script += '\n 	simpleRepo.store("small-value", condition.bigValue); ';
				} //if

				script += '\n } //main ';
				script += '\n ';
				return script;
			}, //step4_mainFunction

			step6_schedule: function(){
				var script = '\n scheduler.schedule({ ';
				script += '\n 	delay: 1000,' ;
				script += '\n 	period: conf.period,' ;
				script += '\n }, function(){ ';
				script += '\n 	try{ ';
				script += '\n 		main(); ';
				script += '\n 	} catch(e){ ';
				script += '\n 		logger.error(e); ';
				script += '\n 	} //catch ';
				script += '\n }); ';
				return script;
			} //step5_schedule
		};

		var script = helper.step1_availableVersion(this.model);
		script += helper.step2_initConf(this.id, this.model);
		script += helper.step3_initConditionVar(this.model);
		script += helper.step4_initWriter(this.model)
		script += helper.step5_mainFunction(this.model);
		script += helper.step6_schedule();
		return script;
	} //script
}; //Db2FileScriptMaker