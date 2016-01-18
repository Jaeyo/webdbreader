var React = require('react');
var NotificationSystem = require('react-notification-system');
var util = require('util');

var RealtimeNoti = React.createClass({
	notiSystem: null,
	errLogWebSocket: null,

	//args: level, msg
	//level: success, error, warning, info
	addNoti(args) {
		this.notiSystem.addNotification({
			autoDismiss: 5,
			position: 'tr',
			message: args.msg,
			level: args.level
		});
	},

	initErrLogWebSocket() {
		this.errLogWebSocket = new WebSocket(util.format('ws://%s/WebSocket/Noti/ErrorLog/', location.host));
		this.errLogWebSocket.onmessage = function(msg) {
			msg = JSON.parse(msg.data);

			if(msg.type !== 'errLog') {
				console.error(msg);
				return;
			}

			this.addNoti({ 
				level: 'error', 
				msg: util.format('[%s] %s', msg.scriptName, msg.msg)
			});
		}.bind(this);
	},

	componentDidMount() {
		this.notiSystem = this.refs.notiSystem;
		this.initErrLogWebSocket();
	},

	render() {
		return ( <NotificationSystem ref="notiSystem" /> );
	}
});
module.exports = RealtimeNoti;