Db2DbModel = function(){
	/*
		{
	  		period: (string),
	  		version: (string),
	  		src: {
				selectColumn: (string),
				tableName: (string),
				condition: {
					type: (string)('no-condition' | 'date-condition' | 'sequence-condition'),
					column: (string)
				},
				database: {
					vendor: (string, lower case only),
		  			driver: (string),
		  			connUrl: (string),
		  			username: (string),
		  			password: (string)
				}
	 		},
	 		desc: {
				insertColumn: (string),
				tableName: (string),
				database: {
					vendor: (string, lower case only),
		  			driver: (string),
		  			connUrl: (string),
		  			username: (string),
		  			password: (string)
				}
	 		}
	 	}
	 */
	this.src = {};
	this.src.condition = {};
	this.src.database = {};
	this.dest = {};
	this.dest.database = {};


	this.setPeriod = function(period){
		try{
			eval(period);
		} catch(e){
			throw new Error('invalid period value');
		} //catch
		
		this.period = period;
		return this;
	}; //setPeriod

	this.setSrcSelectColumn = function(selectColumn) {
		if((selectColumn instanceof Array) === false)
			throw new Error('invalid selectColumn type');
		this.src.selectColumn = selectColumn;
		return this;
	}; //setSrcSelectColumn

	this.setDestInsertColumn = function(insertColumn) {
		if((insertColumn instanceof Array) === false)
			throw new Error('invalid insertCOlumn type');
		this.dest.insertColumn = insertColumn;
		return this;
	}; //setDestInsertColumn

	this.setSrcTableName = function(tableName) {
		this.src.tableName = tableName;
		return this;
	}; //setSrcTableName

	this.setDestTableName = function(tableName) {
		this.dest.tableName = tableName;
		return this;
	}; //setDestTableName

	this.setCondition = function(condition){
		if(condition.type !== undefined){
			precondition(condition.type === 'no-condition' || 
				condition.type === 'date-condition' || 
				condition.type === 'sequence-condition', 
				'invalid condition type');
			
			this.src.condition.type = condition.type;
		} //if
		
		if(condition.column !== undefined)
			this.src.condition.column = condition.column;
		
		return this;
	}; //setCondition

	//private
	var setDatabase = function(target, database) {
		if(database.vendor !== undefined)
			target.database.vendor = database.vendor;
		
		if(database.driver !== undefined)
			target.database.driver = database.driver;
		
		if(database.connUrl !== undefined)
			target.database.connUrl = database.connUrl;
	
		if(database.username !== undefined)
			target.database.username = database.username;
		
		if(database.password !== undefined)
			target.database.password = database.password;
	}; //setDatabase

	this.setSrcDatabase = function(database){
		setDatabase(this.src, database);
		return this;
	}; //setSrcDatabase

	this.setDestDatabase = function(database){
		setDatabase(this.dest, database);
		return this;
	}; //setDestDatabase

	this.setVersion = function(version) {
		this.version = version;
		return this;
	}; //setVersion
}; //Db2DbModel

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
	
	this.db2DbModel = new Db2DbModel();
}; //INIT

