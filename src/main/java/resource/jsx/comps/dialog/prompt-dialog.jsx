var React = require('react'),
	MaterialWrapper = require('../material-wrapper.jsx'),
	Dialog = MaterialWrapper.Dialog,
	TextField = MaterialWrapper.TextField,
	Button = MaterialWrapper.Button,
	Alert = require('react-bootstrap').Alert;


var PromptDialog = React.createClass({
	onShowCallback: null, 
	onOkCallback: null, 
	onCancelCallback: null, 

	getInitialState() {
		return { 
			visible: false,
			msg: '', 
			answer: ''
		};
	},

	handleChange(name, evt) {
		var state = {};
		state[name] = evt.target.value;
		this.setState(state);
	},

	stopPropagation(evt) {
		evt.stopPropagation();
	},

	onShow(callback) {
		this.onShowCallback = callback;
		return this;
	},

	onOk(callback) {
		this.onOkCallback = callback;
		return this;
	},

	onCancel(callback) {
		this.onCancelCallback = callback;
		return this;
	},

	show(msg, defaultAnswer) {
		if(defaultAnswer == null) defaultAnswer = '';
		this.setState({
			visible: true,
			msg: msg,
			answer: defaultAnswer
		}, function() {
			if(this.onShowCallback != null) this.onShowCallback();
			this.onShowCallback = null;
		});
	}, 

	cancel() {
		this.setState({ visible: false }, function() {
			if(this.onCancelCallback != null) this.onCancelCallback();
			this.onCancelCallback = null;
		}.bind(this));
	},

	ok() {
		this.setState({ visible: false }, function() {
			if(this.onOkCallback != null) this.onOkCallback(this.state.answer);
			this.onOkCallback = null;
		}.bind(this));
	},

	render() {
		try {
			return (
				<div onClick={this.stopPropagation}>
					<Dialog
						actions={[
							{ text: 'ok', onClick: this.ok },
							{ text: 'cancel', onClick: this.cancel }
						]}
						actionFocus="ok"
						autoDetectWindowHeight={true}
						autoScrollBodyContent={true}
						open={this.state.visible}>
						<strong>
							{this.state.msg}
						</strong>
						<TextField
							value={this.state.answer}
							fullWidth={true}
							onChange={this.handleChange.bind(this, 'answer')} />
					</Dialog>
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = PromptDialog;