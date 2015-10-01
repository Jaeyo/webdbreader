var React = require('react'),
	util  require('util');

var Db2FileView = React.createClass({
	getInitialState() {
		return {
			period: '',
			selectColumn: [], // [ (string) ]
			tableName: '',
			outputPath: '',
			delimiter: ''
			charset: '',
			condition: {
				type: 'no-condition', //('no-condition' | 'date-condition' | 'sequence-condition')
				column: ''
			},
			database: {
				vender: 'oracle', //(lower case only)
				driver: '',
				connUrl: '',
				username: '',
				password: ''
			}
		};
	}, //getInitialState
	valueCallback(args) {
		var updateStateFn = function(state, args) {
			for(var key in args) {
				var value = args[key];
				if(typeof value === 'object') {
					state[key] = updateStateFn(state[key], value);
				} else {
					state[key] = value;
				} //if
			} //for key
			return state;
		}; //updateStateFn

		var state = JSON.parse(JSON.stringify(this.state));
		this.setState(updateStateFn(state, args));
	}, //valueCallback
	render() {
		return (
			<div>
				<PanelInputDatabase 
					show={true}
					valueCllback={this.valueCallback}
					nextCallback={TODO}
					dbVendor={this.state.database.vender} />
			</div>
		);
	} //render
}); //Db2FileView

var PanelInputDatabase = React.createClass({
	getDefaultProps() {
		return {
			show: false,
			valueCallback: null,
			nextCallback: null,
			dbVendor: 'oracle',
			jdbcDriver: '',
			jdbcConnUrl: ''
		};
	}, //getDefaultProps
	getInitialState() {
		return {
			dbIp: '',
			dbPort: '',
			dbSid: ''
		}
	}, //getInitialState
	makeConnUrl() {
 		switch(vendor) {
			case 'oracle': 
				return util.format('jdbc:oracle:thin:@%s:%s:%s', this.state.dbIp, this.state.dbPort, this.state.dbSid);
			case 'mysql': 
				return util.format('jdbc:mysql://%s:%s/%s', this.state.dbIp, this.state.dbPort, this.state.dbSid);
			case 'mssql': 
				return util.format('jdbc:sqlserver://%s:%s;databaseName=%s', this.state.dbIp, this.state.dbPort, this.state.dbSid);
			case 'db2': 
				return util.format('jdbc:db2://%s:%s/%s', this.state.dbIp, this.state.dbPort, this.state.dbSid);
			case 'tibero': 
				return util.format('jdbc:db2://%s:%s/%s', this.state.dbIp, this.state.dbPort, this.state.dbSid);
			default:
				return null;
		} //switch
	}, //makeConnUrl
	makeDriver() {
		switch(vendor) {
			case 'oracle': 
				return 'oracle.jdbc.driver.OracleDriver';
			case 'mysql': 
				return 'com.mysql.jdbc.Driver';
			case 'mssql': 
				return 'com.microsoft.sqlserver.jdbc.SQLServerDriver';
			case 'db2': 
				return 'com.ibm.db2.jcc.DB2Driver';
			case 'tibero': 
				return 'com.ibm.db2.jcc.DB2Driver';
			default:
				return null;
		} //switch
	}, //makeDriver
	onDbVendorChange(evt) {
		var args = {
			database: {
				vendor: evt.target.value
			}
		};

		var connUrl = this.makeConnUrl(),
			driver = this.makeDriver();
		if(connUrl !== null) args.database.connUrl = connUrl;
		if(driver !== null) args.database.driver = driver;

		this.props.valueCallback(args);
	}, //onDbVendorChange
	onDbIpChange(evt) {
		var state = JSON.parse(JSON.stringify(this.state));
		state.dbIp = evt.target.value;
		this.setState(state);

		var connUrl = this.makeConnUrl();
		if(connUrl != null) {
			this.valueCallback({
				database: {
					connUrl: connUrl
				}
			});
		} //if
	}, //onDbIpChange
	onDbPortChange(evt) {
		var state = JSON.parse(JSON.stringify(this.state));
		state.dbPort = evt.target.value;
		this.setState(state);

		var connUrl = this.makeConnUrl();
		if(connUrl != null) {
			this.valueCallback({
				database: {
					connUrl: connUrl
				}
			});
		} //if
	}, //onDbPortChange
	onSidChange(evt) {
		var state = JSON.parse(JSON.stringify(this.state));
		state.dbSid = evt.target.value;
		this.setState(state);

		var connUrl = this.makeConnUrl();
		if(connUrl != null) {
			this.valueCallback({
				database: {
					connUrl: connUrl
				}
			});
		} //if
	}, //onSidChange
	onJdbcDriverChange(evt) {
		this.props.valueCallback({
			database: {
				driver: evt.target.value
			}
		});
	}, //onJdbcDriverChange
	onJdbcConnUrlChange(evt) {
		this.props.valueCallback({
			database: {
				connUrl: evt.target.value
			}
		});
	}, //onJdbcConnUrlChange
	onJdbcUsernameChange(evt) {
		this.props.valueCallback({
			database: {
				username: evt.target.value
			}
		});
	}, //onJdbcUsernameChange
	onJdbcPasswordChange(evt) {
		this.props.valueCallback({
			database: {
				password: evt.target.value
			}
		});
	}, //onJdbcPasswordChange
	render() {
		var panelProps = {
			className: 'panel panel-default center-xy',
			id: 'panel-input-datbase'
		};
		if(this.props.show === false)
			panelProps.style = { display: 'none' };

		return (
			<div {...panelProps}>
				<div className="panel-heading">
					<span className="glyphicon glyphicon-console" />
					<span>input database</span>
					<StateDots total={6} current={1} />
				</div>
				<div className="panel-body">
					<PanelInputDatabase.DbVendorBox 
						vendor={this.props.dbVendor}
						onDbVendorChange={this.props.onDbVendorChange} />
					<PanelInputDatabase.DbAddressBox 
						port={this.state.dbPort}
						onDbIpChange={this.onDbIpChange}
						onDbPortChange={this.onDbPortChange} />
					<PanelInputDatabase.DbSidBox 
						onSidChange={this.onSidChange} />
					<PanelInputDatabase.JdbcDriverBox 
						jdbcDriver={this.props.jdbcDriver}
						onJdbcDriverChange={this.onJdbcDriverChange} />
					<PanelInputDatabase.JdbcConnUrlBox 
						connUrl={this.props.connUrl}
						onJdbcConnUrlChange={this.onJdbcConnUrlChange} />
					<PanelInputDatabase.JdbcUsernameBox
						onJdbcUsernameChange={this.onJdbcUsernameChange} />
					<PanelInputDatabase.JdbcPasswordBox 
						onJdbcPasswordChange={this.onJdbcPasswordChange} />
				</div>
				<div className="panel-footer">
					<button 
						type="button" 
						className="btn btn-primary btn-sm pull-right" 
						onClick={this.props.nextCallback}>next</button>
					<div className="clearfix" />
				</div>
			</div>
		);
	} //render
}); //PanelInputDatabase

