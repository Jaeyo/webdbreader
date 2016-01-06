var React = require('react');
var precondition = require('../../utils/precondition.js');
var server = require('../../utils/server.js');
var ScriptMaker = require('../../new-db2file/db2file-script-maker.js');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Dialog = MaterialWrapper.Dialog;
var TextField = MaterialWrapper.TextField;
var uuid = require('uuid');

var ScriptDialog = React.createClass({
	uuid: uuid.v4(),
	editor: null,
	onActionCallback: null,

	getInitialState() {
		return { 
			visible: false,
			scriptName: '',
			script: ''
		};
	},

	show(scriptName, script, onActionCallback) {
		this.onActionCallback = onActionCallback;

		this.setState({ 
			visible: true, 
			scriptName: scriptName,
			script: script 
		}, function() {
			this.initScriptEditor();
		}.bind(this));
	},

	hide(callback) {
		this.setState({ visible: false }, callback);
	},

	initScriptEditor() {
		if(this.editor != null)
			this.editor.destroy();

		this.editor = ace.edit('editor-' + this.uuid);
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.$blockScrolling = Infinity;
		this.editor.setValue(this.state.script);
	},

	handleAction(name, evt) {
		evt.stopPropagation();

		if(name === 'ok' || name === 'cancel') {
			if(this.onActionCallback != null) {
				this.onActionCallback(name === 'ok', this.state.scriptName, this.editor.getValue());
			}
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
					<div id="editor-wrapper" style={{ position: 'relative', height: '250px' }}>
						<div id={ 'editor-' + this.uuid } style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }} />
					</div>
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ScriptDialog;