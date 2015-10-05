var React = require('react'),
	util = require('util'),
	UrlPattern = require('url-pattern'),
	pattern = new UrlPattern('/Script/Edit/:scriptName/'),
	jsUtil = require('./util/util.js'),
	handleError = jsUtil.handleError,
	handleResp = jsUtil.handleResp;

var EditScriptView = React.createClass({
	editor: null,

	getDefaultProps() {
		return {
			scriptName: pattern.match(window.location.pathname).scriptName
		}
	},

	componentDidMount() {
		this.editor = ace.edit('editor');
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');

		$.getJSON(util.format('/REST/Script/Load/%s/', this.props.scriptName), {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			debugger; //DEBUG
			this.editor.setValue(resp.script.SCRIPT);
		}.bind(this)));
	},

	onExportScript() {
		bootbox.alert('not implemented');
	},

	onSaveScript() {
		$.post(util.format('/REST/Script/Edit/%s/', this.props.scriptName), 
			{ script: this.editor.getValue() })
		.fail(handleError)
		.done(handleResp(function(resp) {
			bootbox.alert('script saved', function() {
				window.location.href = util.format('/Script/View/%s/', this.props.scriptName);
			}.bind(this));
		}.bind(this)));
	},

	render() {
		return (
			<div>
				<div>
					<pre id="editor" />
				</div>
				<div className="oper-btns">
					<button 
						type="button"
						className="btn btn-primary"
						onClick={this.onExportScript}
						>export</button>
					<button
						type="button"
						className="btn btn-info"
						onClick={this.onSaveScript}
						>save</button>
				</div>
			</div>
		);
	}
});


var EditScriptHeader = React.createClass({
	getDefaultProps() {
		return {
			scriptName: pattern.match(window.location.pathname).scriptName
		};
	},

	render() {
		return (
			<h3>{this.props.scriptName}</h3>
		);
	}
});


React.render(
	<EditScriptView />,
	$('.contents-area')[0]
);

React.render(
	<EditScriptHeader />,
	$('.title-area')[0]
);