var React = require('react');
var parseCodeContext = require('js-code-context');
var _ = require('underscore');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var Db2File = {
	DatabaseConfigCard: require('../new-db2file/database-config-card.jsx'),
	BindingTypeCard: require('../new-db2file/binding-type-card.jsx'),
	EtcConfigCard: require('../new-db2file/etc-config-card.jsx'),
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

			if(scriptObj.type != null)
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
				parsedView = ( <Db2FileScriptView title={this.props.title} scriptObj={this.state.scriptObj} /> );
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
	dataAdapter: null,

	PropTypes: {
		title: React.PropTypes.string.isRequired,
		scriptObj: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return { 
			dbVendor: '',
			dbIp: '',
			dbPort: '',
			dbSid: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			columns: '',
			bindingType: 'simple',
			bindingColumn: '',
			period: '',
			charset: '',
			delimiter: '',
			outputPath: '',
			scriptConfirmDialogVisible: false 
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
				if(key === 'title') return this.props.title;
				return this.state[key];
			}.bind(this));
		}

		this.setState(this.props.scriptObj);
	},

	edit(evt) {
		this.setState({ scriptConfirmDialogVisible: true });
	},

	render() {
		return (
			<div>
				<Db2File.DatabaseConfigCard dataAdapter={this.dataAdapter} />
				<Db2File.BindingTypeCard dataAdapter={this.dataAdapter} />
				<Db2File.EtcConfigCard dataAdapter={this.dataAdapter} />
				<Button 
					label="수정"
					primary={true}
					onClick={this.edit} />
				<Db2File.ScriptConfirmDialog 
					visible={this.state.scriptConfirmDialogVisible}
					onClose={ function() { this.setState({ scriptConfirmDialogVisible: false }); }.bind(this) }
					editMode={true}
					title={this.dataAdapter.data('title')}
					dataAdapter={this.dataAdapter} />
			</div>
		);
	}
});