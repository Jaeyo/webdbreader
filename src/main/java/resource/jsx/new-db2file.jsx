var React = require('react');
var _ = require('underscore');
var jdbcTmpl = require('./utils/util.js').jdbcTmpl;
var server = require('./utils/server.js');
var precondition = require('./utils/precondition.js');
var AlertDialog = require('./comps/dialog/alert-dialog.jsx');
var DatabaseConfigCard = require('./new-db2file/database-config-card.jsx');
var TableColumnConfigCard = require('./new-db2file/table-column-config-card.jsx');
var BindingTypeCard = require('./new-db2file/binding-type-card.jsx');
var EtcConfigCard = require('./new-db2file/etc-config-card.jsx');
var ScriptDialog = require('./comps/dialog/script-dialog.jsx');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var scriptMaker = require('./new-db2file/db2file-script-maker.js');

var NewDb2FileView = React.createClass({
	getInitialState() {
		return {
			dbVendor: 'oracle',
			dbIp: '192.168.10.101',
			dbPort: '1521',
			dbSid: 'spiderx',
			jdbcDriver: 'oracle.jdbc.driver.OracleDriver',
			jdbcConnUrl: 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx',
			jdbcUsername: 'admin_test',
			jdbcPassword: 'admin_test',
			table: '',
			columns: '',
			bindingType: 'simple',
			bindingColumn: '',
			period: '60 * 1000',
			charset: 'utf8',
			delimiter: '|',
			outputPath: ''
		};
	},

	handleStateChange(state) {
		if(state.columns) state.columns = state.columns.toLowerCase();

		if(state.dbVendor) {
			if(state.dbVendor != 'etc') {
				state.jdbcDriver = jdbcTmpl[state.dbVendor].driver;
				state.dbPort = jdbcTmpl[state.dbVendor].port;
				state.jdbcConnUrl = jdbcTmpl[state.dbVendor].connUrl
											.replace('{ip}', this.state.dbIp)
											.replace('{port}', state.dbPort)
											.replace('{database}', this.state.dbSid);
			}
		} else if(state.dbIp) {
			if(this.state.dbVendor != 'etc') {
				state.jdbcConnUrl = jdbcTmpl[this.state.dbVendor].connUrl
											.replace('{ip}', state.dbIp)
											.replace('{port}', this.state.dbPort)
											.replace('{database}', this.state.dbSid);
			}
		} else if(state.dbPort) {
			if(this.state.srcDbVendor != 'etc') {
				state.jdbcConnUrl = jdbcTmpl[this.state.dbVendor].connUrl
											.replace('{ip}', this.state.dbIp)
											.replace('{port}', state.dbPort)
											.replace('{database}', this.state.dbSid);
			}
		} else if(state.dbSid) {
			if(this.state.dbVendor != 'etc') {
				state.jdbcConnUrl = jdbcTmpl[this.state.dbVendor].connUrl
											.replace('{ip}', this.state.dbIp)
											.replace('{port}', this.state.dbPort)
											.replace('{database}', state.dbSid);
			}
		}
		
		this.setState(state);
	},

	showScriptDialog() {
		try {
			precondition
				.instance(this.state)
				.stringNotByEmpty([ 'jdbcDriver', 'jdbcConnUrl', 'jdbcUsername', 'jdbcPassword' ], 'jdbc 연결 정보 미입력')
				.stringNotByEmpty('table', 'table 정보 미입력')
				.stringNotByEmpty('columns', 'columns정보 미입력')
				.stringNotByEmpty('bindingType', 'bindingType 정보 미입력')
				.check(function(data) {
					if(data.bindingType !== 'simple')
						return ( data.bindingColumn != null && data.bindingColumn.trim().length !== 0 );
					return true;
				})
				.stringNotByEmpty('period', 'period 정보 미입력')
				.stringNotByEmpty('charset', 'charset 정보 미입력')
				.stringNotByEmpty('delimiter', 'delimiter 정보 미입력')
				.stringNotByEmpty('outputPath', 'outputPath 정보 미입력');
		} catch(errmsg) {
			this.refs.alertDialog.show('danger', errmsg);
			return;
		}

		var outputPath = this.state.outputPath;
		if(String.endsWith(outputPath, '/') === false && String.endsWith(outputPath, '\\') === false)
			outputPath += '/';

		server.generateDb2FileScript({
			period: this.state.period,
			dbVendor: this.state.dbVendor,
			dbIp: this.state.dbIp,
			dbPort: this.state.dbPort,
			dbSid: this.state.dbSid,
			jdbcDriver: this.state.jdbcDriver,
			jdbcConnUrl: this.state.jdbcConnUrl,
			jdbcUsername: this.state.jdbcUsername,
			jdbcPassword: this.state.jdbcPassword,
			columns: this.state.columns,
			table: this.state.table,
			bindingType: this.state.bindingType,
			bindingColumn: this.state.bindingColumn,
			delimiter: this.state.delimiter,
			charset: this.state.charset,
			outputPath: outputPath
		})
		.then(function(script) {
			this.refs.scriptDialog.show({
				scriptName: '',
				script: script,
				onActionCallback: function(result, scriptName, script) {
					if(result === false) {
						this.refs.scriptDialog.hide();
						return;
					}

					if(scriptName == null || scriptName.trim().length === 0) {
						this.refs.alertDialog.show('danger', '스크립트 이름 미입력');
						return;
					}

					server.postScript({ title: scriptName, script: script })
						.then(function(success) {
							this.refs.scriptDialog.hide();
							this.refs.alertDialog.show('success', 'script registered');
						}.bind(this))
						.catch(function(err) {
							if(typeof err === 'object') err = JSON.stringify(err);
							this.refs.alertDialog.show('danger', err);
						}.bind(this));
				}.bind(this)
			});
		}.bind(this))
		.catch(function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	render() {
		try {
			var handleStateChange = { handleStateChange: this.handleStateChange };

			var jdbc = {
				jdbcDriver: this.state.jdbcDriver,
				jdbcConnUrl: this.state.jdbcConnUrl,
				jdbcUsername: this.state.jdbcUsername,
				jdbcPassword: this.state.jdbcPassword
			};

			var dbInfo = {
				dbVendor: this.state.dbVendor,
				dbIp: this.state.dbIp,
				dbPort: this.state.dbPort,
				dbSid: this.state.dbSid
			};

			var databaseConfigCardData = _.extend({}, jdbc, dbInfo, handleStateChange, {
				title: 'database config',
				subtitle: 'source database 연결정보를 설정합니다.'
			});

			var tableColumnConfigCardData = _.extend({}, jdbc, handleStateChange, {
				table: this.state.table,
				columns: this.state.columns
			});

			var bindingTypeCardData = _.extend({}, jdbc, handleStateChange, {
				table: this.state.table,
				bindingType: this.state.bindingType,
				bindingColumn: this.state.bindingColumn
			});

			var etcConfigCardData = _.extend({},  handleStateChange, {
				period: this.state.period,
				charset: this.state.charset,
				delimiter: this.state.delimiter,
				outputPath: this.state.outputPath
			});

			return (
				<div> 
					<DatabaseConfigCard {...databaseConfigCardData} />
					<TableColumnConfigCard {...tableColumnConfigCardData} />
					<BindingTypeCard {...bindingTypeCardData} />
					<EtcConfigCard {...etcConfigCardData} />
					<Button
						label="생성"
						primary={true}
						onClick={this.showScriptDialog} />
					<ScriptDialog ref="scriptDialog" />
					<AlertDialog ref="alertDialog" />
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = NewDb2FileView;