var React = require('react');
var util = require('util');
var moment = require('moment');
var Glyphicon = require('react-bootstrap').Glyphicon;
var Websocket = require('../comps/websocket.jsx');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var IconMenu = MaterialWrapper.IconMenu;
var MenuItem = MaterialWrapper.MenuItem;
var Paper = MaterialWrapper.Paper;

moment.locale('ko');

var TailTab = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			logs: []
		};
	},

	onLogTailMsg(msg) {
		msg = JSON.parse(msg);
		if(msg.type !== 'msg') {
			console.error('invalid msg: ' + JSON.stringify(msg));
			return;
		}

		var logs = [msg].concat(this.state.logs);
		if(logs.length > 50) logs.splice(logs.length-1, logs.length - 50);
		this.setState({ logs: logs });
	},

	onLogTailClose() {
		console.log('log tail close');
	},

	onLogtailOpen() {
		console.log('log tail open');
		this.refs.logTailWebsocket.send({ 
			type: 'start-tail',
			scriptName: this.props.title
		});
	},

	render() {
		return (
			<Paper style={{ padding: '10px' }}>
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="log tailing"
						avatar={ <Glyphicon glyph="file" /> } />
					<CardText>
						<List style={{
								maxHeight: '400px',
								overflow: 'auto'
							}}>
						{
							this.state.logs.map(function(log) {
								return (
									<ListItem 
										key={log.timestamp}
										primaryText={ util.format('[%s] %s', log.level.toUpperCase(), log.msg) }
										secondaryText={ moment(log.timestamp).format('YYYY.MM.DD HH:mm:ss') } />
								);
							})
						}
						</List>
						<Websocket 
							ref="logTailWebsocket"
							url={ 'ws://' + window.location.host + '/WebSocket/Logger' }
							onClose={this.onLogTailClose}
							onOpen={this.onLogtailOpen}
							onMessage={this.onLogTailMsg} />
					</CardText>
				</Card>
			</Paper>
		);
	}
});
module.exports = TailTab;