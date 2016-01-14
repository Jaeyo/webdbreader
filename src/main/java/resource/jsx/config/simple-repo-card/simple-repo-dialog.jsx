var React = require('react');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Dialog = MaterialWrapper.Dialog;
var TextField = MaterialWrapper.TextField;
var Button = MaterialWrapper.Button;
var server = require('../../utils/server.js');


var SimpleRepoDialog = React.createClass({
	//args: action, scriptName, key, value, hide(func)
	callback: null,

	getInitialState() {
		return { 
			visible: false,
			scriptName: null,
			key: null,
			value: null,
			btns: []
		};
	},

	//args: scriptName, key, value, btns(array of 'add', 'update', 'delete', 'cancel'), callback(func)
	show(args) {
		this.callback = args.callback;
		this.setState({
			visible: true,
			scriptName: args.scriptName,
			key: args.key,
			value: args.value,
			btns: args.btns
		});
	}, 

	hide() {
		this.setState({ visible: false });
		this.callback = null;
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		var state = {};
		state[name] = evt.target.value;
		this.setState(state);
	},

	render() {
		var actions = null;
		if(this.state.btns != null) {
			actions = this.state.btns.map(function(btn) {
				return {
					text: btn,
					onClick: function() {
						this.callback({
							action: btn,
							scriptName: this.state.scriptName,
							key: this.state.key,
							value: this.state.value,
							hide: this.hide
						});
					}.bind(this)
				};
			}.bind(this));
		}

		try {
			return (
				<Dialog
					actions={actions}
					actionFocus="close"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<TextField
						floatingLabelText="script name"
						fullWidth={true}
						value={this.state.scriptName}
						onChange={this.handleChange.bind(this, 'scriptName')} />
					<TextField
						floatingLabelText="key"
						fullWidth={true}
						value={this.state.key}
						onChange={this.handleChange.bind(this, 'key')} />
					<TextField
						floatingLabelText="value"
						fullWidth={true}
						value={this.state.value}
						onChange={this.handleChange.bind(this, 'value')} />
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = SimpleRepoDialog;