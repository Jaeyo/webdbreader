var React = require('react'),
	util = require('util'),
	UrlPattern = require('url-pattern'),
	pattern = new UrlPattern('/Script/TailFileOut/:scriptName/');


var TailFileOutView = React.createClass({
	ws: null,

	getDefaultProps() {
		return {
			scriptName: decodeURI(pattern.match(window.location.pathname).scriptName)
		};
	},

	getInitialState() {
		return {
			msgs: []
		};
	},

	componentDidMount() {
		this.ws = new WebSocket(util.format('ws://%s/WebSocket/FileOutMsg/', window.location.host));
		this.ws.onopen = function() {
			console.log('web socket opened');
			this.ws.send(JSON.stringify({ 
				type: 'start-tail',
				scriptName: this.props.scriptName 
			}));
		}.bind(this);
		this.ws.onmessage = function(evt) {
			var msg = JSON.parse(evt.data);

			if(!msg.type) {
				bootbox.alert('unknown msg: ' + evt.data);
				this.ws.close();
				return;
			} //if

			switch(msg.type) {
				case 'msg':
					var newMsg = { timestamp: msg.timestamp, msg: msg.msg };
					var newMsgs = [newMsg].concat(this.state.msgs);
					if(newMsgs.length > 100) newMsgs.pop();
					this.setState({ msgs: newMsgs });
					break;
				case 'error':
					bootbox.alert(msg.errmsg);
					break;
				default: 
					bootbox.alert('unknown msg: ' + evt.data);
					this.ws.close();
			} //switch
		}.bind(this);
		this.ws.onclose = function() {
			console.log('web socket closed');
		};
		this.ws.onerror = function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			console.error(err);
			bootbox.alert(err);
		};
	},

	render() {
		return (
			<table>
				<thead>
					<tr>
						<th>timestamp</th>
						<th>msg</th>
					</tr>
				</thead>
				<tbody>
					{this.state.msgs.map(function(msg) {
						return (
							<tr>
								<td>{msg.timestamp}</td>
								<td>{msg.msg}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}
});

React.render(
	<TailFileOutView />,
	document.body
);