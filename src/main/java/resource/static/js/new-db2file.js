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
	}, //setDatabase

	setVersion: function(version){
		this.version = version;
		return this;
	} //setVersion
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
	var theme = $('input#hidden-script-editor-theme').val();
	this.scriptEditor = this.codeMirror($('#textarea-script')[0], theme);
}; //INIT
View.prototype = {
	codeMirror: function(dom, theme){
		var editor = CodeMirror.fromTextArea(dom, {
			lineNumbers: true,
			mode: {name: "javascript", globalVars: true}
		});
		
		editor.setSize(null, 400);
		editor.setOption("theme", theme);
		
		var originalHint = CodeMirror.hint.javascript;
		CodeMirror.hint.javascript = function(cm){
			var inner = originalHint(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
			var customAutoComplete = model.customAutoComplete;
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
	} //showLoadingDialog
}; //View

Controller = function(){
}; //INIT
Controller.prototype = {
	openPrevCard: function(toCardId){
		$('.panel').hide(300);
		$('#' + toCardId).show(300);
	},
	
	openCard: function(fromCardId, toCardId){
		try{
			switch(fromCardId){
			case 'panel-input-database':
				var driver = $('#panel-input-database #text-jdbc-driver').val();
				var connUrl = $('#panel-input-database #text-jdbc-conn-url').val();
				var username = $('#panel-input-database #text-jdbc-username').val();
				var password = $('#panel-input-database #text-jdbc-password').val();
				
				try{
					precondition(driver != null && driver.trim().length > 0, 'invalid driver');
					precondition(connUrl != null && connUrl.trim().length > 0, 'invalid connection url');
					precondition(username != null && username.trim().length > 0, 'invalid username');
					precondition(password != null && password.trim().length > 0, 'invalid password');
				} catch(errmsg){
					bootbox.alert(errmsg);
					return;
				} //catch
				
				model.db2FileModel.setDatabase({
					driver: driver,
					connUrl: connUrl,
					username: null,
					password: null
				});

				this.encrypt(username, function(encryptedUsername){
					model.db2FileModel.setDatabase({ username: encryptedUsername });
				});

				this.encrypt(password, function(encryptedPassword){
					model.db2FileModel.setDatabase({ password : encryptedPassword });
				});
				
				break;
				
			case 'panel-set-table-for-query':
				model.db2FileModel.setTableName($('#panel-set-table-for-query #dropdown-table').attr('value'));
				break;
				
			case 'panel-set-column-for-query':
				var columns = [];
				$('#div-columns input[type="checkbox"]:checked').each(function(index, value){
					columns.push($(value).val());
				});
				model.db2FileModel.setSelectColumn(columns);
				break;
				
			case 'panel-set-binding-type':
				var conditionType = $('#panel-set-binding-type input[type="radio"][name="condition"]:checked').val();
				var conditionColumn = null;
				if(conditionType === 'date-condition'){
					conditionColumn = $('#panel-set-binding-type #columns-for-date-condition input[type="radio"][name="condition-column"]:checked').val();
				} else if(conditionType === 'sequence-condition'){
					conditionColumn = $('#panel-set-binding-type #columns-for-sequence-condition input[type="radio"][name="condition-column"]:checked').val();
				} //if
				
				model.db2FileModel.setCondition({
					type: conditionType,
					column: conditionColumn
				});
			
				if(conditionType !== 'no-condition'){
					if(conditionColumn === null || conditionColumn.trim().length == 0){
						bootbox.alert('invalid condition column');
						return;
					} //if
				} //if
				break;
				
			case 'panel-etc-parameter':
				var outputPath = $('#panel-etc-parameter #text-output-path').val();
				if(outputPath.indexOf('/', outputPath.length - '/'.length) === -1 && outputPath.indexOf('\\', outputPath.length - '\\'.length) === -1)
					outputPath += '/';

				model.db2FileModel
					.setPeriod($('#panel-etc-parameter #text-period').val())
					.setDelimiter($('#panel-etc-parameter #text-delimiter').val())
					.setOutputPath(outputPath)
					.setCharset($('#panel-etc-parameter #text-charset').val());
				break;
			} //switch
				
			$('.panel').hide(300);
			$('#' + toCardId).show(300);
			
			switch(toCardId){
			case 'panel-set-table-for-query':
				this.loadTables('dropdown-table');
				break;
			case 'panel-set-column-for-query':
				this.loadColumns(function(columns){
					var dom = jade.compile($('script#column-check-box[type="text/x-jade"]').html())({ columns: columns });
					$('#div-columns').empty().append(dom);
				});
				break;
			case 'panel-set-binding-type':
				this.loadColumns(function(columns){
					var dom = jade.compile($('script#column-radio-box[type="text/x-jade"]').html())({ columns: columns });
					$('#panel-set-binding-type #columns-for-date-condition').empty().append(dom);
					$('#panel-set-binding-type #columns-for-sequence-condition').empty().append(dom);
				});
				break;
			case 'panel-etc-parameter':
				break;
			case 'panel-script':
			view.showLoadingDialog();
				$.getJSON('/REST/Meta/Version/', {})
				.fail(function(e){
					bootbox.hideAll();
					bootbox.alert(JSON.stringify(e));
				}).done(function(resp){
					bootbox.hideAll();
					model.db2FileModel.setVersion(resp.version);
					var script = new Db2FileScriptMaker().setModel(model.db2FileModel).script();
					view.scriptEditor.setValue(script);
				});
				break;
			} //switch
		} catch(e){
			console.log(e);
			this.openPrevCard(fromCardId);
			bootbox.alert(JSON.stringify(e));
		} //catch
	}, //openCard
	
	autoCompleteJdbcInfo: function(srcDOM){
		var dbVendor = $('#panel-input-database input[type="radio"][name="dbVendor"]:checked').val();

		model.db2FileModel.setDatabase({ vendor: dbVendor });

		var portDOM = $('#panel-input-database #text-database-port');
		if( ('text-database-port' !== srcDOM.id && '' === portDOM.val()) ||
			('dbVendor' === srcDOM.name) )
			portDOM.val(model.jdbcTmpl[dbVendor].port);

		if('dbVendor' === srcDOM.name && 'etc' !== dbVendor)
			$('#panel-input-database #text-jdbc-driver').val(model.jdbcTmpl[dbVendor].driver);
		
		var connUrl = model.jdbcTmpl[dbVendor].connUrl;
		var connUrlParams = {
			ip: $('#panel-input-database #text-database-ip').val(),
			port: $('#panel-input-database #text-database-port').val(),
			database: $('#panel-input-database #text-database-sid').val()
		};
		connUrl = connUrl.format(connUrlParams);
		$('#panel-input-database #text-jdbc-conn-url').val(connUrl);
	}, //autoCompleteJdbcInfo

	loadTables: function(targetDOM){
		if(model.db2FileModel.database.username === null || model.db2FileModel.database.password === null){
			setTimeout(function(){
				controller.loadTables(targetDOM);
			}, 100);
			return;
		} //if

		view.showLoadingDialog();
		$.getJSON('/REST/Database/Tables/', {
			driver: model.db2FileModel.database.driver,
			connUrl: model.db2FileModel.database.connUrl,
			username: model.db2FileModel.database.username,
			password: model.db2FileModel.database.password
		})
		.fail(function(e){
			bootbox.hideAll();
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
			
			searchDropdown.newSearchDropdown(targetDOM, null, resp.tables);
		});
	}, //loadTables
	
	loadColumns: function(callback){
		view.showLoadingDialog();
		$.getJSON('/REST/Database/Columns/{}/'.format(model.db2FileModel.tableName), {
			driver: model.db2FileModel.database.driver,
			connUrl: model.db2FileModel.database.connUrl,
			username: model.db2FileModel.database.username,
			password: model.db2FileModel.database.password
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
	
	selectAllColumns: function(){
		$('input[type="checkbox"][name="select-column"]').attr('checked', true);
	}, //selectAllColumns

	querySampleData: function(){
		var columns = [];
		$('#panel-set-column-for-query #div-columns input[type="checkbox"]:checked').each(function(index, value){
			columns.push(value.value);
		});
		if(columns.length == 0){
			bootbox.alert("no columns selected");
			return;
		} //if
		
		var query = 'SELECT {} FROM {}'.format(columns.toString(), model.db2FileModel.tableName);

		bootbox.prompt('QUERY: {}<br />how many rows?'.format(query), function(result){
			if(result == null)
				return;
			var rowCount = parseInt(result);
			if(isNaN(rowCount)){
				bootbox.alert('invalid row count');
				return;
			} //if
			
			$.getJSON('/REST/Database/QuerySampleData/', {
				driver: model.db2FileModel.database.driver,
				connUrl: model.db2FileModel.database.connUrl,
				username: model.db2FileModel.database.username,
				password: model.db2FileModel.database.password,
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
			$('#panel-set-binding-type #columns-for-date-condition').hide(300);
			$('#panel-set-binding-type #columns-for-sequence-condition').hide(300);
			break;
		case 'date-condition':
			$('#panel-set-binding-type #columns-for-date-condition').show(300);
			$('#panel-set-binding-type #columns-for-sequence-condition').hide(300);
			break;
		case 'sequence-condition':
			$('#panel-set-binding-type #columns-for-date-condition').hide(300);
			$('#panel-set-binding-type #columns-for-sequence-condition').show(300);
			break;
		} //switch
	}, //setConditionType
	saveScript: function(){
		var script = view.scriptEditor.getValue();
		bootbox.prompt('input script title: ', function(title){
			if(title === null) 
				return;
			$.post('/REST/Script/New/{}/'.format(title), { script: script }, function(resp){
				if(resp.success !== 1){
					bootbox.alert(JSON.stringify(resp));
					return;
				} //if
				bootbox.alert('script saved', function(){
					window.location.href = '/';
				});
			}, 'json');
		});
	}, //saveScript
	encrypt: function(value, callback){
		$.getJSON('/REST/Meta/Encrypt/', { value: value }).fail(function(e){
			bootbox.alert(JSON.stringify(e));
		}).done(function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			callback(resp.value);
		});
	} //encrypt
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();

	$('.panel').hide();
	$('#panel-input-database').show(300);

	//DEBUG
	$('#panel-input-database input[type="radio"][name="dbVendor"][value="mysql"]').click();
	$('#panel-input-database #text-database-ip').val('localhost');
	$('#panel-input-database #text-database-sid').val('nawa');
	$('#panel-input-database #text-jdbc-username').val('nawa');
	$('#panel-input-database #text-jdbc-password').val('nawadkagh');
	//DEBUG
});

function precondition(expression, msg){
	if(expression === false)
		throw msg;
} //precondition
