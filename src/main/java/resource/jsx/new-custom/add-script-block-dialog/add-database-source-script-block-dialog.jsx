var React = require('react');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Dialog = MaterialWrapper.Dialog;
var Paper = MaterialWrapper.Paper;
var TextField = MaterialWrapper.TextField;

var AddDatabaseSourceScriptBlockDialog = React.createClass({
	callback: null,

	getInitialState() {
		return {
			visible: false,

			driver: '',
			connUrl: '',
			username: '',
			password: '',
			maxQuery: '',
			mainQuery: '',
			period: ''
		};
	},

	show(callback) {
		this.callback = callback;
		this.setState({ visible:true });
	},

	hide() {
		this.setState({ visible: false });
	},

	onOk(evt) {
		evt.stopPropagation();
		this.hide();
		if(this.callback != null) {
			this.callback(true, {
				type: 'databaseSourceScriptBlock',
				driver: this.state.driver,
				connUrl: this.state.connUrl,
				username: this.state.username,
				password: this.state.password,
				maxQuery: this.state.maxQuery,
				mainQuery: this.state.mainQuery,
				period: this.state.period
			});
		}
	},

	onCancel(evt) {
		evt.stopPropagation();
		if(this.callback != null) this.callback(false);
		this.hide();
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		var state = {};
		state[name] = evt.target.value;
		this.setState(state);
	},

	render() {
		return (
			<Dialog
				title="new database source script block"
				action={[
					{ text: 'ok', onClick: this.onOk },
					{ text: 'cancel', onClick: this.onCancel }
				]}
				actionFocus="ok"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.state.visible}>
				<TextField
					fullWidth={true}
					floatingLabelText="driver"
					value={this.state.driver}
					onChange={this.handleChange.bind(this, 'driver')} />
				<TextField
					fullWidth={true}
					floatingLabelText="connUrl"
					value={this.state.connUrl}
					onChange={this.handleChange.bind(this, 'connUrl')} />
				<TextField
					fullWidth={true}
					floatingLabelText="username"
					value={this.state.username}
					onChange={this.handleChange.bind(this, 'username')} />
				<TextField
					fullWidth={true}
					type="password"
					floatingLabelText="password"
					value={this.state.password}
					onChange={this.handleChange.bind(this, 'password')} />
				<TextField
					fullWidth={true}
					floatingLabelText="maxQuery"
					value={this.state.maxQuery}
					onChange={this.handleChange.bind(this, 'maxQuery')} />
				<TextField
					fullWidth={true}
					floatingLabelText="mainQuery"
					value={this.state.mainQuery}
					onChange={this.handleChange.bind(this, 'mainQuery')} />
				<TextField
					fullWidth={true}
					floatingLabelText="period"
					value={this.state.period}
					onChange={this.handleChange.bind(this, 'period')} />
			</Dialog>
		);
	}
});
module.exports = AddDatabaseSourceScriptBlockDialog;