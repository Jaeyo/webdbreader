var React = require('react'),
	MaterialWrapper = require('../material-wrapper.jsx'),
	Dialog = MaterialWrapper.Dialog,
	TextField = MaterialWrapper.TextField,
	Button = MaterialWrapper.Button,
	Alert = require('react-bootstrap').Alert;


var AlertDialog = React.createClass({
	onShowCallback: null, 
	onHideCallback: null, 

	getInitialState() {
		return { 
			visible: false,
			bsStyle: 'success', //success, info, warning, danger
			msg: ''
		};
	},

	onShow(callback) {
		this.onShowCallback = callback;
		return this;
	},

	onHide(callback) {
		this.onHideCallback = callback;
		return this;
	},

	show(bsStyle, msg) {
		if(bsStyle === 'danger' && msg instanceof Error) console.error(msg.stack);
		
		if(msg instanceof Error) msg = msg.stack;
		else if(typeof msg === 'object') msg = JSON.stringify(msg);

		this.setState({
			visible: true,
			bsStyle: bsStyle,
			msg: msg
		}, function() {
			if(this.onShowCallback != null) this.onShowCallback();
			this.onShowCallback = null;
		});
	}, 

	hide() {
		this.setState({ visible: false }, function() {
			if(this.onHideCallback != null) this.onHideCallback();
			this.onHideCallback = null;
		}.bind(this));
	},

	render() {
		try {
			return (
				<Dialog
					actions={[
						{ text: 'close', onClick: this.hide }
					]}
					actionFocus="close"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<Alert bsStyle={this.state.bsStyle}>
						<strong>
							{this.state.msg}
						</strong>
					</Alert>
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = AlertDialog;