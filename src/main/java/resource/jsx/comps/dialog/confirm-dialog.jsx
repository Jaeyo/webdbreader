var React = require('react'),
	MaterialWrapper = require('../material-wrapper.jsx'),
	Dialog = MaterialWrapper.Dialog,
	TextField = MaterialWrapper.TextField,
	Button = MaterialWrapper.Button,
	Alert = require('react-bootstrap').Alert;

var ConfirmDialog = React.createClass({
	onShowCallback: null,
	onOkCallback: null,
	onCancelCallback: null,

	getInitialState() {
		return {
			visible: false,
			msg: ''
		};
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

	show(msg) {
		this.setState({
			visible: true,
			msg: msg
		}, function() {
			if(this.onShowCallback != null) this.onShowCallback();
			this.onShowCallback = null;
		});
	},

	cancel(evt) {
		this.setState({ visible: false }, function() {
			if(this.onCancelCallback != null) this.onCancelCallback();
			this.onCancelCallback = null;
		}.bind(this));
	},

	ok(evt) {
		this.setState({ visible: false }, function() {
			if(this.onOkCallback != null) this.onOkCallback();
			this.onOkCallback = null;
		}.bind(this));
	},

	render() {
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
				</Dialog>
			</div>
		);
	}
});
module.exports = ConfirmDialog;