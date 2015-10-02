var React = require('react'),
	util  require('util'),
	precond = require('precond'),
	Promise = require('promise');

var jdbcTmpl = {
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
};

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
var db2FileModel = new Db2FileModel();

var Db2FileView = React.createClass({
	// 1. input-database
	// 2. set-table-for-query
	getInitialState() {
		return {
			currentPanel: 'input-database'
		};
	},

	onInputDatabasePanelNext() {
		this.setState({ currentPanel: 'set-table-for-query' });
	},

	render() {
		switch(this.state.currentPanel) {
			case 'input-database':
				return (<InputDatabasePanel onNext={this.onInputDatabasePanelNext} />);
			case 'set-table-for-query':
				return (<SetTableForQuery />); //TODO IMME
			default: 
				bootbox.alert('invalid panel name: ' + this.state.currentPanel);
				return;
		} //switch
	}
});

var InputDatabasePanel = React.createClass({
	getDefaultProps() {
		return {
			onNext: null
		};
	},

	encrypt(text) {
		return new Promise(function(resolve, reject) {
			$.getJSON('/REST/Meta/Encrypt/', { value: text })
			.fail(function(err) {
				reject(err);
			}).done(function(resp) {
				if(resp.success !== 1) {
					resolve(resp);
					return;
				} //if
				resolve(resp.value);
			});
		});
	},

	next(evt) {
		var params = {
			jdbcDriver: this.refs.body.state.jdbcDriver,
			jdbcConnUrl: this.refs.body.state.jdbcConnUrl,
			jdbcUsername: this.refs.body.state.jdbcUsername,
			jdbcPassword: this.refs.body.state.jdbcPassword
		};

		try {
			precond.checkArgument(
				params.jdbcDriver != null && 
				params.jdbcDriver.trim().length > 0,
				'invalid jdbc driver');
			precond.checkArgument(
				params.jdbcConnUrl != null && 
				params.jdbcConnUrl.trim().length > 0,
				'invalid jdbc connection url');
			precond.checkArgument(
				params.jdbcUsername != null && 
				params.jdbcUsername.trim().length > 0,
				'invalid jdbc username');
			precond.checkArgument(
				params.jdbcPassword != null && 
				params.jdbcPassword.trim().length > 0,
				'invalid jdbc password');
		} catch(err) {
			bootbox.alert(err.message);
			return;
		}

		db2FileModel.setDatabase({
			driver: params.jdbcDriver,
			connUrl: params.jdbcConnUrl,
			username: null, password: null
		});

		showLoading();
		this.encrypt(params.jdbcUsername).then(function(encryptedUsername) {
			db2FileModel.setDatabase({ username: encryptedUsername });
			return this.encrypt(params.jdbcPassword);
		}).then(function(encryptedPassword) {
			db2FileModel.setDatabase({ password: encryptedPassword });
			closeLoading();

			this.props.onNext();
		}).catch(function(err) {
			closeLoading();
			if(typeof err === 'object') err = JSON.stringify(err);
			bootbox.alert(err);
		});
	},

	render() {
		return (
			<div className="panel panel-default center-xy" id="panel-input-database">
				<div className="panel-heading">
					<span className="glyphicon glyphicon-console" />
					<span>input database</span>
					<StageDots total={6} current={1} />
				</div>
				<div className="panel-body">
					<InputDatabasePanel.Body ref="body" />
				</div>
				<div className="panel-footer">
					<button type="button" className="btn btn-primary btn-sm pull-right"
						onClick={this.next}>next</button>
					<div className="clearfix" />
				</div>
			</div>
		);
	}
});

