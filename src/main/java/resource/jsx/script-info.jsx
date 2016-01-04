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
			isRunning: false
		};
	},

	componentDidMount() {
		server
			.loadScript({ title: this.props.title })
			.then(function(script) {
				this.setState({ 
					script: script.SCRIPT,
					regdate: script.REGDATE,
					isRunning: script.IS_RUNNING
				});
			}.bind(this)).catch(function(err) {
				console.error(err.stack);
				this.refs.alertDialog.show('danger', '스크립트 정보를 불러올 수 없습니다.');
			}.bind(this));
	},

	start(evt) {
		evt.stopPropagation();

		server.startScript({
			title: this.props.title
		}).then(function() {
			window.location.reload(true);
		}).catch(function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
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
			if(typeof err === 'object') err = JSON.stringify(err);
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
				if(typeof err === 'object') err = JSON.stringify(err);
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
				if(typeof err === 'object') err = JSON.stringify(err);
				this.refs.alertDialog.show('danger', err);
			});
		}.bind(this)).show('delete script: ' + this.props.title);
	},

	render() {
		return (
			<Card>
				<CardHeader
					title={this.props.title}
					subtitle={this.state.regdate}
					avatar={ <Glyphicon glyph="file" /> } />
				<CardText>
					<div style={{ textAlign: 'right' }}>
						{
							this.state.isRunning === false  ?
							(<Button label="start" onClick={this.start} primary={true} />) : 
							(<Button label="stop" onClick={this.stop} primary={true} />) 
						}
						<Button label="rename" onClick={this.rename} />
						<Button label="delete" onClick={this.delete} />
					</div>
					<hr />
					<Tabs>
						<Tab label="infomation">
							<InfoTab title={this.props.title} script={this.state.script} />
						</Tab>
						<Tab label="configuration">
							<ScriptConfigTab title={this.props.title} script={this.state.script} />
						</Tab>
						<Tab label="tail">
							<TailTab title={this.props.title} />
						</Tab>
					</Tabs>
				</CardText>
				<AlertDialog ref="alertDialog" />
				<PromptDialog ref="promptDialog" />
				<ConfirmDialog ref="confirmDialog" />
			</Card>
		);
	}
});
module.exports = ScriptInfoView;