var React = require('react'),
	_ = require('underscore'),
	precond = require('precond').checkArgument,
	Promise = require('promise'),
	util = require('util'),
	assertNotNullAndEmpty = require('../../utils/util.js').assertNotNullAndEmpty,
	handleError = require('../../utils/util.js').handleError,
	handleResp = require('../../utils/util.js').handleResp,
	Layout = require('../../comps/layout.jsx').Layout,
	Panel = require('../../comps/panel.jsx').Panel,
	Btn = require('../../comps/btn.jsx').Btn,
	DarkBlueBtn = require('../../comps/btn.jsx').DarkBlueBtn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	ContentEditable = require('../../comps/content-editable.jsx').ContentEditable,
	DashedTextBox = require('../../comps/textbox.jsx').DashedTextBox,
	DashedSelectBox = require('../../comps/select-box.jsx').DashedSelectBox,
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
		return { visible: false, onNext: null };
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

	validationCheck() {
		try {
			precond(assertNotNullAndEmpty(this.state.dbVendor), 'invalid database vendor');
			precond(assertNotNullAndEmpty(this.state.dbIp), 'invalid database ip');
			precond(assertNotNullAndEmpty(this.state.dbPort), 'invalid database port');
			precond(assertNotNullAndEmpty(this.state.dbSid), 'invalid database(sid)');
			precond(assertNotNullAndEmpty(this.state.jdbcDriver), 'invalid jdbc driver');
			precond(assertNotNullAndEmpty(this.state.jdbcConnUrl), 'invalid jdbc connection url');
			precond(assertNotNullAndEmpty(this.state.jdbcUsername), 'invalid jdbc username');
			precond(assertNotNullAndEmpty(this.state.jdbcPassword), 'invalid jdbc password');
		} catch(err) {
			var errmsg = err.message;
			window.curtainAlert.show({ msg: errmsg });
			return false;
		}
		return true;
	},

	connectTest() {
		return new Promise(function(resolve, reject) {
			window.curtainLoadingAlert.show({ msg: 'database connect test ...' });
			$.getJSON('/REST/Database/Tables/', {
				driver: this.state.jdbcDriver,
				connUrl: this.state.jdbcConnUrl,
				username: this.state.jdbcUsername,
				password: this.state.jdbcPassword
			}).fail(function(err) {
				window.curtainLoadingAlert.hide();
				reject(err.statusText);
			}).done(function(resp) {
				window.curtainLoadingAlert.hide();
				if(resp.success !== 1) reject(resp.errmsg);
				else resolve(true);
			});
		}.bind(this));
	},

	dispatch() {
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
	},

	beforeNext() {
		return new Promise(function(resolve, reject) {
			if(this.validationCheck() === false) {
				resolve(false);
				return;
			}

			window.curtainYesOrNo.show({
				msg: '데이터베이스 connect test를 진행할까요?',
				onClick: function(result) {
					if(result === true) {
						this.connectTest().then(function(result) {
							window.curtainAlert.show({ 
								msg: '데이터베이스 connect test 성공',
								onClick: function() {
									resolve(true);
									this.dispatch();
								}.bind(this)
							});
						}.bind(this)).catch(function(err) {
							window.curtainAlert.show({ 
								msg: util.format('데이터베이스 connect test 실패 (%s)', err)
							});
							resolve(false);
						}.bind(this));
					} else {
						this.dispatch();
						resolve(true);
					}
				}.bind(this)
			});
		}.bind(this));
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
			display: this.props.visible === true ? 'block' : 'none',
			float: 'left',
			width: 'calc(100% - 150px)'
		};

		var stages = [ 'database 설정', 'table 설정', 'column 설정', 'binding type 설정', '기타 설정', 'script 확인' ];

		var divLineStyle = { marginBottom: '8px' };

		var labelStyle = {
			width: '160px',
			textAlign: 'right',
			marginRight: '10px'
		};

		return (
			<div style={outerDivStyle}>
				<div style={{ width: '100%', height: '70px' }}>
					<StageMap stages={stages} pos={0} />
				</div>
				<Panel>
					<Panel.Heading glyphicon="console">DB정보 입력</Panel.Heading>
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
							<Btn onClick={this.props.onNext}>next</Btn>
						</span>
						<Clearfix />
					</Panel.Footer>
				</Panel>
			</div>
		);
	}
});
exports.InputDatabasePanel = InputDatabasePanel;