var React = require('react');
var WS = require('ws');

var Websocket = React.createClass({
	ws: null,

	PropTypes: {
		url: React.PropTypes.string.isRequired,
		onOpen: React.PropTypes.func,
		onMessage: React.PropTypes.func,
		onClose: React.PropTypes.func
	},

	componentDidMount() {
		this.ws = new WS(this.props.url);
		if(this.props.onOpen) this.ws.addEventListener('open', this.props.onOpen)
		if(this.props.onClose) this.ws.addEventListener('close', this.props.onClose)
		if(this.props.onMessage) this.ws.addEventListener('message', this.onMessage)
	},

	send(msg) {
		if(typeof msg === 'object') msg = JSON.stringify(msg);
		this.ws.send(msg);
	},

	onMessage(msg) {
		this.props.onMessage(msg.data);
	},

	close() {
		this.ws.close();
	},

	render() {
		return (<div />);
	}
});
module.exports = Websocket;