var React = require('react');
var _ = require('underscore');
var jdbcTmpl = require('./utils/util.js').jdbcTmpl;
var DatabaseConfigCard = require('./new-db2file/database-config-card.jsx');
var BindingTypeCard = require('./new-db2file/binding-type-card.jsx');

var NewDb2DbView = React.createClass({
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

	handleStateChange(state) {
		this.setState(state);
	},

	handleSrcDbStateChange(state) {
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

		this.setState(state);
	},

	handleDestDbStateChange(state) {
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

		this.setState(state);
	},

	render() {
		try {
			var { state } = this;

			var srcJdbc = {
				jdbcDriver: state.srcJdbcDriver,
				jdbcConnUrl: state.srcJdbcConnUrl,
				jdbcUsername: state.srcJdbcUsername,
				jdbcPassword: state.srcJdbcPassword
			};

			var destJdbc = {
				jdbcDriver: state.destJdbcDriver,
				jdbcConnUrl: state.destJdbcConnUrl,
				jdbcUsername: state.destJdbcUsername,
				jdbcPassword: state.destJdbcPassword
			};

			var srcDbInfo = {
				dbVendor: state.srcDbVendor,
				dbIp: state.dbIp,
				dbPort: state.dbPort,
				dbSid: state.dbSid
			};

			var destDbInfo = {
				dbVendor: state.destDbVendor,
				dbIp: state.destDbIp,
				dbPort: state.destDbPort,
				dbSid: state.destDbSid
			};

			var srcDatabaseConfigCardData = _.extend({}, srcJdbc, srcDbInfo, {
				title: "source database 설정",
				subtitle: "source database의 연결정보를 설정합니다.",
				handleStateChange: this.handleSrcDbStateChange
			});

			var destDatabaseConfigCardData = _.extend({}, destJdbc, destDbInfo, {
				title: "destination database 설정",
				subtitle: "destination database의 연결정보를 설정합니다.",
				handleStateChange: this.handleDestDbStateChange
			});

			var tableColumnsMappingCardData = _.extend({}, srcJdbc, destJdbc, {
				srcTable: state.srcTable,
				destTable: state.destTable,
				srcColumns: state.srcColumns,
				destColumns: state.destColumns,
				handleStateChange: this.handleStateChange			
			});

			return (
				<div>
					<DatabaseConfigCard {...srcDatabaseConfigCardData} />
					<DatabaseConfigCard {...destDatabaseConfigCardData} />
					<TableColumnsMappingCard {...tableColumnsMappingCardData} />
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = NewDb2DbView;