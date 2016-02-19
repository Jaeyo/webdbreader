var React = require('react');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var TextField = MaterialWrapper.TextField;
var SelectField = MaterialWrapper.SelectField;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var CircularProgress = MaterialWrapper.CircularProgress;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var ListDivider = MaterialWrapper.ListDivider;
var Dialog = MaterialWrapper.Dialog;
var Toggle = MaterialWrapper.Toggle;
var PolymerIcon = require('../../comps/polymer-icon.jsx');

var DbAddressDialog = React.createClass({
	PropTypes: {
		dbIp: React.PropTypes.string.isRequired,
		dbPort: React.PropTypes.string.isRequired,
		dbSid: React.PropTypes.string.isRequired,
		handleStateChange: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			visible: false
		};
	},

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	handleChange(name, evt) {
		evt.stopPropagation();

		var state = {};
		state[name] = evt.target.value;
		this.props.handleStateChange(state);
	},

	handleKeyUp(evt) {
		evt.stopPropagation();
		if(evt.keyCode === 13) this.hide();
	},

	render() {
		try {
			return (
				<Dialog
					title="database address config"
					actions={[
						{ text: 'ok', onClick: this.hide }
					]}
					actionFocus="ok"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<TextField
						style={{ width: '170px', marginRight: '3px' }}
						inputStyle={{ textAlign: 'center' }}
						floatingLabelText="database ip"
						value={this.props.dbIp}
						onChange={this.handleChange.bind(this, 'dbIp')}
						onKeyUp={this.handleKeyUp} />
					<TextField
						style={{ width: '60px', marginRight: '3px' }}
						inputStyle={{ textAlign: 'center' }}
						floatingLabelText="port"
						value={this.props.dbPort}
						onChange={this.handleChange.bind(this, 'dbPort')}
						onKeyUp={this.handleKeyUp} />
					<TextField
						style={{ width: '120px', marginRight: '3px' }}
						inputStyle={{ textAlign: 'center' }}
						floatingLabelText="sid"
						value={this.props.dbSid}
						onChange={this.handleChange.bind(this, 'dbSid')}
						onKeyUp={this.handleKeyUp} />
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = DbAddressDialog;