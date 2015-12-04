var React = require('react');
var uuid = require('uuid');
var server = require('../utils/server.js');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var Button = MaterialWrapper.Button;

var CodeTab = React.createClass({
	editor: null,
	uuid: uuid.v4(),

	PropTypes: {
		title: React.PropTypes.string.isRequired,
		script: React.PropTypes.string.isRequired
	},

	componentDidMount() {
		this.editor = ace.edit(this.uuid);
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.$blockScrolling = Infinity;
		this.editor.setValue(this.props.script);
	},

	componentDidUpdate(prevProps, prevState) {
		this.editor.setValue(this.props.script);
	},

	edit() {
		server.editScript({
			title: this.props.title,
			script: this.editor.getValue()
		})
		.then(function() {
			window.location.reload(true);
		})
		.catch(function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	render() {
		return (
			<div>
				<div id="editor-wrapper" 
					style={{
						position: 'relative',
						minHeight: '400px' 
					}}>
					<div id={this.uuid}
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 0,
							left: 0 }} />
					}
				</div>
				<Button
					label="수정"
					primary={true}
					onClick={this.edit} />
				<AlertDialog ref="alertDialog" />
			</div>
		);
	}
});

module.exports = CodeTab;