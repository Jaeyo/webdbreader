var React = require('react'),
	Panel = require('./components/panel.jsx').Panel,
	ListGroup = require('./components/list-group.jsx').ListGroup,
	util = require('util'),
	UrlPattern = require('url-pattern'),
	pattern = new UrlPattern('/Script/View/:scriptName/'),
	jsUtil = require('./util/util.js'),
	handleError = jsUtil.handleError,
	handleResp = jsUtil.handleResp;

var dispatcher = {
	listeners: [],
	dispatch(type, data) {
		this.listeners.forEach(function(listener) {
			listener(type, data);
		});
	},
	listen(listener) {
		this.listeners.push(listener);
	}
};

var BtnArea = React.createClass({
	getDefaultProps() {
		return {
			scriptName: '',
			isScriptRunning: false,
			isScriptLoaded: false
		};
	},

	onScriptStart(evt) {
		$.post(util.format('/REST/Script/Start/%s/', this.props.scriptName), {}, 'json')
		.fail(handleError)
		.done(handleResp(function(resp) {
			bootbox.alert('script started', function() {
				dispatcher.dispatch('reload-script', {});
			});
		}));
	},

	onScriptStop(evt) {
		$.post(util.format('/REST/Script/Stop/%s/', this.props.scriptName), {}, 'json')
		.fail(handleError).done(handleResp(function(resp) {
			bootbox.alert('script stopped', function() {
				dispatcher.dispatch('reload-script', {});
			});
		}));
	},

	onEdit(evt) {
		window.location.href = util.format('/Script/Edit/%s/', this.props.scriptName);
	},

	onRename(evt) {
		bootbox.prompt('new title: ', function(newTitle) {
			if(newTitle === null) return;
			$.post(util.format('/REST/Script/Rename/%s/', this.props.scriptName), { newTitle: newTitle })
			.fail(handleError).done(handleResp(function(resp) {
				bootbox.alert('script renamed', function() {
					window.location.href = util.format('/Script/View/%s/', newTitle);
				});
			}));
		}.bind(this));
	},

	onRemove(evt) {
		bootbox.confirm('remove', function(result) {
			if(result === false) return;

			$.post(util.format('/REST/Script/Remove/%s/', this.props.scriptName), {}, 'json')
			.fail(handleError).done(handleResp(function(resp) {
				bootbox.alert('script removed', function() {
					window.location.href = '/';
				});
			}));
		}.bind(this));
	},

	render() {
		if(this.props.isScriptLoaded === false) {
			return (<span>loading...</span>);
		} else {
			return (
				<div className="btn-area">
					<button 
						type="button" 
						className="btn btn-primary btn-sm" 
						disabled={this.props.isScriptRunning === true ? true : false}
						onClick={this.onScriptStart}
						>start</button>
					<button
						type="button"
						className="btn btn-primary btn-sm"
						disabled={this.props.isScriptRunning === true ? false : true}
						onClick={this.onScriptStop}
						>stop</button>
					<span className="divider" />
					<button
						type="button"
						className="btn btn-default btn-sm"
						onClick={this.onEdit}>edit script</button>
					<button 
						type="button"
						className="btn btn-default btn-sm"
						onClick={this.onRename}>rename</button>
					<button
						type="button"
						className="btn btn-danger btn-sm"
						onClick={this.onRemove}>remove</button>
				</div>
			);
		}
	}
});

var InformationPanel = React.createClass({
	getDefaultProps() {
		return {
			isScriptLoaded: false,
			isScriptRunning: false,
			scriptPrettyRegdate: ''
		}
	},

	render() {
		return (
			<Panel className="information-panel">
				<Panel.Heading glyphicon="th">information</Panel.Heading>
				<Panel.Body>
					{ this.props.isScriptLoaded === false ?
						(<span>loading...</span>) : 
						(<ListGroup>
							<ListGroup.Item>
								<span className="pull-left">status</span>
								{ this.props.isScriptRunning === true ? 
									(<span className="pull-right label label-primary">ON</span>) : 
									(<span className="pull-right label label-danger">OFF</span>)
								}
								<div className="clearfix" />
							</ListGroup.Item>
							<ListGroup.Item>
								<span className="pull-left">regdate</span>
								<span className="pull-right">{this.props.scriptPrettyRegdate}</span>
								<div className="clearfix" />
							</ListGroup.Item>
						</ListGroup>)
					}
				</Panel.Body>
			</Panel>
		);
	}
});

