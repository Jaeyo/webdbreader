var React = require('react');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Dialog = MaterialWrapper.Dialog;
var TextField = MaterialWrapper.TextField;
var AlertDialog = require('../../comps/dialog/alert-dialog.jsx');
var server = require('../../utils/server.js');
var uuid = require('uuid');
var util = require('util');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var ImportVer1ScriptDialog = React.createClass({ 
	uuid: uuid.v4(),
	editor: null,

	getInitialState() {
		return {
			visible: false,
			scriptName: '',
			dbName: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: ''
		};
	},

	show() {
		this.setState({
			visible: true,
			scriptName: '',
			dbName: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: ''
		}, function() {
			this.initScriptEditor();
		}.bind(this));
	},

	hide() {
		this.setState({ visible: false });
	},

	initScriptEditor() {
		if(this.editor != null)
			this.editor.destroy();

		this.editor = ace.edit('editor-' + this.uuid);
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.$blockScrolling = Infinity;
		this.editor.setValue('');
	},

	handleAction(name, evt) {
		evt.stopPropagation();

		if(name === 'cancel') {
			this.setState({ visible: false });
			return;
		}

		if(name === 'ok') {
			server.importVer1Script({
				title: this.state.scriptName, 
				script: this.editor.getValue(),
				dbName: this.state.dbName,
				jdbcDriver: this.state.jdbcDriver,
				jdbcConnUrl: this.state.jdbcConnUrl,
				jdbcUsername: this.state.jdbcUsername,
				jdbcPassword: this.state.jdbcPassword
			}).then(function(resp) {
				this.refs.alertDialog
					.onHide(this.hide)
					.show('success', 'script saved');
			}.bind(this)).catch(function(err) {
				this.refs.alertDialog.show('danger', err);
			}.bind(this));
		}
	},

	handleChange(name, evt) {
		evt.stopPropagation();

		var state = {};
		state[name] = evt.target.value;
		this.setState(state);
	},

	render() {
		try {
			return (
				<Dialog
					title="스크립트"
					actions={[
						{ text: 'ok', onClick: this.handleAction.bind(this, 'ok') },
						{ text: 'cancel', onClick: this.handleAction.bind(this, 'cancel') }
					]}
					actionFocus="ok"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<TextField
						floatingLabelText="script name"
						value={this.state.scriptName}
						fullWidth={true}
						onChange={this.handleChange.bind(this, 'scriptName')} />
					<Grid fluid={true}>
						<Row>
							<Col xs={6}>
								<TextField
									floatingLabelText="db name"
									value={this.state.dbName}
									fullWidth={true}
									onChange={this.handleChange.bind(this, 'dbName')} />
							</Col>
							<Col xs={6}>
								<TextField
									floatingLabelText="jdbc driver"
									value={this.state.jdbcDriver}
									fullWidth={true}
									onChange={this.handleChange.bind(this, 'jdbcDriver')} />
								<TextField
									floatingLabelText="jdbc conn url"
									value={this.state.jdbcConnUrl}
									fullWidth={true}
									onChange={this.handleChange.bind(this, 'jdbcConnUrl')} />
								<TextField
									floatingLabelText="jdbc username"
									value={this.state.jdbcUsername}
									fullWidth={true}
									onChange={this.handleChange.bind(this, 'jdbcUsername')} />
								<TextField
									floatingLabelText="jdbc password"
									value={this.state.jdbcPassword}
									fullWidth={true}
									type="password"
									onChange={this.handleChange.bind(this, 'jdbcPassword')} />
							</Col>
						</Row>
					</Grid>
					<hr />
					<div id="editor-wrapper" style={{ position: 'relative', height: '250px' }}>
						<div id={ 'editor-' + this.uuid } style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }} />
					</div>
					<AlertDialog ref="alertDialog" />
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ImportVer1ScriptDialog;