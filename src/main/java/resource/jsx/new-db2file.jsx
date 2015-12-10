var React = require('react');
var precondition = require('./utils/precondition.js');
var AlertDialog = require('./comps/dialog/alert-dialog.jsx');
var DatabaseConfigCard = require('./new-db2file/database-config-card.jsx');
var BindingTypePanel = require('./new-db2file/binding-type-panel.jsx');
var EtcConfigPanel = require('./new-db2file/etc-config-panel.jsx');
var ScriptConfirmDialog = require('./new-db2file/script-confirm-dialog.jsx');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;

var NewDb2FileView = React.createClass({
	dataAdapter: null,

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
			period: '6 * 1000',
			charset: 'utf8',
			delimiter: '|',
			outputPath: ''
		};
	},

	componentWillMount() {
		if(this.dataAdapter == null) {
			this.dataAdapter = newDataAdapter();
			this.dataAdapter.on('stateChange', function(state) {
				if(state.columns) state.columns = state.columns.toLowerCase();
				this.setState(state);
			}.bind(this));

			this.dataAdapter.onData(function(key) {
				return this.state[key];
			}.bind(this));
		}
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

		this.refs.scriptConfirmDialog.show();
	},

	render() {

		var databaseConfigPanelData = {
			//TODO		
		};

		var scriptConfirmDialogData = {
			period: this.state.period
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
			outputPath: this.state.outputPath
		};

		return (
			<div> 
				<DatabaseConfigCard dataAdapter={this.dataAdapter} />
				<BindingTypePanel dataAdapter={this.dataAdapter} />
				<EtcConfigPanel dataAdapter={this.dataAdapter} />
				<Button
					label="생성"
					primary={true}
					onClick={this.showScriptDialog} />
				<ScriptConfirmDialog 
					ref="scriptConfirmDialog"
					saveMode={true}
					{...scriptConfirmDialogData} />
				<AlertDialog ref="alertDialog" />
			</div>
		);
	}
});

module.exports = NewDb2FileView;