PanelInputDatabase.DbVendorBox = React.createClass({
	getDefaultProps() {
		return {
			vendor: 'oracle',
			onDbVendorChange: null
		};
	}, //getDefaultProps
	render() {
		return (
			<div>
				<label className="key-label">database vendor</label>
				<span className="value-area">
					<label>
						<input 
							type="radio" 
							name="dbVendor" 
							value="oracle" 
							onChange={this.onDbVendorChange} 
							checked={this.props.dbVendor === 'oracle'}>
							<span>oracle</span>
						</input>
					</label>
					<label>
						<input 
							type="radio" 
							name="dbVendor" 
							value="mysql" 
							onChange={this.onDbVendorChange} 
							checked={this.props.dbVendor === 'mysql'}>
							<span>mysql</span>
						</input>
					</label>
					<label>
						<input 
							type="radio" 
							name="dbVendor" 
							value="mssql" 
							onChange={this.onDbVendorChange} 
							checked={this.props.dbVendor === 'mssql'}>
							<span>mssql</span>
						</input>
					</label>
					<label>
						<input 
							type="radio" 
							name="dbVendor" 
							value="db2" 
							onChange={this.onDbVendorChange} 
							checked={this.props.dbVendor === 'db2'}>
							<span>db2</span>
						</input>
					</label>
					<label>
						<input 
							type="radio" 
							name="dbVendor" 
							value="tibero" 
							onChange={this.onDbVendorChange} 
							checked={this.props.dbVendor === 'tibero'}>
							<span>tibero</span>
						</input>
					</label>
					<label>
						<input 
							type="radio" 
							name="dbVendor"
							value="etc" 
							onChange={this.onDbVendorChange} 
							checked={this.props.dbVendor === 'etc'}>
							<span>etc</span>
						</input>
					</label>
				</span>
			</div>
		);
	} //render
}); //DbVendorBox

