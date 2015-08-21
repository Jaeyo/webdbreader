Db2FileModel = function(){
	/*
	 * {
	 * 		period: (string),
	 * 		selectColumn: [ (string) ],
	 * 		tableName: (string),
	 * 		outputPath: (string),
	 * 		delimiter: (string),
	 * 		charset: (string),
	 * 		condition: {
	 * 			type: (string)('no-condition' | 'date-condition' | 'sequence-condition'),
	 * 			column: (string)
	 * 		},
	 * 		database: {
	 * 			vendor: (string, lower case only),
	 * 			driver: (string),
	 * 			connUrl: (string),
	 * 			username: (string),
	 * 			password: (string)
	 * 		}
	 * }
	 */
}; //INIT
Db2FileModel.prototype = {
	setPeriod: function(period){
		try{
			eval(period);
		} catch(e){
			throw new Error('invalid period value');
		} //catch
		
		this.period = period;
		return this;
	}, //setPeriod

	setSelectColumn: function(selectColumn){
		if((selectColumn instanceof Array) === false)
			throw new Error('invalid selectColumn type');
		this.selectColumn = selectColumn;
		return this;
	}, //setSelectColumn
	
	setTableName: function(tableName){
		this.tableName = tableName;
		return this;
	}, //setTableName
	
	setOutputPath: function(outputPath){
		this.outputPath = outputPath;
		return this;
	}, //setOutputPath
	
	setDelimiter: function(delimiter){
		this.delimiter = delimiter;
		return this;
	}, //setDelimiter
	
	setCharset: function(charset){
		this.charset = charset;
		return this;
	}, //setCharset
	
	setCondition: function(condition){
		if(this.condition === undefined) 
			this.condition = {};
		
		if(condition.type !== undefined){
			precondition(condition.type === 'no-condition' || 
				condition.type === 'date-condition' || 
				condition.type === 'sequence-condition', 
				'invalid condition type');
			
			this.condition.type = condition.type;
		} //if
		
		if(condition.column !== undefined)
			this.condition.column = condition.column;
		
		return this;
	}, //setCondition
	
	setDatabase: function(database){
		if(this.database === undefined) 
			this.database = {};
		
		if(database.vendor !== undefined)
			this.database.vendor = database.vendor;
		
		if(database.driver !== undefined)
			this.database.driver = database.driver;
		
		if(database.connUrl !== undefined)
			this.database.connUrl = database.connUrl;
	
		if(database.username !== undefined)
			this.database.username = database.username;
		
		if(database.password !== undefined)
			this.database.password = database.password;
		
		return this;
	} //setDatabase
}; //Db2FileModel




Model = function(){
	this.jdbcTmpl = {
		oracle: {
			driver: 'oracle.jdbc.driver.OracleDriver',
			connUrl: 'jdbc:oracle:thin:@{ip}:{port}:{database}',
			port: 1521
		},
		mysql: {
			driver: 'com.mysql.jdbc.Driver',
			connUrl: 'jdbc:mysql://{ip}:{port}/{database}',
			port: 3306
		},
		mssql: {
			driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
			connUrl: 'jdbc:sqlserver://{ip}:{port};databaseName={database}',
			port: 1433
		},
		db2: {
			driver: 'com.ibm.db2.jcc.DB2Driver',
			connUrl: 'jdbc:db2://{ip}:{port}/{database}',
			port: 50000
		},
		tibero: {
			driver: 'com.ibm.db2.jcc.DB2Driver',
			connUrl: 'jdbc:db2://{ip}:{port}/{database}',
			port: 8629
		}
	}; //jdbcTmpl
	
	this.db2FileModel = new Db2FileModel();
}; //INIT
Model.prototype = {
}; //Model

