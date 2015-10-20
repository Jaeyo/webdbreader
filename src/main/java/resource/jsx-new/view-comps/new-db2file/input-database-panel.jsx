var React = require('react'),
	_ = require('underscore'),
	Layout = require('../../comps/layout.jsx').Layout,
	Panel = require('../../comps/panel.jsx').Panel,
	Btn = require('../../comps/btn.jsx').Btn,
	DarkBlueBtn = require('../../comps/btn.jsx').DarkBlueBtn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	ContentEditable = require('../../comps/content-editable.jsx').ContentEditable,
	DashedTextBox = require('../../comps/textbox.jsx').DashedTextBox,
	DashedSelectBox = require('../../comps/select-box.jsx').DashedSelectBox,
	LoadingView = require('../../comps/modal.jsx').LoadingView,
	StageMap = require('../../comps/stage-map.jsx').StageMap;

var InputDatabasePanel = React.createClass({
	jdbcTmpl: {
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
	},

	getDefaultProps() {
		return { nextCallback: null };
	},

	getInitialState() {
		return {
			dbVendor: 'oracle',
			dbIp: '',
			dbPort: this.jdbcTmpl.oracle.port,
			dbSid: '',
			jdbcDriver: this.jdbcTmpl.oracle.driver,
			jdbcConnUrl: 
				this.jdbcTmpl.oracle.connUrl
				.replace('{ip}', '')
				.replace('{port}', '')
				.replace('{database}', ''),
			jdbcUsername: '',
			jdbcPassword: ''
		};
	},

	next(evt) {
		window.store.dispatch(window.store.actions.INPUT_DATABASE_INFO, {
			dbVendor: this.state.dbVendor,
			dbIp: this.state.dbIp,
			dbPort: this.state.dbPort,
			dbSid: this.state.dbSid,
			jdbcDriver: this.state.jdbcDriver,
			jdbcConnUrl: this.state.jdbcConnUrl,
			jdbcUsername: this.state.jdbcUsername,
			jdbcPassword: this.state.jdbcPassword
		});

		this.props.nextCallback();
	},

	onChangeDbVendor(evt) {
		var newState = { dbVendor: evt.target.value };
		if(newState.dbVendor !== 'etc') {
			newState.jdbcDriver = this.jdbcTmpl[newState.dbVendor].driver;
			newState.dbPort = this.jdbcTmpl[newState.dbVendor].port;
			newState.jdbcConnUrl = 
				this.jdbcTmpl[newState.dbVendor].connUrl
				.replace('{ip}', this.state.dbIp)
				.replace('{port}', newState.dbPort)
				.replace('{database}', this.state.dbSid);
		}
		this.setState(newState);
	},

	onChangedbIp(evt) {
		var newState = { dbIp: evt.target.value };
		if(this.state.dbVendor !== 'etc') {
			newState.jdbcConnUrl = 
				this.jdbcTmpl[this.state.dbVendor].connUrl
				.replace('{ip}', newState.dbIp)
				.replace('{port}', this.state.dbPort)
				.replace('{database}', this.state.dbSid);
		}
		this.setState(newState);
	},

	onChangedbPort(evt) {
		var newState = { dbPort: evt.target.value };
		if(this.state.dbVendor !== 'etc') {
			newState.jdbcConnUrl = 
				this.jdbcTmpl[this.state.dbVendor].connUrl
				.replace('{ip}', this.state.dbIp)
				.replace('{port}', newState.dbPort)
				.replace('{database}', this.state.dbSid);
		}
		this.setState(newState);
	},

	onChangeDbSid(evt) {
		var newState = { dbSid: evt.target.value };
		if(this.state.dbVendor !== 'etc') {
			newState.jdbcConnUrl = 
				this.jdbcTmpl[this.state.dbVendor].connUrl
				.replace('{ip}', this.state.dbIp)
				.replace('{port}', this.state.dbPort)
				.replace('{database}', newState.dbSid);
		}
		this.setState(newState);
	},

	onChangeJdbcDriver(evt) {
		this.setState({ jdbcDriver: evt.target.value });
	},

	onChangeJdbcConnUrl(evt) {
		this.setState({ jdbcConnUrl: evt.target.value });
	},

	onChangeJdbcUsername(evt) {
		this.setState({ jdbcUsername: evt.target.value });
	},

	onChangeJdbcPassword(evt) {
		this.setState({ jdbcPassword: evt.target.value });
	},

	render() {
		var outerDivStyle = {
			position: 'absolute',
			width: '700px',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)'
		};

		var divLineStyle = { marginBottom: '8px' };

		var labelStyle = {
			width: '160px',
			textAlign: 'right',
			marginRight: '10px'
		};

		return (
			<div style={outerDivStyle}>
				<div style={{ width: '100%', height: '70px' }}>
					<StageMap 
						stages={[
							'데이터베이스 정보 입력',
							'blabla',
							'테스트 페이지'
						]} 
						pos={0} />
				</div>
				<Panel>
					<Panel.HeadingWithIndicators glyphicon="console">input database</Panel.HeadingWithIndicators>
					<Panel.Body>
						<div style={divLineStyle}>
							<label style={labelStyle}>database vendor</label>
							<DashedSelectBox
								style={{ width: '488px' }}
								values={[ 'oracle', 'mysql', 'mssql', 'db2', 'tibero', 'etc' ]}
								value={this.state.dbVendor}
								onChange={this.onChangeDbVendor} />
						</div>
						<div style={divLineStyle}>
							<label style={labelStyle}>database address</label>
							<DashedTextBox 
								placeholder="database ip" 
								value={this.state.dbIp} 
								onChange={this.onChangedbIp} 
								style={{ width: '417px', marginRight: '10px' }} />
							<DashedTextBox 
								placeholder="port" 
								value={this.state.dbPort} 
								onChange={this.onChangedbPort} 
								style={{ width: '60px' }} />
						</div>
						<div style={divLineStyle}>
							<label style={labelStyle}>database(sid)</label>
							<DashedTextBox 
								placeholder="database" 
								value={this.state.sid} 
								onChange={this.onChangeDbSid} 
								style={{ width: '488px' }} />
						</div>
						<div style={divLineStyle}>
							<label style={labelStyle}>jdbc driver</label>
							<DashedTextBox 
								placeholder="jdbc driver" 
								value={this.state.jdbcDriver} 
								onChange={this.onChangeJdbcDriver} 
								style={{ width: '488px' }} />
						</div>
						<div style={divLineStyle}>
							<label style={labelStyle}>jdbc connection url</label>
							<DashedTextBox 
								placeholder="jdbc connection url" 
								value={this.state.jdbcConnUrl} 
								onChange={this.onChangeJdbcConnUrl} 
								style={{ width: '488px' }} />
						</div>
						<div style={divLineStyle}>
							<label style={labelStyle}>jdbc username</label>
							<DashedTextBox 
								placeholder="jdbc username" 
								value={this.state.jdbcUsername} 
								onChange={this.onChangeJdbcUsername} 
								style={{ width: '488px' }} />
						</div>
						<div style={divLineStyle}>
							<label style={labelStyle}>jdbc password</label>
							<DashedTextBox 
								type="password"
								placeholder="jdbc password" 
								value={this.state.jdbcPassword} 
								onChange={this.onChangeJdbcPassword} 
								style={{ width: '488px' }} />
						</div>
					</Panel.Body>
					<Panel.Footer>
						<span style={{ float: 'right' }}>
							<Btn onClick={this.next}>next</Btn>
						</span>
						<Clearfix />
					</Panel.Footer>
				</Panel>
			</div>
		);
	}
});
exports.InputDatabasePanel = InputDatabasePanel;