PanelInputDatabase.DbAddressBox = React.createClass({
	getDefaultProps() {
		return {
			port: '',
			onDbIpChange: null,
			onDbPortChange: null
		};
	}, //getDefaultProps
	connectTest() {
		//TODO IMME
	}, //connectTest
	render() {
		return (
			<div>
				<label className="key-label">database address</label>
				<span className="value-area">
					<input 
						className="input-text" 
						id="text-database-ip" 
						type="text" 
						placeholder="ip" 
						onChange={this.props.onDbIpChange} />
					<input 
						className="input-text" 
						id="text-database-port" 
						type="text" 
						placeholder="port" 
						value={this.props.port} 
						onChange={this.props.onDbPortChange} />
					<button 
						type="button" 
						className="btn btn-default btn-sm" 
						id="connect-test-btn"
						onClick={this.connectTest}>connect test</button>
				</span>
			</div>
		);
	} //render
}); //DbAddressBox

PanelInputDatabase.DbSidBox = React.createClass({
	getDefaultProps() {
		return {
			onSidChange: null
		};
	}, //getDefaultProps
	render() {
		return (
			<div>
				<label className="key-label">database(sid)</label>
				<span className="value-area">
					<input 
						className="input-text" 
						id="text-database-sid" 
						type="text" 
						onChange={this.props.onSidChange} />
				</span>
			</div>
		);
	} //render
}); //DbSidBox

PanelInputDatabase.JdbcDriverBox = React.createClass({
	getDefaultProps() {
		return {
			jdbcDriver: '',
			onJdbcDriverChange: null
		};
	}, //getDefaultProps
	render() {
		return (
			<div>
				<label className="key-label">jdbc driver</label>
				<span className="value-area">
					<input 
						className="input-text" 
						id="text-jdbc-driver" 
						type="text" 
						value={this.props.jdbcDriver}
						onChange={this.props.onJdbcDriverChange} />
				</span>
			</div>	
		);
	} //render
}); //JdbcDriverBox

PanelInputDatabase.JdbcConnUrlBox = React.createClass({
	getDefaultProps() {
		return {
			connUrl: '',
			onJdbcConnUrlChange: null
		};
	}, //getDefaultProps
	render() {
		return (
			<div>
				<label className="key-label">jdbc connection url</label>
				<span className="value-area">
					<input 
						className="input-text" 
						id="text-jdbc-conn-url" 
						type="text" 
						value={this.props.connUrl}
						onChange={this.props.onJdbcConnUrlChange} />
				</span>
			</div>		
		);
	} //render
});

PanelInputDatabase.JdbcUsernameBox = React.createClass({
	getDefaultProps() {
		return {
			onJdbcUsernameChange: null
		};
	}, //getDefaultProps
	render() {
		return (
			<div>
				<label className="key-label">jdbc username</label>
				<span className="value-area">
					<input 
						className="input-text" 
						id="text-jdbc-username" 
						type="text" 
						onChange={this.onJdbcUsernameChange} />
				</span>
			</div>
		);
	} //render
});

PanelInputDatabase.JdbcPasswordBox = React.createClass({
	getDefaultProps() {
		return {
			onJdbcPasswordChange: null
		};
	}, //getDefaultProps
	render() {
		return (
			<div>
				<label className="key-label">jdbc password</label>
				<span className="value-area">
					<input 
						className="input-text" 
						id="text-jdbc-password" 
						type="password" 
						onChange={this.onJdbcPasswordChange} />
				</span>
			</div>
		);
	} //render
});


var StageDots = React.createClass({
	getDefaultProps() {
		return {
			total: 0,
			current: 0
		};
	}, //getDefaultProps
	render() {
		var dotsDOM = [];
		for(var i=0; i<this.props.total; i++) {
			if(i === this.props.current) {
				dotsDOM.push(<span className="black-sm-ball" />);
			} else {
				dotsDOM.push(<span className="gray-sm-ball" />);
			} //if
		} //for i

		return (
			<div className="pull-right">
				{dotsDOM}
			</div>
		);
	} //render
}); //StateDots