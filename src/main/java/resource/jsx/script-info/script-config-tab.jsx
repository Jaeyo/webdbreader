var React = require('react');
var parseCodeContext = require('js-code-context');
var _ = require('underscore');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var AlertDialog = require('../comps/alert-dialog.jsx');
var Db2File = {
	DatabaseConfigPanel: require('../new-db2file/database-config-panel.jsx'),
	BindingTypePanel: require('../new-db2file/binding-type-panel.jsx'),
	EtcConfigPanel: require('../new-db2file/etc-config-panel.jsx'),
	ScriptConfirmDialog: require('../new-db2file/script-confirm-dialog.jsx'),
	ScriptMaker: require('../new-db2file/db2file-script-maker.js')
};

var ScriptConfigTab = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired,
		script: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			scriptObj: {}
		};
	},

	componentDidMount() {
		this.parseScript(this.props.script);
	},

	componentWillReceiveProps(newProps) {
		this.parseScript(newProps.script);
	},

	onChange(args) {
		this.setState(args);
	},

	parseScript(script) {
		if(script.trim().length === 0) return;
		parseCodeContext(script, function(err, objs) {
			if(err) {
				console.error(err);
				if(typeof err === 'object') err = JSON.stringify(err);
				this.setState({ scriptObj: {} }, function() {
					this.refs.alertdialog.show('danger', err);
				}.bind(this));
				return;
			}

			var scriptObj = {};
			objs.forEach(function(obj) {
				if(obj.receiver !== undefined) return;
				if(String.startsWith(obj.value, '\'') && String.endsWith(obj.value, '\''))
					obj.value = obj.value.substring(1, obj.value.length - 1);
				scriptObj[obj.name] = obj.value;
			});
			this.setState({ scriptObj: scriptObj });
		}.bind(this));
	},

	render() {
		var parsedView = null;

		switch(this.state.scriptObj.type) {
			case undefined: 
				parsedView = (<UnknownScriptView />);
				break;
			case 'db2file':
				parsedView = (
					<Db2FileScriptView 
						title={this.props.title}
						scriptObj={this.state.scriptObj} 
						onChange={this.onChange} />
				);
				break;
		}

		return (
			<div>
				{parsedView}
				<AlertDialog refs="alertDialog" />
			</div>
		);
	}
});
module.exports = ScriptConfigTab;



var UnknownScriptView = (props) => {
	return (<div>script is not parseable</div>);
};



var Db2FileScriptView = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired,
		scriptObj: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return { scriptConfirmDialogVisible: false };
	},

	edit(evt) {
		this.setState({ scriptConfirmDialogVisible: true });
	},

	onChange(args) {
		var scriptObj = _.extend({}, this.props.scriptObj, args);
		this.props.onChange({ scriptObj: scriptObj });
	},

	render() {
		var dbConfigPanelParams = {
			dbVendor: this.props.scriptObj.dbVendor,
			dbIp: this.props.scriptObj.dbIp,
			dbPort: this.props.scriptObj.dbPort,
			dbSid: this.props.scriptObj.dbSid,
			jdbcDriver: this.props.scriptObj.jdbcDriver,
			jdbcConnUrl: this.props.scriptObj.jdbcConnUrl,
			jdbcUsername: this.props.scriptObj.jdbcUsername,
			jdbcPassword: this.props.scriptObj.jdbcPassword,
			table: this.props.scriptObj.table,
			columns: this.props.scriptObj.columns,
			onChange: this.onChange
		};

		var bindingTypePanelParams = {
			bindingType: this.props.scriptObj.bindingType,
			bindingColumn: this.props.scriptObj.bindingColumn,
			jdbcDriver: this.props.scriptObj.jdbcDriver,
			jdbcConnUrl: this.props.scriptObj.jdbcConnUrl,
			jdbcUsername: this.props.scriptObj.jdbcUsername,
			jdbcPassword: this.props.scriptObj.jdbcPassword,
			table: this.props.scriptObj.table,
			onChange: this.onChange
		};

		var etcConfigPanelParams = {
			period: this.props.scriptObj.period,
			charset: this.props.scriptObj.charset,
			delimiter: this.props.scriptObj.delimiter,
			outputPath: this.props.scriptObj.outputPath,
			onChange: this.onChange
		};

		var scriptConfirmDialogParams = {
			visible: this.state.scriptConfirmDialogVisible,
			onClose: function() { this.setState({ scriptConfirmDialogVisible: false }); }.bind(this),
			editMode: true,
			title: this.props.title,
			dbVendor: this.props.scriptObj.dbVendor,
			dbIp: this.props.scriptObj.dbIp,
			dbPort: this.props.scriptObj.dbPort,
			dbSid: this.props.scriptObj.dbSid,
			jdbcDriver: this.props.scriptObj.jdbcDriver,
			jdbcConnUrl: this.props.scriptObj.jdbcConnUrl,
			jdbcUsername:this.props.scriptObj.jdbcUsername,
			jdbcPassword: this.props.scriptObj.jdbcPassword,
			bindingType: this.props.scriptObj.bindingType,
			bindingColumn: this.props.scriptObj.bindingColumn,
			table: this.props.scriptObj.table,
			columns: this.props.scriptObj.columns,
			period: this.props.scriptObj.period,
			charset: this.props.scriptObj.charset,
			delimiter: this.props.scriptObj.delimiter,
			outputPath: this.props.scriptObj.outputPath
		};

		return (
			<div>
				<Db2File.DatabaseConfigPanel {...dbConfigPanelParams} />
				<Db2File.BindingTypePanel {...bindingTypePanelParams} />
				<Db2File.EtcConfigPanel {...etcConfigPanelParams} />
				<Button 
					label="수정"
					primary={true}
					onClick={this.edit} />
				<Db2File.ScriptConfirmDialog {...scriptConfirmDialogParams} />
			</div>
		);
	}
});