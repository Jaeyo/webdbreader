var React = require('react');
var util = require('util');
var moment = require('moment');
var Glyphicon = require('react-bootstrap').Glyphicon;
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
	loggerWebSocket: null,
	fileOutMsgWebSocket: null,

	PropTypes: {
		title: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			logs: [],
			fileOutMsgs: []
		};
	},

	componentDidMount() {
		try {
			if(!window.WebSocket) {
				console.error('websocket not supported by this browser');
				return;
			} 

			this.initLoggerWebSocket();
			this.initFileOutMsgEventSource();
		} catch(err) {
			console.error(err.stack);
		}
	},

	initLoggerWebSocket() {
		var self = this;

		this.loggerWebSocket = new WebSocket(util.format('ws://%s/WebSocket/Logger/%s/', location.host, this.props.title));
		this.loggerWebSocket.onmessage = function(msg) {
			msg = JSON.parse(msg.data);

			if(msg.type !== 'log') {
				console.error(msg);
				return;
			}

			var logs = [msg].concat(self.state.logs);
			if(logs.length > 50) logs.splice(logs.length-1, logs.length - 50);
			self.setState({ logs: logs });
		};
		this.loggerWebSocket.onerror = function(evt) {
			console.error('on error', { evt: evt });
		};
	},

	initFileOutMsgEventSource() {
		var self = this;

		var tempFileOutMsgs = [];
		var popTempFileOutMsgsFn = function() {
			if(tempFileOutMsgs.length === 0) {
				setTimeout(popTempFileOutMsgsFn, 1000);
				return;
			}

			var fileOutMsgs = tempFileOutMsgs.concat(self.state.fileOutMsgs);
			tempFileOutMsgs = [];
			if(fileOutMsgs.length > 50) fileOutMsgs.splice(fileOutMsgs.length-1, fileOutMsgs.length - 50);
			console.log('before setState', { fileOutMsgs: fileOutMsgs }); //DEBUG
			self.setState({ fileOutMsgs: fileOutMsgs }, function() {
				console.log('after setState'); //DEBUG
				setTimeout(popTempFileOutMsgsFn, 1000);
			});
		};
		setTimeout(popTempFileOutMsgsFn, 1000);

		this.fileOutMsgWebSocket = new WebSocket(util.format('ws://%s/WebSocket/FileOutMsg/%s/', location.host, this.props.title));
		this.fileOutMsgWebSocket.onmessage = function(msg) {
			msg = JSON.parse(msg.data);

			if(msg.type !== 'fileOutMsg') {
				console.error(msg);
				return;
			}

			tempFileOutMsgs.push(msg);
			// var fileOutMsgs = [msg].concat(self.state.fileOutMsgs);
			// if(fileOutMsgs.length > 50) fileOutMsgs.splice(fileOutMsgs.length-1, fileOutMsgs.length - 50);
			// self.setState({ fileOutMsgs: fileOutMsgs });
		};
		this.fileOutMsgWebSocket.onerror = function(evt) {
			console.error('on error', { evt: evt });
		};
	},

	render() {
		try {
			return (
				<Paper style={{ padding: '10px' }}>
					<Card style={{ marginBottom: '10px' }}>
						<CardHeader
							title="log tailing"
							avatar={ <Glyphicon glyph="file" /> } />
						<CardText>
							<LogList logs={this.state.logs} />
						</CardText>
					</Card>
					<Card style={{ marginBottom: '10px' }}>
						<CardHeader
							title="file tailing"
							avatar={ <Glyphicon glyph="file" /> } />
						<CardText>
							<FileOutMsgList fileOutMsgs={this.state.fileOutMsgs} />
						</CardText>
					</Card>
				</Paper>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = TailTab;


//props: logs
var LogList = (props) => {
	return (
		<List style={{
			maxHeight: '400px',
			overflow: 'auto'
		}}>
		{
			props.logs.map(function(log, index) {
				console.log({
					log: log,
					timestamp: log.timestamp
				}); //DEBUG
				return (
					<ListItem 
						key={'log-' + log.uuid}
						primaryText={ util.format('[%s] %s', log.level.toUpperCase(), log.msg) }
						secondaryText={ moment(log.timestamp).format('YYYY.MM.DD HH:mm:ss') } />
				);
			})
		}
		</List>
	);
};

//props: fileOutMsgs
var FileOutMsgList = (props) => {
	return (
		<List style={{
			maxHeight: '400px',
			overflow: 'auto'
		}}>
		{
			props.fileOutMsgs.map(function(fileOutMsg) {
				return (
					<ListItem
						key={'fileOutMsg-' + fileOutMsg.uuid}
						primaryText={ util.format('[%s] %s', fileOutMsg.filename, fileOutMsg.msg) }
						secondaryText={ moment(fileOutMsg.timestamp).format('YYYY.MM.DD HH:mm:ss') } />
				);
			})
		}
		</List>
	);
};