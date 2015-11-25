var React = require('react'),
	ReactDOM = require('react-dom'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx'),
	CodePanel = require('./view-comps/new-db2file/code-panel.jsx'),
	MaterialWrapper = require('./comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button;

jsUtil.initPrototypeFunctions();

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
			period: '6 * 1000',
			charset: 'utf8',
			delimiter: '|',
			outputFile: ''
		};
	},

	onChange(args) {
		if(args.columns) args.columns = args.columns.toLowerCase();
		this.setState(args);
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

		var codePanelParams = {
			dbVendor: this.state.dbVendor,
			jdbcDriver: this.state.jdbcDriver,
			jdbcConnUrl: this.state.jdbcConnUrl,
			jdbcUsername: this.state.jdbcUsername,
			jdbcPassword: this.state.jdbcPassword,
			bindingType: this.state.bindingType,
			bindingColumn: this.state.bindingColumn,
			table: this.state.table,
			columns: this.state.columns,
			period: this.state.period,
			charset: this.state.charset,
			delimiter: this.state.delimiter,
			outputFile: this.state.outputFile,
			onChange: this.onChange
		};

		return (
			<div> 
				<h3 style={{ marginBottom: '3px' }}>database 설정</h3>
				<DatabaseConfigPanel {...dbConfigPanelParams} />
				<BindingTypePanel {...bindingTypePanelParams} />
				<CodePanel {...codePanelParams} />
			</div>
		);
	}
});


ReactDOM.render(
	<Layout active="script">
		<NewDb2FileView />
	</Layout>,
	document.getElementById('container')
);