View = function(){
	var theme = $('input#hidden-script-editor-theme').val();

	var codeMirror = function(dom, theme){
		var editor = CodeMirror.fromTextArea(dom, {
			mode: "javascript",
			indentWithTabs: true
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
	}; //codeMirror

	this.scriptEditor = codeMirror($('#textarea-script')[0], theme);

	this.panelViewInputDatabase = new PanelViewInputDatabase();
	this.panelViewSetTableForQuery = new PanelViewSetTableForQuery();
	this.panelViewSetColumnForQuery = new PanelViewSetColumnForQuery();
	this.panelViewSetBindingType = new PanelViewSetBindingType();
	this.panelViewEtcParameter = new PanelViewEtcParameter();
	this.panelViewScript = new PanelViewScript();
}; //View

PanelViewInputDatabase = function() {
	this.hide = function() {
		$('#panel-input-database').hide(300);
	}; //hide

	//private
	var init = function() {
	}; //init

	this.show = function() {
		$('#panel-input-database').show(300);
		init();
	}; //show

	//private
	var autoCompleteJdbcConnUrl = function(srcOrDest) {
		var jdbcTmpl = model.jdbcTmpl[model.db2DbModel.src.database.vendor];

		if(srcOrDest === 'src') {
			$('#text-src-jdbc-conn-url').val(jdbcTmpl.connUrl.format({
				ip: $('#panel-input-database #text-src-database-ip').val(),
				port: $('#panel-input-database #text-src-database-port').val(),
				database: $('#panel-input-database #text-src-database-sid').val()
			}));
		} else if(srcOrDest === 'dest') {
			$('#text-dest-jdbc-conn-url').val(jdbcTmpl.connUrl.format({
				ip: $('#panel-input-database #text-dest-database-ip').val(),
				port: $('#panel-input-database #text-dest-database-port').val(),
				database: $('#panel-input-database #text-dest-database-sid').val()
			}));
		} //if
	}; //autoCompleteJdbcConnUrl

	this.autoCompleteJdbcInfo = function(dom) {
		if(dom.name === 'srcDbVendor') {
			model.db2DbModel.setSrcDatabase({ vendor: dom.value });
			var jdbcTmpl = model.jdbcTmpl[dom.value];
			$('#text-src-database-port').val(jdbcTmpl.port);
			$('#text-src-jdbc-driver').val(jdbcTmpl.driver);
			autoCompleteJdbcConnUrl('src');
		} else if(dom.name === 'destDbVendor') {
			model.db2DbModel.setDestDatabase({ vendor: dom.value });
			var jdbcTmpl = model.jdbcTmpl[dom.value];
			$('#text-dest-database-port').val(jdbcTmpl.port);
			$('#text-dest-jdbc-driver').val(jdbcTmpl.driver);
			autoCompleteJdbcConnUrl('dest');
		} else if(dom.id === 'text-src-database-ip' || dom.id === 'text-src-database-port' || dom.id === 'text-src-database-sid') {
			autoCompleteJdbcConnUrl('src');
		} else if(dom.id === 'text-dest-database-ip' || dom.id === 'text-dest-database-port' || dom.id === 'text-dest-database-sid') {
			autoCompleteJdbcConnUrl('dest');
		} //if
	}; //autoCompleteJdbcInfo

	//private
	var getParameter = function() {
		var srcDatabase = {
			driver: $('#panel-input-database #text-src-jdbc-driver').val(),
			connUrl: $('#panel-input-database #text-src-jdbc-conn-url').val(),
			username: $('#panel-input-database #text-src-jdbc-username').val(),
			password: $('#panel-input-database #text-src-jdbc-password').val()
		};
		var destDatabase = {
			driver: $('#panel-input-database #text-dest-jdbc-driver').val(),
			connUrl: $('#panel-input-database #text-dest-jdbc-conn-url').val(),
			username: $('#panel-input-database #text-dest-jdbc-username').val(),
			password: $('#panel-input-database #text-dest-jdbc-password').val()
		};
				
		try{
			precondition(srcDatabase.driver != null && srcDatabase.driver.trim().length > 0, 'invalid source database driver');
			precondition(srcDatabase.connUrl != null && srcDatabase.connUrl.trim().length > 0, 'invalid source database connection url');
			precondition(srcDatabase.username != null && srcDatabase.username.trim().length > 0, 'invalid source database username');
			precondition(srcDatabase.password != null && srcDatabase.password.trim().length > 0, 'invalid source database password');
			precondition(destDatabase.driver != null && destDatabase.driver.trim().length > 0, 'invalid destination database driver');
			precondition(destDatabase.connUrl != null && destDatabase.connUrl.trim().length > 0, 'invalid destination database connection url');
			precondition(destDatabase.username != null && destDatabase.username.trim().length > 0, 'invalid destination database username');
			precondition(destDatabase.password != null && destDatabase.password.trim().length > 0, 'invalid destination database password');
		} catch(errmsg){
			bootbox.alert(errmsg);
			return;
		} //catch

		return {
			srcDatabase: srcDatabase,
			destDatabase: destDatabase
		};
	}; //getParameter

	this.next = function() {
		var params = getParameter();
		
		showLoading();
		var whens = [
			$.getJSON('/REST/Meta/Encrypt/', { value: params.srcDatabase.username }),
			$.getJSON('/REST/Meta/Encrypt/', { value: params.srcDatabase.password }),
			$.getJSON('/REST/Meta/Encrypt/', { value: params.destDatabase.username }),
			$.getJSON('/REST/Meta/Encrypt/', { value: params.destDatabase.password })
		];
		$.when.apply($, whens).done(function(respObj1, respObj2, respObj3, respObj4){
			closeLoading();

			var resps = [ respObj1[0], respObj2[0], respObj3[0], respObj4[0] ];

			[ resps[0], resps[1], resps[2], resps[3] ].every(function(resp){
				if(resp.success !== 1) {
					bootbox.alert(JSON.stringify(resp));
					return false;
				} //if
				return true;
			});

			params.srcDatabase.username = resps[0].value;
			params.srcDatabase.password = resps[1].value;
			params.destDatabase.username = resps[2].value;
			params.destDatabase.password = resps[3].value;

			model.db2DbModel.setSrcDatabase(params.srcDatabase);
			model.db2DbModel.setDestDatabase(params.destDatabase);

			this.hide();
			view.panelViewSetTableForQuery.show();
		}.bind(this)).fail(function(err){
			closeLoading();
			bootbox.alert(JSON.stringify(err));
		});
	}; //next
}; //PanelViewInputDatabase

PanelViewSetTableForQuery = function() {
	this.hide = function() {
		$('#panel-set-table-for-query').hide(300);
	}; //hide
	
	//private
	var init = function() {
		showLoading();
		var whens = [
			$.getJSON('/REST/Database/Tables/', model.db2DbModel.src.database),
			$.getJSON('/REST/Database/Tables/', model.db2DbModel.dest.database)
		];
		$.when.apply($, whens).done(function(respObj1, respObj2) {
			var resps = [ respObj1[0], respObj2[0] ];

			closeLoading();

			[ resps[0], resps[1] ].every(function(resp) {
				if(resp.success !== 1) {
					bootbox.alert(JSON.stringify(resp));
					return false;
				} //if 
				return true;
			});

			searchDropdown.newSearchDropdown('#dropdown-src-table', null, resps[0].tables);
			searchDropdown.newSearchDropdown('#dropdown-dest-table', null, resps[1].tables);
		}).fail(function(err){
			closeLoading();
			bootbox.alert(JSON.stringify(err));
		});
	}; //init

	this.show = function() {
		init();
		$('#panel-set-table-for-query').show(300);
	}; //show

	var getParameter = function() {
		return {
			srcTable: $('#panel-set-table-for-query #dropdown-src-table').attr('value'),
			destTable: $('#panel-set-table-for-query #dropdown-dest-table').attr('value')
		};
	}; //inputCheck

	this.prev = function() {
		this.hide();
		view.panelViewInputDatabase.show();
	}; //prev

	this.next = function() {
		var params = getParameter();
		if(params.srcTable == null || params.destTable == null) {
			bootbox.alert('select table');
			return;
		} //if

		model.db2DbModel.setSrcTableName(params.srcTable);
		model.db2DbModel.setDestTableName(params.destTable);

		this.hide();
		view.panelViewSetColumnForQuery.show();
	}; //next
}; //PanelViewSetTableForQuery

function PanelViewSetColumnForQuery() {
	this.selectedColumnPairs = [];

	this.hide = function() {
		$('#panel-set-column-for-query').hide(300);
	}; //hide

	//private
	var init = function() {
		this.selectedColumnPairs = [];
		$('#selected-column-pairs').empty();

		showLoading();

		var whens = [
			$.getJSON('/REST/Database/Columns/{}/'.format(model.db2DbModel.src.tableName), model.db2DbModel.src.database),
			$.getJSON('/REST/Database/Columns/{}/'.format(model.db2DbModel.dest.tableName), model.db2DbModel.dest.database)
		];

		$.when.apply($, whens).done(function(respObj1, respObj2){
			var resps = [ respObj1[0], respObj2[0] ];

			closeLoading();

			[ resps[0], resps[1] ].every(function(resp){
				if(resp.success !== 1) {
					bootbox.alert(JSON.stringify(resp));
					return false;
				} //if
				return true;
			});

			var srcColumns = [], destColumns = [];
			resps[0].columns.every(function(colObj){
				srcColumns.push('{}({})'.format(colObj.columnName, colObj.columnType));
				return true;
			});
			resps[1].columns.every(function(colObj){
				destColumns.push('{}({})'.format(colObj.columnName, colObj.columnType));
				return true;
			});

			searchDropdown.newSearchDropdown('#panel-set-column-for-query #src-columns', null, srcColumns);
			searchDropdown.newSearchDropdown('#panel-set-column-for-query #dest-columns', null, destColumns);
		}).fail(function(err) {
			closeLoading();
			bootbox.alert(JSON.stringify(err));
		});
	}.bind(this); //init

	this.show = function() {
		$('#panel-set-column-for-query').show(300);
		init();
	}; //show

	this.addColumnPair = function() {
		var srcColumn = $('#panel-set-column-for-query #src-columns').attr('value').split('(')[0];
		var destColumn = $('#panel-set-column-for-query #dest-columns').attr('value').split('(')[0];

		this.selectedColumnPairs.push([ srcColumn, destColumn ]);

		var tagTokenDOM = $('<span class="tag-token"><span>{}</span><a href="#">x</a>'.format(srcColumn + ' - ' + destColumn));
		tagTokenDOM.find('a').click(function(){
			view.panelViewSetColumnForQuery.removeColumnPair(srcColumn, destColumn);
			tagTokenDOM.remove();
		});
		tagTokenDOM.appendTo($('#selected-column-pairs'));
	}; //addColumnpair

	this.removeColumnPair = function(srcColumn, destColumn) {
		this.selectedColumnPairs.every(function(columnPair, index){
			if(columnPair === [ srcColumn, destColumn ]) {
				this.selectedColumnPairs.splice(index, 1);
				return false;
			} //if
			return true;
		});
	}; //removeColumnPair

	this.prev = function() {
		this.hide();
		view.panelViewSetTableForQuery.show();
	}; //prev

	this.next = function() {
		if(this.selectedColumnPairs.length === 0) {
			bootbox.alert('select columns');
			return;
		} //if

		var srcColumns = [], destColumns = [];
		this.selectedColumnPairs.every(function(columnPair){
			srcColumns.push(columnPair[0]);
			destColumns.push(columnPair[1]);
			return true;
		});

		model.db2DbModel.setSrcSelectColumn(srcColumns);
		model.db2DbModel.setDestInsertColumn(destColumns);

		this.hide();
		view.panelViewSetBindingType.show();
	}; //next
} //PanelViewSetColumnForQuery

function PanelViewSetBindingType() {
	this.hide = function() {
		$('#panel-set-binding-type').hide(300);
	}; //hide

	//private
	var init = function() {
		showLoading();
		$.getJSON('/REST/Database/Columns/{}/'.format(model.db2DbModel.src.tableName), model.db2DbModel.src.database)
		.done(function(resp){
			closeLoading();
			if(resp.success !== 1) {
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			var dom = jade.compile($('script#column-radio-box[type="text/x-jade"]').html())({ columns: resp.columns });
			$('#panel-set-binding-type #columns-for-date-condition').empty().append(dom);
			$('#panel-set-binding-type #columns-for-sequence-condition').empty().append(dom);

		}).fail(function(err){
			closeLoading();
			bootbox.alert(JSON.stringify(err));
		});
	}; //init

	this.show = function() {
		$('#panel-set-binding-type').show(300);
		init();
	}; //show

	this.setBindingType = function(condition) {
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
	}; //setBindingType

	this.prev = function() {
		this.hide();
		view.panelViewSetColumnForQuery.show();
	}; //prev

	//private
	var getParameter = function() {
		var conditionType = $('#panel-set-binding-type input[type="radio"][name="condition"]:checked').val();
		var conditionColumn = null;
		if(conditionType === 'date-condition'){
			conditionColumn = $('#panel-set-binding-type #columns-for-date-condition input[type="radio"][name="condition-column"]:checked').val();
		} else if(conditionType === 'sequence-condition'){
			conditionColumn = $('#panel-set-binding-type #columns-for-sequence-condition input[type="radio"][name="condition-column"]:checked').val();
		} //if

		if(conditionType !== 'no-condition'){
			if(conditionColumn === null || conditionColumn.trim().length == 0){
				bootbox.alert('invalid condition column');
				return null;
			} //if
		} //if

		return {
			type: conditionType,
			column: conditionColumn
		};
	}; //getParameter

	this.next = function() {
		var params = getParameter();
		if(params === null)
			return;

		model.db2DbModel.setCondition(params);
				
		this.hide();
		view.panelViewEtcParameter.show();
	}; //next
} //PanelViewSetBindingType

function PanelViewEtcParameter() {
	this.hide = function() {
		$('#panel-etc-parameter').hide(300);
	}; //hide

	//private
	var init = function() {
	}; //init

	this.show = function() {
		$('#panel-etc-parameter').show(300);
		init();
	}; //show

	this.prev = function() {
		this.hide();
		view.panelViewSetBindingType.show();
	}; //prev

	var getParameter = function() {
		return {
			period: $('#panel-etc-parameter input#text-period').val()
		};
	}; //getParameter

	this.next = function() {
		var params = getParameter();
		model.db2DbModel.setPeriod(params.period);

		this.hide();
		view.panelViewScript.show();
	}; //next
} //PanelViewEtcParameter

function PanelViewScript() {
	this.hide = function() {
		$('#panel-script').hide(300);
	}; //hide

	//private
	var init = function() {
		showLoading();
		$.getJSON('/REST/Meta/Version/', {})
		.fail(function(e){
			closeLoading();
			bootbox.alert(JSON.stringify(e));
		}).done(function(resp){
			closeLoading();
			model.db2DbModel.setVersion(resp.version);

			var script = new Db2DbScriptMaker().setModel(model.db2DbModel).script();
			view.scriptEditor.setValue(script);
		});
	}; //init

	this.show = function() {
		$('#panel-script').show(300);
		setTimeout(init, 400);
	}; //show

	//private
	var getParameter = function() {
		var script = view.scriptEditor.getValue();

		return { script: script };
	}; //getParameter

	this.save = function() {
		var script = getParameter().script;

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
	}; //save
} //PanelViewScript











Controller = function(){
}; //INIT
Controller.prototype = {
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
	} //querySampleData
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();

	$('.panel').hide();
	$('#panel-input-database').show(300);

	$('input[type="radio"][name="srcDbVendor"][value="oracle"]').click();
	$('input[type="radio"][name="destDbVendor"][value="oracle"]').click();

	//DEBUG
	$('#text-src-database-ip').val('192.168.10.101').keyup();
	$('#text-src-database-sid').val('spiderx').keyup();
	$('#text-src-jdbc-username').val('admin_test').keyup();
	$('#text-src-jdbc-password').val('admin_test').keyup();

	$('#text-dest-database-ip').val('192.168.10.101').keyup();
	$('#text-dest-database-sid').val('spiderx').keyup();
	$('#text-dest-jdbc-username').val('admin_test').keyup();
	$('#text-dest-jdbc-password').val('admin_test').keyup();
});

function precondition(expression, msg){
	if(expression === false)
		throw msg;
} //precondition