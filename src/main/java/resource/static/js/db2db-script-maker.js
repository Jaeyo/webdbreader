Db2DbScriptMaker= function(){
	this.id = new Date().getTime();
	this.model = null; //Db2DbModel
}; //INIT

Db2DbScriptMaker.prototype = {
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

			step2_initConf: function(model){
				var script = '\nvar conf = { ';
				script += '\n	period: {}, '.format(model.period);
				script += '\n	src: { ';
				script += '\n		selectColumn: "{}", '.format(model.src.selectColumn.toString());
				script += '\n		tableName: "{}", '.format(model.src.tableName);
				if(model.src.condition.type !== 'no-condition')
					script += '\n		conditionColumn: "{}", '.format(model.src.condition.column);
				script += '\n		database: { ';
				script += '\n			driver: "{}", '.format(model.src.database.driver);
				script += '\n			connUrl: "{}", '.format(model.src.database.connUrl);
				script += '\n			encryptedUsername: "{}", '.format(model.src.database.username);
				script += '\n			encryptedPassword: "{}", '.format(model.src.database.password);
				script += '\n		} ';
				script += '\n	}, dest: { ';
				script += '\n		insertColumn: "{}", '.format(model.dest.insertColumn.toString());
				script += '\n		tableName: "{}", '.format(model.dest.tableName);
				script += '\n		database: { ';
				script += '\n			driver: "{}", '.format(model.dest.database.driver);
				script += '\n			connUrl: "{}", '.format(model.dest.database.connUrl);
				script += '\n			encryptedUsername: "{}", '.format(model.dest.database.username);
				script += '\n			encryptedPassword: "{}", '.format(model.dest.database.password);
				script += '\n		} ';
				script += '\n	} ';
				script += '\n}; //conf';
				return script;
			}, //step2_initConf	

			step3_getConditionFunction: function(model){
				if(model.src.condition.type === 'no-condition')
					return '';
				var script = '';
				if(model.src.condition.type === 'date-condition'){
					script += '\nfunction getCondition() { ';
					script += '\n	return {';
					script += '\n		smallValue: simpleRepo.load("small-value", dateUtil.format(0, "yyyy-MM-dd HH:mm:ss")), ';
					script += '\n		bigValue: dateUtil.format(dateUtil.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss") ';
					script += '\n	}; ';
					script += '\n}; //getCondition ';
					script += '\n';
				} else if(model.src.condition.type === 'sequence-condition'){
					script += '\nfunction getCondition() {';
					script += '\n	return {';
					script += '\n		smallValue: simpleRepo.load("small-value", 0), ';
					script += '\n		bigValue: dbHandler.query({ ';
					script += '\n			database: conf.database, '
					script += '\n			query: "SELECT MAX(" + conf.conditionColumn + ") FROM " + dateUtil.formatReplace(conf.tableName) ';
					script += '\n		}) ';
					script += '\n	}; ';
					script += '\n}; //getCondition ';
				} //if
				script += '\n ';
				return script;
			}, //step3_getConditionFunction

			step4_mainFunction: function(model){
				var script = '\nfunction main() {';

				if(model.src.condition.type !== 'no-condition')
					script += '\n	condition = getCondition();\n';

				if(model.src.condition.type === 'no-condition') {
					script += '\n	var selectQuery = ';
					script += '\n		"SELECT " + conf.src.selectColumn + ';
					script += '\n		"FROM " + dateUtil.formatReplace(conf.src.tableName);\n';
				} else if (model.src.condition.type === 'date-condition') {
					script += '\n	var selectQuery = ';
					script += '\n		"SELECT " + conf.src.selectColumn + ';
					script += '\n		"FROM " + dateUtil.formatReplace(conf.src.tableName) +';
					if(model.src.database.vendor === 'mysql') {
						script += '\n		"WHERE " + conf.src.conditionColumn + " > str_to_date(\'" + condition.smallValue + "\', \'%Y-%m-%d %H:%i:%s\')" + ';
						script += '\n		"AND " + conf.src.conditionColumn + " <= str_to_date(\'" + condition.bigValue + "\', \'%Y-%m-%d %H:%i:%s\')";\n';
					} else if(model.src.database.vendor === 'mssql') {
						script += '\n		" WHERE " + conf.conditionColumn + " > \'" + condition.smallValue + "\'" + ';
						script += '\n		" AND " + conf.conditionColumn + " <= \'" + condition.smallValue + "\'";\n ';
					} else {
						script += '\n		" WHERE " + conf.conditionColumn + " > to_date(\'" + condition.smallValue + "\', \'YYYY-MM-DD HH24:MI:SS\') " + ';
						script += '\n		" AND " + conf.conditionColumn + " <= to_date(\'" + condition.bigValue + "\', \'YYYY-MM-DD HH24:MI:SS\') ";\n';
					} //if
				} else if(model.src.condition.type === 'sequence-condition') {
					script += '\n	var selectQuery = ';
					script += '\n		" SELECT " + conf.selectColumn + ';
					script += '\n		" FROM " + dateUtil.formatReplace(conf.tableName) + ';
					script += '\n		" WHERE " + conf.conditionColumn + " > " + condition.smallValue + ';
					script += '\n		" AND " + conf.conditionColumn + " <= " + condition.bigValue;\n ';
				} //if

				script += '\n	var insertQuery = ';
				script += '\n		"INSERT INTO " + dateUtil.formatReplace(conf.dest.tableName) + ';
				script += '\n		"(" + conf.dest.insertColumn + ") values";';
				script += '\n	var insertQueryParams = [];';
				script += '\n	conf.dest.insertColumn.split(",").every(function(){ insertQueryParams.push("?"); return true; });';
				script += '\n	insertQuery += "(" + insertQueryParams.join(",") + ")";\n';

				script += '\n	dbHandler.selectAndInsert({';
				script += '\n		srcDatabase: conf.src.database,';
				script += '\n		destDatabase: conf.dest.database,';
				script += '\n		selectQuery: selectQuery,';
				script += '\n		insertQuery: insertQuery';
				script += '\n	});';

				if(model.src.condition.type !== 'no-condition') {
					script += '\n\n	condition.smallValue = condition.bigValue;';
					script += '\n	simpleRepo.store("small-value", condition.smallValue);';
				} //if

				script += '\n}; //main\n';

				return script;
			}, //step4_mainFunction

			step5_schedule: function(){
				var script = '\nscheduler.schedule({ ';
				script += '\n	delay: 1000,' ;
				script += '\n	period: conf.period,' ;
				script += '\n}, function(){ ';
				script += '\n	try{ ';
				script += '\n		main(); ';
				script += '\n	} catch(e){ ';
				script += '\n		logger.error(e); ';
				script += '\n	} //catch ';
				script += '\n}); ';
				return script;
			} //step5_schedule
		};

		var script = helper.step1_availableVersion(this.model);
		script += helper.step2_initConf(this.model);
		script += helper.step3_getConditionFunction(this.model)
		script += helper.step4_mainFunction(this.model);
		script += helper.step5_schedule();
		return script;
	} //script
}; //Db2DbScriptMaker