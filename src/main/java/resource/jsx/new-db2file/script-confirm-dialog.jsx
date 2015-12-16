var React = require('react'),
	precondition = require('../utils/precondition.js'),
	server = require('../utils/server.js'),
	ScriptMaker = require('../new-db2file/db2file-script-maker.js'),
	AlertDialog = require('../comps/dialog/alert-dialog.jsx'),
	MaterialWrapper = require('../comps/material-wrapper.jsx'),
	Dialog = MaterialWrapper.Dialog,
	TextField = MaterialWrapper.TextField;

var ScriptConfirmDialog = React.createClass({
	editor: null,

	PropTypes: {
		saveMode: React.PropTypes.bool,
		editMode: React.PropTypes.bool,
		title: React.PropTypes.string, //required when editMode is true

		period: React.PropTypes.string.isRequired,
		dbVendor: React.PropTypes.string.isRequired,
		dbIp: React.PropTypes.string.isRequired,
		dbPort: React.PropTypes.string.isRequired,
		dbSid: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired,
		bindingType: React.PropTypes.string.isRequired,
		bindingColumn: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.string.isRequired,
		charset: React.PropTypes.string.isRequired,
		outputPath: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { 
			visible: false,
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

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	makeScript() {
		return ScriptMaker.get({
			period: this.props.period,
			dbVendor: this.props.dbVendor,
			dbIp: this.props.dbIp,
			dbPort: this.props.dbPort,
			dbSid: this.props.dbSid,
			jdbcDriver: this.props.jdbcDriver,
			jdbcConnUrl: this.props.jdbcConnUrl,
			jdbcUsername: this.props.jdbcUsername,
			jdbcPassword: this.props.jdbcPassword,
			columns: this.props.columns,
			table: this.props.table,
			bindingType: this.props.bindingType,
			bindingColumn: this.props.bindingColumn,
			delimiter: this.props.delimiter,
			charset: this.props.charset,
			outputPath: this.props.outputPath
		});
	},

	handleAction(action) {
		if(action === 'ok' && this.props.saveMode === true) {
			var data = {
				title: this.state.scriptName,
				script: this.editor.getValue()
			};

			try {
				precondition
					.instance(data)
					.stringNotByEmpty('title', 'title 미입력')
					.stringNotByEmpty('script', 'script 미입력');
			} catch(errmsg) {
				this.refs.alertDialog.show('danger', errmsg);
				return;
			}

			server.postScript(data)
				.then(function(success) {
					this.refs.alertDialog.onHide(function() {
						this.hide();
					}.bind(this)).show('success', 'script registered')
				}.bind(this))
				.catch(function(err) {
					this.refs.alertDialog.onHide(function() {
						this.hide();
					}.bind(this)).show('danger', err);
				}.bind(this));
		} else if(action === 'ok' && this.props.editMode === true) {
			var data = {
				title: this.props.title,
				script: this.editor.getValue()
			};

			try {
				precondition
					.instance(data)
					.stringNotByEmpty('script', 'script 미입력');
			} catch(errmsg) {
				this.refs.alertDialog.show('danger', errmsg);
				return;
			}

			server.editScript(data) 
				.then(function(success) {
					this.refs.alertDialog.onHide(function() {
						this.hide();
					}.bind(this)).show('success', 'script updated')
				}.bind(this))
				.catch(function(err) {
					this.refs.alertDialog.onHide(function() {
						this.hide();
					}.bind(this)).show('danger', err);
				}.bind(this));
		} else if(action === 'cancel') {
			this.hide();
		}
	},

	render() {
		return (
			<Dialog
				title="스크립트"
				actions={[
					{ text: 'ok', onClick: function(evt) { this.handleAction('ok'); }.bind(this) },
					{ text: 'cancel', onClick: function(evt) { this.handleAction('cancel'); }.bind(this) }
				]}
				actionFocus="ok"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.state.visible}>
				{
					this.props.editMode === true ? null : (
						<TextField
							floatingLabelText="script name"
							value={this.state.scriptName}
							fullWidth={true}
							onChange={ function(evt) { this.setState({ scriptName: evt.target.value }); }.bind(this) } />
					)
				}
				<div id="editor-wrapper" style={{ position: 'relative', height: '250px' }}>
					<div id="editor" style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }} />
				</div>
				<AlertDialog ref="alertDialog" />
			</Dialog>
		);
	}
});

module.exports = ScriptConfirmDialog;