var React = require('react');
var jdbcTmpl = require('./utils/util.js').jdbcTmpl;
var newDataAdapter = require('./utils/data-adapter.js').newDataAdapter;
var DatabaseConfigCard = require('./new-db2file/database-config-card.jsx');
var TableColumnsMappingCard = require('./new-db2db/table-columns-mapping-card.jsx');
var BindingTypePanel = require('./new-db2file/binding-type-panel.jsx');

var NewDb2DbView = React.createClass({
	dataAdapter: null,
	srcDbDataAdapter: null,
	destDbDataAdapter: null,

	getInitialState() {
		return {
			srcDbVendor: 'oracle',
			srcDbIp: '192.168.10.101',
			srcDbPort: '1521',
			srcDbSid: 'spiderx',
			srcJdbcDriver: 'oracle.jdbc.driver.OracleDriver',
			srcJdbcConnUrl: 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx',
			srcJdbcUsername: 'admin_test',
			srcJdbcPassword: 'admin_test',
			srcTable: '',
			srcColumns: '',
			destDbVendor: 'oracle',
			destDbIp: '192.168.10.101',
			destDbPort: '1521',
			destDbSid: 'spiderx',
			destJdbcDriver: 'oracle.jdbc.driver.OracleDriver',
			destJdbcConnUrl: 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx',
			destJdbcUsername: 'admin_test',
			destJdbcPassword: 'admin_test',
			destTable: '',
			destColumns: '',
			bindingType: 'simple',
			srcBindingColumn: '',
			period: '6 * 1000'
		};
	},

	componentWillMount() {
		if(this.dataAdapter == null) {
			this.dataAdapter = newDataAdapter();
			this.dataAdapter.on('stateChange', function(state) {
				this.setState(state);
			}.bind(this));

			this.dataAdapter.onData(function(key) {
				return this.state[key];
			}.bind(this));
		}
		if(this.srcDbDataAdapter == null) {
			this.srcDbDataAdapter = newDataAdapter();
			this.srcDbDataAdapter.on('stateChange', function(state) {
				if(state.dbVendor) {
					Object.renameProperty(state, 'dbVendor', 'srcDbVendor');
					if(state.srcDbVendor != 'etc') {
						state.srcJdbcDriver = jdbcTmpl[state.srcDbVendor].driver;
						state.srcDbPort = jdbcTmpl[state.srcDbVendor].port;
						state.srcJdbcConnUrl = jdbcTmpl[state.srcDbVendor].connUrl
													.replace('{ip}', this.state.srcDbIp)
													.replace('{port}', state.srcDbPort)
													.replace('{database}', this.state.srcDbSid);
					}
				}
				if(state.dbIp) {
					Object.renameProperty(state, 'dbIp', 'srcDbIp');
					if(this.state.srcDbVendor != 'etc') {
						state.srcJdbcConnUrl = jdbcTmpl[this.state.srcDbVendor].connUrl
													.replace('{ip}', state.srcDbIp)
													.replace('{port}', this.state.srcDbPort)
													.replace('{database}', this.state.srcDbSid);
					}
				}
				if(state.dbPort) {
					Object.renameProperty(state, 'dbPort', 'srcDbPort');
					if(this.state.srcDbVendor != 'etc') {
						state.srcJdbcConnUrl = jdbcTmpl[this.state.srcDbVendor].connUrl
													.replace('{ip}', this.state.srcDbIp)
													.replace('{port}', state.srcDbPort)
													.replace('{database}', this.state.srcDbSid);
					}
				}
				if(state.dbSid) {
					Object.renameProperty(state, 'dbSid', 'srcDbSid');
					if(this.state.srcDbVendor != 'etc') {
						state.srcJdbcConnUrl = jdbcTmpl[this.state.srcDbVendor].connUrl
													.replace('{ip}', this.state.srcDbIp)
													.replace('{port}', this.state.srcDbPort)
													.replace('{database}', state.srcDbSid);
					}
				}
				if(state.jdbcDriver) Object.renameProperty(state, 'jdbcDriver', 'srcJdbcDriver');
				if(state.jdbcConnUrl) Object.renameProperty(state, 'jdbcConnUrl', 'srcJdbcConnUrl');
				if(state.jdbcUsername) Object.renameProperty(state, 'jdbcUsername', 'srcJdbcUsername');
				if(state.jdbcPassword) Object.renameProperty(state, 'jdbcPassword', 'srcJdbcPassword');
				this.setState(state);
			}.bind(this));

			this.srcDbDataAdapter.onData(function(key) {
				if(key === 'dbVendor') return this.state.srcDbVendor;
				else if(key === 'dbIp') return this.state.srcDbIp;
				else if(key === 'dbPort') return this.state.srcDbPort;
				else if(key === 'dbSid') return this.state.srcDbSid;
				else if(key === 'jdbcDriver') return this.state.srcJdbcDriver;
				else if(key === 'jdbcConnUrl') return this.state.srcJdbcConnUrl;
				else if(key === 'jdbcUsername') return this.state.srcJdbcUsername;
				else if(key === 'jdbcPassword') return this.state.srcJdbcPassword;
				return this.state[key];
			}.bind(this));
		}
		if(this.destDbDataAdapter == null) {
			this.destDbDataAdapter = newDataAdapter();
			this.destDbDataAdapter.on('stateChange', function(state) {
				if(state.dbVendor) {
					Object.renameProperty(state, 'dbVendor', 'destDbVendor');
					if(state.destDbVendor != 'etc') {
						state.destJdbcDriver = jdbcTmpl[state.destDbVendor].driver;
						state.destDbPort = jdbcTmpl[state.destDbVendor].port;
						state.destJdbcConnUrl = jdbcTmpl[state.destDbVendor].connUrl
													.replace('{ip}', this.state.destDbIp)
													.replace('{port}', state.destDbPort)
													.replace('{database}', this.state.destDbSid);
					}
				}
				if(state.dbIp) {
					Object.renameProperty(state, 'dbIp', 'destDbIp');
					if(this.state.destDbVendor != 'etc') {
						state.destJdbcConnUrl = jdbcTmpl[this.state.destDbVendor].connUrl
													.replace('{ip}', state.destDbIp)
													.replace('{port}', this.state.destDbPort)
													.replace('{database}', this.state.destDbSid);
					}
				}
				if(state.dbPort) {
					Object.renameProperty(state, 'dbPort', 'destDbPort');
					if(this.state.destDbVendor != 'etc') {
						state.destJdbcConnUrl = jdbcTmpl[this.state.destDbVendor].connUrl
													.replace('{ip}', this.state.destDbIp)
													.replace('{port}', state.destDbPort)
													.replace('{database}', this.state.destDbSid);
					}
				}
				if(state.dbSid) {
					Object.renameProperty(state, 'dbSid', 'destDbSid');
					if(this.state.destDbVendor != 'etc') {
						state.destJdbcConnUrl = jdbcTmpl[this.state.destDbVendor].connUrl
													.replace('{ip}', this.state.destDbIp)
													.replace('{port}', this.state.destDbPort)
													.replace('{database}', state.destDbSid);
					}
				}
				if(state.jdbcDriver) Object.renameProperty(state, 'jdbcDriver', 'destJdbcDriver');
				if(state.jdbcConnUrl) Object.renameProperty(state, 'jdbcConnUrl', 'destJdbcConnUrl');
				if(state.jdbcUsername) Object.renameProperty(state, 'jdbcUsername', 'destJdbcUsername');
				if(state.jdbcPassword) Object.renameProperty(state, 'jdbcPassword', 'destJdbcPassword');
				this.setState(state);
			}.bind(this));

			this.destDbDataAdapter.onData(function(key) {
				if(key === 'dbVendor') return this.state.destDbVendor;
				else if(key === 'dbIp') return this.state.destDbIp;
				else if(key === 'dbPort') return this.state.destDbPort;
				else if(key === 'dbSid') return this.state.destDbSid;
				else if(key === 'jdbcDriver') return this.state.destJdbcDriver;
				else if(key === 'jdbcConnUrl') return this.state.destJdbcConnUrl;
				else if(key === 'jdbcUsername') return this.state.destJdbcUsername;
				else if(key === 'jdbcPassword') return this.state.destJdbcPassword;
				return this.state[key];
			}.bind(this));
		}
	},

	render() {
		return (
			<div>
				<DatabaseConfigCard
					title="source database 설정"
					subtitle="source database의 연결정보를 설정합니다."
					dataAdapter={this.srcDbDataAdapter} />
				<DatabaseConfigCard
					title="destination database 설정"
					subtitle="destination database의 연결정보를 설정합니다."
					dataAdapter={this.destDbDataAdapter} />
				<TableColumnsMappingCard dataAdapter={this.dataAdapter} />
			</div>
		);
	}
});
module.exports = NewDb2DbView;