View = function(){
	this.scriptEditor = this.codeMirror($('#textarea-script')[0]);
}; //INIT
View.prototype = {
	codeMirror: function(dom){
		var editor = CodeMirror.fromTextArea(dom, {
			lineNumbers: true,
			mode: {name: "javascript", globalVars: true}
		});
		
		editor.setSize(null, 400);
		editor.setOption("theme", "base16-dark");
		
		var originalHint = CodeMirror.hint.javascript;
		CodeMirror.hint.javascript = function(cm){
			var inner = originalHint(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
			var customAutoComplete = controller.model.customAutoComplete;
			for(var i=0; i<customAutoComplete.length; i++)
				inner.list.push(customAutoComplete[i]);
			return inner;
		};
		
		return editor;
	}, //codeMirror
	
	showLoadingDialog: function(){
		bootbox.dialog({
			message: '<p style="text-align: center">loading...</p><div class="loading"></div>',
			closeButton: false
		});
	}, //showLoadingDialog
	
	getColumnCheckBox: function(column){
		var dom = '';
		dom += '<div>';
		dom += 		'<label>';
		dom += 			'<input type="checkbox" value="{columnName}" />{columnName} ({columnType})'.format(column, column);
		dom += 		'</label>';
		dom += '</div>';
		return dom;
	}, //getColumnCheckBox
	
	getColumnRadioBox: function(column){
		var dom = '';
		dom += '<div>';
		dom += 		'<label>';
		dom += 			'<input type="radio" name="condition-column" value="{columnName}" />{columnName} ({columnType})'.format(column, column);
		dom += 		'</label>';
		dom += '</div>';
		return dom;
	} //getColumnRadioBox
}; //View

Controller = function(){
	this.model = new Model();
	this.view = new View();
}; //INIT
Controller.prototype = {
	selectDbVendor: function(dbVendor){
		this.model.db2FileModel.setDatabase({
			vendor: dbVendor
		});
		
		$('#card-input-database #text-database-port').val(this.model.jdbcTmpl[dbVendor].port);
	
		if(dbVendor === 'etc')
			return;
		
		$('#card-input-database #text-jdbc-driver').val(this.model.jdbcTmpl[dbVendor].driver);
		var connUrl = this.model.jdbcTmpl[dbVendor].connUrl;
		var connUrlParams = {
			ip: $('#card-input-database #text-database-ip').val(),
			port: $('#card-input-database #text-database-port').val(),
			database: $('#card-input-database #text-database-sid').val()
		};
		connUrl = connUrl.format(connUrlParams);
		$('#card-input-database #text-jdbc-conn-url').val(connUrl);
	}, //autoCompleteJdbcInfo
	
	openPrevCard: function(toCardId){
		$('.card').hide(300);
		$('#' + toCardId).show(300);
	},
	
	openCard: function(fromCardId, toCardId){
		try{
			switch(fromCardId){
			case 'card-input-database':
				var driver = $('#card-input-database #text-jdbc-driver').val();
				var connUrl = $('#card-input-database #text-jdbc-conn-url').val();
				var username = $('#card-input-database #text-jdbc-username').val();
				var password = $('#card-input-database #text-jdbc-password').val();
				
				try{
					precondition(driver != null && driver.trim().length > 0, 'invalid driver');
					precondition(connUrl != null && connUrl.trim().length > 0, 'invalid connection url');
					precondition(username != null && username.trim().length > 0, 'invalid username');
					precondition(password != null && password.trim().length > 0, 'invalid password');
				} catch(errmsg){
					bootbox.alert(errmsg);
					return;
				} //catch
				
				this.model.db2FileModel.setDatabase({
					driver: driver,
					connUrl: connUrl,
					username: username,
					password: password
				});
				break;
				
			case 'card-set-table-for-query':
				this.model.db2FileModel.setTableName($('#card-set-table-for-query #dropdown-table').attr('value'));
				break;
				
			case 'card-set-column-for-query':
				var columns = [];
				$('#div-columns input[type="checkbox"]:checked').each(function(index, value){
					columns.push($(value).val());
				});
				this.model.db2FileModel.setSelectColumn(columns);
				break;
				
			case 'card-set-binding-type':
				var conditionType = $('#card-set-binding-type input[type="radio"][name="condition"]:checked').val();
				var conditionColumn = null;
				if(conditionType === 'date-condition'){
					conditionColumn = $('#card-set-binding-type #columns-for-date-condition input[type="radio"][name="condition-column"]:checked').val();
				} else if(conditionType === 'sequence-condition'){
					conditionColumn = $('#card-set-binding-type #columns-for-sequence-condition input[type="radio"][name="condition-column"]:checked').val();
				} //if
				
				this.model.db2FileModel.setCondition({
					type: conditionType,
					column: conditionColumn
				});
			
				if(conditionType !== 'no-condition'){
					if(conditionColumn == null || conditinoColumn.trim().length == 0){
						bootbox.alert('invalid condition column');
						return;
					} //if
				} //if
				break;
				
			case 'card-etc-parameter':
				this.model.db2FileModel
					.setPeriod($('#card-etc-parameter #text-period').val())
					.setDelimiter($('#card-etc-parameter #text-delimiter').val())
					.setOutputPath($('#card-etc-parameter #text-output-path').val())
					.setCharset($('#card-etc-parameter #text-charset').val());
				break;
			} //switch
				
			$('.card').hide(300);
			$('#' + toCardId).show(300);
			
			switch(toCardId){
			case 'card-set-table-for-query':
				this.loadTables();
				break;
			case 'card-set-column-for-query':
				this.loadColumns(function(columns){
					var columnsRoot = $('#div-columns').empty();
					for(var i=0; i<columns.length; i++)
						columnsRoot.append(controller.view.getColumnCheckBox(columns[i]));
				});
				break;
			case 'card-set-binding-type':
				this.loadColumns(function(columns){
					var columnsRoot4Date = $('#card-set-binding-type #columns-for-date-condition').empty();
					var columnsRoot4Sequence = $('#card-set-binding-type #columns-for-sequence-condition').empty();
					for(var i=0; i<columns.length; i++){
						var dom = controller.view.getColumnRadioBox(columns[i]);
						columnsRoot4Date.append(dom);
						columnsRoot4Sequence.append(dom);
					} //for i
				});
				break;
			case 'card-etc-parameter':
				break;
			case 'card-script':
				var script = new Db2FileScriptMaker().setModel(this.model.db2FileModel).script();
				this.view.scriptEditor.setValue(script);
				break;
			} //switch
		} catch(e){
			this.openPrevCard(fromCardId);
			bootbox.alert(JSON.stringify(e));
		} //catch
	}, //openCard
	
	loadTables: function(){
		this.view.showLoadingDialog();
		$.getJSON('/Tables/', {
			driver: this.model.db2FileModel.database.driver,
			connUrl: this.model.db2FileModel.database.connUrl,
			username: this.model.db2FileModel.database.username,
			password: this.model.db2FileModel.database.password
		})
		.fail(function(e){
			bootbox.alert(JSON.stringify(e));
		}).done(function(resp){
			bootbox.hideAll();
			if(resp.success != 1){
				bootbox.alert(resp.errmsg);
				return;
			} //if
			
			if(resp.tables.length == 0){
				bootbox.alert('no tables exists');
				return;
			} //if
			
			searchDropdown.newSearchDropdown('dropdown-table', null, resp.tables);
		});
	}, //loadTables
	
	loadColumns: function(callback){
		this.view.showLoadingDialog();
		$.getJSON('/Columns/{}/'.format(this.model.db2FileModel.tableName), {
			driver: this.model.db2FileModel.database.driver,
			connUrl: this.model.db2FileModel.database.connUrl,
			username: this.model.db2FileModel.database.username,
			password: this.model.db2FileModel.database.password
		})
		.fail(function(e){
			bootbox.alert(JSON.stringify(e));
		}).done(function(resp){
			bootbox.hideAll();
			if(resp.success != 1){
				bootbox.alert(resp.errmsg);
				return;
			} //if
			
			if(resp.columns.length == 0){
				bootbox.alert('no columns exists');
				return;
			} //if
			
			callback(resp.columns);
		});
	}, //loadColumns
	
	querySampleData: function(){
		var columns = [];
		$('#card-set-column-for-query #div-columns input[type="checkbox"]:checked').each(function(index, value){
			columns.push(value.value);
		});
		if(columns.length == 0){
			bootbox.alert("no columns selected");
			return;
		} //if
		
		var query = 'SELECT {} FROM {}'.format(columns.toString(), controller.model.tableName);
		
		bootbox.prompt('QUERY: {}<br />how many rows?'.format(query), function(result){
			if(result == null)
				return;
			var rowCount = parseInt(result);
			if(isNaN(rowCount)){
				bootbox.alert('invalid row count');
				return;
			} //if
			
			$.getJSON('/QuerySampleData/', {
				driver: controller.model.db2FileModel.database.driver,
				connUrl: controller.model.db2FileModel.database.connUrl,
				username: controller.model.db2FileModel.database.username,
				password: controller.model.db2FileModel.database.password,
				query: query,
				rowCount: rowCount
			}).done(function(resp){
				if(resp.success != 1){
					bootbox.alert(resp.errmsg);
					return;
				} //if
				
				bootbox.dialog({
					title: 'sample data',
					message: '<textarea class="form-control" rows="8">{}</textarea>'.format(JSON.stringify(resp.sampleData, null, 2))
				});
			});
		});
	}, //querySampleData
	
	setConditionType: function(condition){
		switch(condition){
		case 'no-condition':
			$('#card-set-binding-type #columns-for-date-condition').hide(300);
			$('#card-set-binding-type #columns-for-sequence-condition').hide(300);
			break;
		case 'date-condition':
			$('#card-set-binding-type #columns-for-date-condition').show(300);
			$('#card-set-binding-type #columns-for-sequence-condition').hide(300);
			break;
		case 'sequence-condition':
			$('#card-set-binding-type #columns-for-date-condition').hide(300);
			$('#card-set-binding-type #columns-for-sequence-condition').show(300);
			break;
		} //switch
	} //setConditionType
}; //Controller

$(function(){
	controller = new Controller();
	
	//DEBUG
	$('#card-input-database input[type="radio"][name="dbVendor"][value="oracle"]').click();
	$('#card-input-database #text-database-ip').val('192.168.10.101');
	$('#card-input-database #text-database-sid').val('spiderx');
	$('#card-input-database #text-jdbc-username').val('admin');
	$('#card-input-database #text-jdbc-password').val('admin');
	controller.selectDbVendor('oracle');
	//DEBUG
});

function precondition(expression, msg){
	if(expression === false)
		throw msg;
} //precondition
