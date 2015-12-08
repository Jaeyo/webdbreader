var React = require('react'),
	ReactDOM = require('react-dom'),
	precondition = require('./utils/precondition.js'),
	AlertDialog = require('./comps/dialog/alert-dialog.jsx'),
	DatabaseConfigPanel = require('./new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./new-db2file/binding-type-panel.jsx'),
	EtcConfigPanel = require('./new-db2file/etc-config-panel.jsx'),
	ScriptConfirmDialog = require('./new-db2file/script-confirm-dialog.jsx'),
	MaterialWrapper = require('./comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button;

var NewDb2FileView = React.createClass({
	script: null,

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
			outputPath: '',
			confirmScriptDialogVisible: false
		};
	},

	onChange(args) {
		if(args.script) {
			this.script = args.script;
			delete args.script;
			if(Object.keys(args).length === 0) return;
		}

		if(args.columns) args.columns = args.columns.toLowerCase();

		this.setState(args);
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

		this.setState({
			confirmScriptDialogVisible: true
		});
	},

	render() {
		var dbConfigPanelParams = {
			dbVendor: this.state.dbVendor,
			dbIp: this.state.dbIp,
			dbPort: this.state.dbPort,
			dbSid: this.state.dbSid,
			jdbcDriver: this.state.jdbcDriver,
			jdbcConnUrl: this.state.jdbcConnUrl,
			jdbcUsername: this.state.jdbcUsername,
			jdbcPassword: this.state.jdbcPassword,
			table: this.state.table,
			columns: this.state.columns,
			onChange: this.onChange
		};

		var bindingTypePanelParams = {
			bindingType: this.state.bindingType,
			bindingColumn: this.state.bindingColumn,
			jdbcDriver: this.state.jdbcDriver,
			jdbcConnUrl: this.state.jdbcConnUrl,
			jdbcUsername: this.state.jdbcUsername,
			jdbcPassword: this.state.jdbcPassword,
			table: this.state.table,
			onChange: this.onChange
		};

		var etcConfigPanelParams = {
			period: this.state.period,
			charset: this.state.charset,
			delimiter: this.state.delimiter,
			outputPath: this.state.outputPath,
			onChange: this.onChange
		};

		var scriptConfirmDialogParams = {
			visible: this.state.confirmScriptDialogVisible,
			onClose: function() { this.setState({ confirmScriptDialogVisible: false }); }.bind(this),
			saveMode: true,
			dbVendor: this.state.dbVendor,
			dbIp: this.state.dbIp,
			dbPort: this.state.dbPort,
			dbSid: this.state.dbSid,
			jdbcDriver: this.state.jdbcDriver,
			jdbcConnUrl: this.state.jdbcConnUrl,
			jdbcUsername:this.state.jdbcUsername,
			jdbcPassword: this.state.jdbcPassword,
			bindingType: this.state.bindingType,
			bindingColumn: this.state.bindingColumn,
			table: this.state.table,
			columns: this.state.columns,
			period: this.state.period,
			charset: this.state.charset,
			delimiter: this.state.delimiter,
			outputPath: this.state.outputPath
		};

		return (
			<div> 
				<DatabaseConfigPanel {...dbConfigPanelParams} />
				<BindingTypePanel {...bindingTypePanelParams} />
				<EtcConfigPanel {...etcConfigPanelParams} />
				<Button
					label="생성"
					primary={true}
					onClick={this.showScriptDialog} />
				<ScriptConfirmDialog {...scriptConfirmDialogParams} />
				<AlertDialog ref="alertDialog" />
			</div>
		);
	}
});

module.exports = NewDb2FileView;