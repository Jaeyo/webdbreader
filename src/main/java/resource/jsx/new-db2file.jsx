var React = require('react'),
	Panel = require('./components/panel.jsx').Panel;

var NewDb2FileView = React.createClass({
	render() {
		//TODO IMME
	}
});


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
}; //jdbcTmpl


var InputDatabasePanel = React.createClass({
	getInitialState() {
		return {
			dbVendor: 'oracle',
			dbIp: 'localhost',
			dbPort: '',
			dbSid: '',
			driver: '',
			connUrl: '',
			jdbcUsername: '',
			jdbcPassword: ''
		};
	},

	onClickDbVendor(evt) {
		var dbVendor = evt.target.value;
		var driver = jdbcTmpl[dbVendor].driver;
		var port = jdbcTmpl[dbVendor].port;
		var connUrl = jdbcTmpl[dbVendor].connUrl
			.replace('{ip}', this.state.dbIp)
			.replace('{port}', port)
			.replace('{database}', this.state.dbSid);

		this.setState({
			dbVendor: dbVendor,
			driver: driver,
			connUrl: connUrl
		});
	},

	onChangeIp(evt) {
		var dbIp = evt.target.value;
		var connUrl = jdbcTmpl[dbVendor].connUrl
			.replace('{ip}', dbIp)
			.replace('{port}', this.state.dbPort)
			.replace('{database}', this.state.dbSid);

		this.setState({
			dbIp: dbIp,
			connUrl: connUrl
		});
	},

	onChangePort(evt) {
		var dbPort = evt.target.value;
		var connUrl = jdbcTmpl[dbVendor].connUrl
			.replace('{ip}', this.state.dbIp)
			.replace('{port}', dbPort)
			.replace('{database}', this.state.dbSid);

		this.setState({
			dbPort: dbPort,
			connUrl: connUrl
		});
	},

	connectTest(evt) {
		//TODO
	},

	onChangeSid(evt) {
		//TODO IMME
	},

	onChangeDriver(evt) {
		//TODO IMME
	},

	onChangeUsername(evt) {
		//TODO IMME
	},

	onChangePassword(evt) {
		//TODO IMME
	},

	onNext(evt) {
		//TODO
	},

	render() {
		return (
			<Panel>
				<Panel.HeadingWithIndicators 
					glyphicon="console" indicatorTotal={6} indicatorCurrent={1}>
					input database
				</Panel.HeadingWithIndicators>
				<Panel.Body>
					<div>
						<InputDatabasePanel.KeyLabel>database vendor</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<InputDatabasePanel.DbVendorRadioBtns
								value={[ 'oracle', 'mysql', 'mssql', 'db2', 'tibero', 'etc' ]}
								checked={this.state.dbVendor}
								onClickCallback={this.onClickDbVendor} />
						</inputdatabasepanel.ValueLabel>
					</div>
					<div>
						<InputDatabasePanel.KeyLabel>database address</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<input 
								type="text" placeholder="ip" onChange={this.onChangeIp}
								value={this.state.dbIp} style={{ 
									width: '170px', marginRight: '5px' 
								}} />
							<input 
								type="text" placeholder="port" onChange={this.onChangePort}
								value={this.state.dbPort} style={{ 
									width: '50px', marginRight: '5px' 
								}} />
							<button 
								type="button" className="btn btn-default btn-sm" 
								style={{ width: '126px' }} onClick={this.connectTest}>
								connect test</button>
						</InputDatabasePanel.ValueLabel>
					</div>
					<div>
						<InputDatabasePanel.KeyLabel>database(sid)</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<input 
								type="text" style={{ width: '356px' }} 
								onChange={this.onChangeSid} value={this.state.dbSid} />
						</InputDatabasePanel.ValueLabel>
					</div>
					<div>
						<InputDatabasePanel.KeyLabel>connection url</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<input 
								type="text" style={{ width: '356px' }} 
								onChange={this.onChangeConnUrl} value={this.state.connUrl} />
						</InputDatabasePanel.ValueLabel>
					</div>
					<div>
						<InputDatabasePanel.KeyLabel>jdbc driver</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<input 
								type="text" style={{ width: '356px' }} 
								onChange={this.onChangeDriver} value={this.state.driver} />
						</InputDatabasePanel.ValueLabel>
					</div>
					<div>
						<InputDatabasePanel.KeyLabel>jdbc username</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<input 
								type="text" style={{ width: '356px' }} 
								onChange={this.onChangeUsername} 
								value={this.state.jdbcUsername} />
						</InputDatabasePanel.ValueLabel>
					</div>
					<div>
						<InputDatabasePanel.KeyLabel>jdbc password</InputDatabasePanel.KeyLabel>
						<InputDatabasePanel.ValueLabel>
							<input 
								type="password" style={{ width: '356px' }} 
								onChange={this.onChangePassword} 
								value={this.state.jdbcPassword} />
						</InputDatabasePanel.ValueLabel>
					</div>
				</Panel.Body>
				<Panel.Footer>
					<div style={{ float: right }}>
						<button 
							type="button" className="btn btn-primary btn-sm" 
							onClick={this.onNext} />
					</div>
				</Panel.Footer>
			</Panel>
		);
	}
});

InputDatabasePanel.KeyLabel = React.createClass({
	render() {
		return (
			<label style={{
				width: '150px',
				marginRight: '10px' }}>
				{this.props.children}
			</label>
		);
	}
});
InputDatabasePanel.ValueLabel = React.createClass({
	render() {
		return (
			<span style={{
				marginBottom: '5px' }}>
				{this.props.children}
			</span>
		);
	}
});

InputDatabasePanel.DbVendorRadioBtns = React.createClass({
	getDefaultProps() {
		return {
			values: [],
			onClickCallback: null,
			checked: ''
		}
	},
	render() {
		var btns = [];

		this.props.values.forEach(function(value) {
			btns.push(
				<label style={{ marginRight: '5px', fontWeight: 'normal' }}>
					<input 
						type="readio" name="dbVendor" value={value} 
						onClick={this.props.onClickCallback} 
						checked={value === this.props.checked} />
					<span>{value}</span>
				</label>
			);
		});
		return (<div>{btns}</div>);
	}
});


