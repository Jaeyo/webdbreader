var React = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;
var InfoTab = require('./script-info/info-tab.jsx');
var ScriptConfigTab = require('./script-info/script-config-tab.jsx');
var TailTab = require('./script-info/tail-tab.jsx');
var server = require('./utils/server.js');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var IconMenu = MaterialWrapper.IconMenu;
var MenuItem = MaterialWrapper.MenuItem;
var Tabs = MaterialWrapper.Tabs;
var Tab = MaterialWrapper.Tab;
var PromptDialog = require('./comps/dialog/prompt-dialog.jsx');
var AlertDialog = require('./comps/dialog/alert-dialog.jsx');
var ConfirmDialog = require('./comps/dialog/confirm-dialog.jsx');

var ScriptInfoView = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { 
			regdate: '',
			script: '',
			scriptParams: null,
			isRunning: false,
			isTailEnable: false
		};
	},

	componentDidMount() {
		this.loadScript((arg) => {
			this.setState({
				script: arg.script.SCRIPT,
				regdate: arg.script.REGDATE,
				isRunning: arg.script.IS_RUNNING
			});
		});

		this.loadScriptParams((arg) => {
			if(arg.parsable === true)
				this.setState({ scriptParams: arg.scriptParams });
		});

		this.isTailEnable((result) => {
			this.setState({ isTailEnable: result });
		});
	},

	loadScript(callback) {
		var { refs } = this;
		server
			.loadScript({ title: this.props.title })
			.then((script) => {
				callback({ script: script });
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});
	},

	isTailEnable(callback) {
		var { refs } = this;
		server
			.isEnableTail()
			.then((result) => {
				callback(result)
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});
	},

	loadScriptParams(callback) {
		server
			.loadScriptParams({ title: this.props.title })
			.then(function(resp) {
				if(resp.parsable === 1) {
					callback({
						parsable: true,
						scriptParams: resp.params
					});
				} else {
					callback({
						parsable: false,
						msg: resp.msg
					});
				}
			}.bind(this)).catch(function(err) {
				this.refs.alertDialog.show('danger', err);
			}.bind(this));
	},

	start(evt) {
		evt.stopPropagation();

		server.startScript({
			title: this.props.title
		}).then(function() {
			window.location.reload(true);
		}).catch(function(err) {
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	stop(evt) {
		evt.stopPropagation();

		server.stopScript({
			title: this.props.title
		}).then(function() {
			window.location.reload(true);
		}).catch(function(err) {
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	rename(evt) {
		evt.stopPropagation();

		this.refs.promptDialog.onOk(function(newTitle) {
			server.renameScript({
				title: this.props.title,
				newTitle: newTitle
			}).then(function() {
				window.location.href = '/Script/Info?title=' + encodeURI(newTitle);
			}).catch(function(err) {
				this.refs.alertDialog.show('danger', err);
			}.bind(this));
		}.bind(this)).show('rename to', this.props.title);
	},

	delete(evt) {
		evt.stopPropagation();

		this.refs.confirmDialog.onOk(function() {
			server.removeScript({
				title: this.props.title
			}).then(function() {
				window.location.href = '/';
			}).catch(function(err) {
				this.refs.alertDialog.show('danger', err);
			});
		}.bind(this)).show('delete script: ' + this.props.title);
	},

	renderBtns() {
		var { state } = this;
		if(state.isRunning === true) {
			return (<Button label="stop" onClick={this.stop} primary={true} />);
		} else {
			return (
				<div>
					<Button label="start" onClick={this.start} primary={true} />
					<Button label="rename" onClick={this.rename} />
					<Button label="delete" onClick={this.delete} />
				</div>
			);
		}
	},

	renderTabs() {
		var { state, props } = this;

		var tabs = [];
		tabs.push(
			<Tab label="infomation" key="information">
				<InfoTab 
					title={props.title} 
					script={state.script}
					isRunning={state.isRunning} />
			</Tab>
		);
		if(state.scriptParams != null) {
			tabs.push(
				<Tab label="configuration" key="configuration">
					<ScriptConfigTab 
						title={props.title} 
						scriptParams={state.scriptParams}
						isRunning={state.isRunning} />
				</Tab>
			);
		}
		if(state.isTailEnable === true) {
			tabs.push(
				<Tab label="tail" key="tail">
					<TailTab title={props.title} />
				</Tab>
			);
		}

		return ( <Tabs>{tabs}</Tabs> );
	},

	render() {
		try {
			var { props, state } = this;

			return (
				<Card>
					<CardHeader
						title={props.title}
						subtitle={state.regdate}
						avatar={ <Glyphicon glyph="file" /> } />
					<CardText>
						<div style={{ textAlign: 'right' }}>
						{ this.renderBtns() }
						</div>
						{ this.renderTabs() }
						<hr />
					</CardText>
					<AlertDialog ref="alertDialog" />
					<PromptDialog ref="promptDialog" />
					<ConfirmDialog ref="confirmDialog" />
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ScriptInfoView;