InputDatabasePanel.Body = React.createClass({
	getInitialState() {
		return {
			dbVendor: 'oracle',
			dbIp: '',
			dbPort: '',
			dbSid: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: ''
		}
	},

	onDbVendorChange(evt) {
		var dbVendor = evt.target.value;
		var newState = { dbVendor: dbVendor };

		if(dbVendor !== 'etc') {
			newState.jdbcDriver = jdbcTmpl[dbVendor].driver;
			newState.dbPort = jdbcTmpl[dbVendor].port;
			newState.jdbcConnUrl = jdbcTmpl[dbVendor].connUrl
				.replace('{ip}', this.state.dbIp)
				.replace('{port}', newState.dbPort)
				.replace('{database}', this.state.dbSid);
		} //if

		this.setState(newState);
	},

	onDbIpChange(evt) {
		var dbIp = evt.target.value;
		var newState = { dbIp: dbIp };

		if(this.state.dbVendor !== 'etc') {
			newState.jdbcConnUrl = jdbcTmpl[dbVendor].connUrl
				.replace('{ip}', dbIp)
				.replace('{port}', this.state.dbPort)
				.replace('{database}', this.state.dbSid);

		} //if

		this.setState(newState);
	},

	onDbPortChange(evt) {
		var dbPort = evt.target.value;
		var newState = { dbPort: dbPort };

		if(this.state.dbVendor !== 'etc') {
			newState.jdbcConnUrl = jdbcTmpl[dbVendor].connUrl
				.replace('{ip}', this.state.dbIp)
				.replace('{port}', dbPort)
				.replace('{database}', this.state.dbSid);

		} //if

		this.setState(newState);
	},

	onDbSidChange(evt) {
		var dbSid= evt.target.value;
		var newState = { dbSid: dbSid };

		if(this.state.dbVendor !== 'etc') {
			newState.jdbcConnUrl = jdbcTmpl[dbVendor].connUrl
				.replace('{ip}', this.state.dbIp)
				.replace('{port}', this.state.dbPort)
				.replace('{database}', dbSid);

		} //if

		this.setState(newState);
	},

	onJdbcDriverChange(evt) {
		this.setState({ jdbcDriver: evt.target.value });
	},

	onJdbcConnUrlChange(evt) {
		this.setState({ jdbcConnUrl: evt.target.value });
	},

	onJdbcUsernameChange(evt) {
		this.setState({ jdbcUsername: evt.target.value });
	},

	onJdbcPasswordChange(evt) {
		this.setState({ jdbcPassword: evt.target.value });
	},

	connectTest() {
		//TODO IMME
	},

	render() {
		return (
			<div>
				<div>
					<label className="key-label">database vendor</label>
					<span className="value-area">
						<label>
							<input type="radio" name="dbVendor" value="oracle" onChange={this.onDbVendorChange} checked={this.state.dbVendor === 'oracle'} />
							<span>oracle</span>
						</label>
						<label>
							<input type="radio" name="dbVendor" value="mysql" onChange={this.onDbVendorChange} checked={this.state.dbVendor === 'mysql'} />
							<span>mysql</span>
						</label>
						<label>
							<input type="radio" name="dbVendor" value="mssql" onChange={this.onDbVendorChange} checked={this.state.dbVendor === 'mssql'} />
							<span>mssql</span>
						</label>
						<label>
							<input type="radio" name="dbVendor" value="db2" onChange={this.onDbVendorChange} checked={this.state.dbVendor === 'db2'} />
							<span>db2</span>
						</label>
						<label>
							<input type="radio" name="dbVendor" value="tibero" onChange={this.onDbVendorChange} checked={this.state.dbVendor === 'tibero'} />
							<span>tibero</span>
						</label>
						<label>
							<input type="radio" name="dbVendor" value="etc" onChange={this.onDbVendorChange} checked={this.state.dbVendor === 'etc'} />
							<span>etc</span>
						</label>
					</span>
				</div>
				<div>
					<label className="key-label">database address</label>
					<span className="value-area">
						<input id="text-database-ip" type="text" placeholder="ip" className="input-text" onChange={this.onDbIpChange} />
						<input id="text-database-port" type="text" placeholder="port" className="input-text" onChange={this.onDbPortChange} />
						<button type="button" id="connect-test-btn" className="btn btn-default btn-sm" onClick={this.connectTest}>connect test</button>
					</span>
				</div>
				<div>
					<label className="key-label">database(sid)</label>
					<span className="value-area">
						<input id="text-database-sid" type="text" className="input-text" onChange={this.onDbSidChange} />
					</span>
				</div>
				<div>
					<label className="key-label">jdbc driver</label>
					<span className="value-area">
						<input id="text-jdbc-driver" type="text" className="input-text" onChange={this.onJdbcDriverChange} />
					</span>
				</div>
				<div>
					<label className="key-label">jdbc connection url</label>
					<span className="value-area">
						<input id="text-jdbc-conn-url" type="text" className="input-text" onChange={this.onJdbcConnUrlChange} />
					</span>
				</div>
				<div>
					<label className="key-label">jdbc username</label>
					<span className="value-area">
						<input id="text-jdbc-username" type="text" className="input-text" onChange={this.onJdbcUsernameChange} />
					</span>
				</div>
				<div>
					<label className="key-label">jdbc-password</label>
					<span className="value-area">
						<input id="text-jdbc-password" type="password" className="input-text" onChange={this.onJdbcPasswordChange} />
					</span>
				</div>
			</div>
		);
	}
});

var SetTableForQuery = React.createClass({
	render() {
		return (
			<div className="panel panel-default center-xy" id="panel-set-table-for-query">
				<div className="panel-heading">
					<span className="glyphicon glyphicon-console" />
					<span>select table</span>
				</div>
			</div>
		);
	}
});

//TODO IMME

var StageDots = React.createClass({
	getDefaultProps() {
		return {
			total: 0,
			current: 0
		};
	},

	render() {
		var dotsDOM = [];
		for(var i=1; i<=this.props.total; i++) {
			if(i === this.props.current) {
				dotsDOM.push(<span className="black-sm-ball" />);
			} else {
				dotsDOM.push(<span className="gray-sm-ball" />);
			}
		}

		return (
			<div className="pull-right">
				{dotsDOM}
			</div>
		);
	}
});