var ScriptPanel = React.createClass({
	editor: null,

	getDefaultProps() {
		return {
			isScriptLoaded: false,
			script: ''
		};
	},

	componentDidUpdate() {
		if(this.props.isScriptLoaded === true) {
			this.editor = ace.edit('editor');
			this.editor.setTheme('ace/theme/github');
			this.editor.getSession().setMode('ace/mode/javascript');
			this.editor.setKeyboardHandler('ace/keyboard/vim');
			this.editor.setReadOnly(true);
		} //if
	},

	render() {
		return (
			<Panel className="script-panel">
				<Panel.Heading glyphicon="cog">script</Panel.Heading>
				<Panel.Body>
					{ this.props.isScriptLoaded === false ?
						(<span>loading...</span>) :
						(<pre id="editor">{this.props.script}</pre>)
					}
				</Panel.Body>
			</Panel>
		);
	}
});

var LogMonitoringPanel = React.createClass({
	ws: null,

	getDefaultProps() {
		return {
			scriptName: ''
		};
	},

	getInitialState() {
		return {
			logItems: []
		};
	},

	componentDidMount() {
		this.ws = new WebSocket(util.format('ws://%s/WebSocket/Logger/', window.location.host));
		this.ws.onopen = function() {
			console.log('web socket opened');
			this.ws.send(JSON.stringify({ scriptName: this.props.scriptName }));
		}.bind(this);
		this.ws.onmessage = function(evt) {
			var data = JSON.parse(evt.data);

			var newLogItems = 
				[(<LogMonitoringPanel.LogItem 
					itemstamp={data.timestamp}
					level={data.level}
					msg={data.msg} />)].concat(this.state.logItems);
			if(newLogItems.length > 100) newLogItems.pop();
			this.setState({ logItems: newLogItems });
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
			<Panel className="log-monitoring-panel">
				<Panel.Heading glyphicon="time">log monitoring ...</Panel.Heading>
				<Panel.Body>
					<ul>
						{ this.state.logItems }
					</ul>
				</Panel.Body>
			</Panel>
		);
	}
});

LogMonitoringPanel.LogItem = React.createClass({
	getDefaultProps() {
		return {
			timestamp: '',
			level: '',
			msg: ''
		};
	},

	render() {
		return (
			<li>
				<span className="timestamp">
					<span className="glyphicon glyphicon-time" />
					<span>{this.props.timestamp}</span>
				</span>
				<span className="level">{this.props.level}</span>
				<span className="msg">{this.props.msg}</span>
			</li>
		);
	}
});

var ViewScriptView = React.createClass({
	getDefaultProps() {
		return {
			scriptName: pattern.match(window.location.pathname).scriptName
		};
	},

	getInitialState() {
		return {
			isScriptLoaded: false,
			isScriptRunning: false,
			scriptPrettyRegdate: '',
			script: ''
		};
	},

	componentDidMount() {
		dispatcher.listen(function(type, data) {
			if(type === 'reload-script') {
				this.loadScript();
			} //if
		}.bind(this));

		this.loadScript();
	},

	loadScript() {
		$.getJSON(util.format('/REST/Script/Load/%s/', this.props.scriptName), {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			this.setState({
				isScriptLoaded: true,
				isScriptRunning: resp.script.IS_RUNNING,
				scriptPrettyRegdate: resp.script.PRETTY_REGDATE,
				script: resp.script.SCRIPT
			});
		}.bind(this)));
	},

	render() {
		return (
			<div>
				<BtnArea 
					scriptName={this.props.scriptName}
					isScriptRunning={this.state.isScriptRunning}
					isScriptLoaded={this.state.isScriptLoaded} />
				<hr />
				<div>
					<InformationPanel 
						isScriptLoaded={this.state.isScriptLoaded}
						isScriptRunning={this.state.isScriptRunning}
						scriptPrettyRegdate={this.state.scriptPrettyRegdate} />
					<ScriptPanel 
						isScriptLoaded={this.state.isScriptLoaded}
						script={this.state.script} />
					<div className="clearfix" />
				</div>
				<div>
					<LogMonitoringPanel 
						scriptName={this.props.scriptName} />
				</div>
			</div>
		);
	}
});


React.render(
	<ViewScriptView />,
	$('.contents-area')[0]
);