var React = require('react'),
	ReactDOM = require('react-dom'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	precondition = require('./utils/precondition.js'),
	ScriptMaker = require('./view-comps/new-db2file/db2file-script-maker.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx'),
	EtcConfigPanel = require('./view-comps/new-db2file/etc-config-panel.jsx'),
	MaterialWrapper = require('./comps/material-wrapper.jsx'),
	Dialog = MaterialWrapper.Dialog,
	TextField = MaterialWrapper.TextField,
	Button = MaterialWrapper.Button,
	Alert = require('react-bootstrap').Alert;

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
			this.refs.warnDialog.show(errmsg);
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

		var scriptConfirmDIalogParams = {
			visible: this.state.confirmScriptDialogVisible,
			onClose: function() { this.setState({ confirmScriptDialogVisible: false }); }.bind(this),
			dbVendor: this.state.dbVendor,
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
				<h3 style={{ marginBottom: '3px' }}>database 설정</h3>
				<DatabaseConfigPanel {...dbConfigPanelParams} />
				<BindingTypePanel {...bindingTypePanelParams} />
				<EtcConfigPanel {...etcConfigPanelParams} />
				<Button
					label="생성"
					primary={true}
					onClick={this.showScriptDialog} />
				<ScriptConfirmDialog {...scriptConfirmDIalogParams} />
				<WarnDialog ref="warnDialog" />
			</div>
		);
	}
});



var ScriptConfirmDialog = React.createClass({
	editor: null,
	scriptMaker: new ScriptMaker(),

	PropTypes: {
		visible: React.PropTypes.bool.isRequired,
		onClose: React.PropTypes.func.isRequired,
		dbVendor: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername:React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		bindingType: React.PropTypes.string.isRequired,
		bindingColumn: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		period: React.PropTypes.string.isRequired,
		charset: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.string.isRequired,
		outputPath: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { 
			scriptName: ''
		};
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.visible === true && this.props.visible === false) {
			this.editor.destroy();
		} else if(prevProps.visible === false && this.props.visible === true) {
			this.editor = ace.edit('editor');
			this.editor.setTheme('ace/theme/github');
			this.editor.getSession().setMode('ace/mode/javascript');
			this.editor.setKeyboardHandler('ace/keyboard/vim');
			this.editor.$blockScrolling = Infinity;
			this.editor.setValue(this.makeScript());
		}
	},

	makeScript() {
		return this.scriptMaker.get({
			period: this.props.period,
			dbVendor: this.props.dbVendor,
			jdbcDriver: this.props.jdbcDriver,
			jdbcConnUrl: this.props.jdbcConnUrl,
			jdbcUsername: this.props.jdbcUsername,
			jdbcPassword: this.props.jdbcPassword,
			columns: this.props.columns,
			table: this.props.table,
			bindingColumn: this.props.bindingColumn,
			delimiter: this.props.delimiter,
			charset: this.props.charset,
			outputPath: this.props.outputPath
		});
	},

	handleAction(action) {
		if(action === 'ok') {
			console.log(this.state.scriptName); //DEBUG
			console.log(this.editor.getValue()); //DEBUG
		}
		this.props.onClose();
	},

	styles() {
		return {
			editorWrapper: {
				position: 'relative',
				height: '400px'
			},
			editor: {
				position: 'absolute',
				top: 0,
				bottom: 0,
				right: 0,
				left: 0
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<Dialog
				title="스크립트"
				actions={[
					{ text: 'ok', onClick: function(evt) { this.handleAction('ok'); }.bind(this) },
					{ text: 'cancel', onClick: function(evt) { this.handleAction('cancel'); }.bind(this) }
				]}
				actionFocus="ok"
				open={this.props.visible}>
				<TextField
					floatingLabelText="script name"
					value={this.state.scriptName}
					fullWidth={true}
					onChange={ function(evt) { this.setState({ scriptName: evt.target.value }); }.bind(this) } />
				<div id="editor-wrapper" style={style.editorWrapper}>
					<div id="editor" style={style.editor} />
				</div>
			</Dialog>
		);
	}
});


var WarnDialog = React.createClass({
	getInitialState() {
		return { 
			visible: false,
			msg: ''
		};
	},

	show(msg) {
		this.setState({
			visible: true,
			msg: msg
		});
	}, 

	hide() {
		this.setState({ visible: false });
	},

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'close', onClick: function(evt) { this.setState({ visible: false }) }.bind(this) }
				]}
				actionFocus="close"
				open={this.state.visible}>
				<Alert bsStyle="danger">
					<strong>
						{this.state.msg}
					</strong>
				</Alert>
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