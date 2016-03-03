import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import InfoTab from './script-info/info-tab.jsx';
import ScriptConfigTab from './script-info/script-config-tab.jsx';
import TailTab from './script-info/tail-tab.jsx';
import server from './utils/server.js';
import {
	Button,
	FlatButton,
	Card,
	CardHeader,
	CardText,
	List,
	ListItem,
	IconMenu,
	MenuItem,
	Tabs,
	Tab
} from './comps/material-wrapper.jsx';

import PromptDialog from './comps/dialog/prompt-dialog.jsx';
import AlertDialog from './comps/dialog/alert-dialog.jsx';
import ConfirmDialog from './comps/dialog/confirm-dialog.jsx';

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

		server.loadScript({ title: this.props.title })
			.then((script) => {
				callback({ script: script });
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});
	},

	isTailEnable(callback) {
		var { refs } = this;

		server.isEnableTail()
			.then((result) => {
				callback(result)
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});
	},

	loadScriptParams(callback) {
		server.loadScriptParams({ title: this.props.title })
			.then((resp) => {
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
			}).catch((err) => {
				this.refs.alertDialog.show('danger', err);
			});
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

		return (
			<Tabs>
				<Tab label="infomation" key="information">
					<InfoTab 
						title={props.title} 
						script={state.script}
						isRunning={state.isRunning} />
				</Tab>
				{
					state.scriptParams != null ? 
					(<Tab label="configuration" key="configuration">
						<ScriptConfigTab 
							title={props.title} 
							scriptParams={state.scriptParams}
							isRunning={state.isRunning} />
					</Tab>) : []
				}
				{
					state.isTailEnable === true ? 
					(<Tab label="tail" key="tail">
						<TailTab title={props.title} />
					</Tab>) : []
				}
			</Tabs>
		);
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