var React = require('react'),
	ReactDOM = require('react-dom'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx'),
	EtcConfigPanel = require('./view-comps/new-db2file/etc-config-panel.jsx'),
	CodePanel = require('./view-comps/new-db2file/code-panel.jsx'),
	MaterialWrapper = require('./comps/material-wrapper.jsx'),
	Dialog = MaterialWrapper.Dialog,
	TextField = MaterialWrapper.TextField,
	Button = MaterialWrapper.Button;

jsUtil.initPrototypeFunctions();

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
			scriptName: '',
			inputScriptNameDialogVisible: false
		};
	},

	toggleDialog(name, evt) {
		evt.stopPropagation();
		switch(name) {
		case 'inputScriptNameDialog': 
			this.setState({ 
				scriptName: '',
				inputScriptNameDialogVisible: !this.state.inputScriptNameDialogVisible
			});
			break;
		}
	},

	handleInputScriptNameDialogAction(name, evt) {
		evt.stopPropagation();
		switch(name) {
		case 'ok':
			this.setState({ inputScriptNameDialogVisible: false });
			//TODO IMME
			break;
		case 'cancel':
			this.setState({ inputScriptNameDialogVisible: false });
			break;
		}
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
			outputPath: this.state.outputPath,
			onChange: this.onChange
		};

		return (
			<div> 
				<h3 style={{ marginBottom: '3px' }}>database 설정</h3>
				<DatabaseConfigPanel {...dbConfigPanelParams} />
				<BindingTypePanel {...bindingTypePanelParams} />
				<EtcConfigPanel {...etcConfigPanelParams} />
				<CodePanel {...codePanelParams} />
				<Button
					label="생성"
					primary={true}
					onClick={this.toggleDialog.bind(this, 'inputScriptNameDialog')} />
				<InputScriptNameDialog
					visible={this.state.inputScriptNameDialogVisible}
					scriptName={this.state.scriptName}
					handleAction={this.handleInputScriptNameDialogAction}
					onChange={this.onChange} />
			</div>
		);
	}
});

var InputScriptNameDialog = React.createClass({
	PropTypes: {
		visible: React.PropTypes.bool.isRequired,
		scriptName: React.PropTypes.string.isRequired,
		handleAction: React.PropTypes.func.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	getDefaultProps() {
		return { visible: false };
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		var state = {};
		state[name] = evt.taget.value;
		this.props.onChange(state);
	},

	render() {
		return (
			<Dialog
				title="스크립트 이름"
				actions={[
					{ text: 'ok', onClick: this.props.handleAction.bind(this, 'ok') },
					{ text: 'cancel', onClick: this.props.handleAction.bind(this, 'cancel') }
				]}
				actionFocus="ok"
				open={this.props.visible}>
				<TextField
					floatingLabelText="script name"
					value={this.props.scriptName}
					fullWidth={true}
					onChange={this.handleChange.bind(this, 'scriptName')} />
			</Dialog>
		);
	}
});


ReactDOM.render(
	<Layout active="script">
		<NewDb2FileView />
	</Layout>,
	document.getElementById('container')
);