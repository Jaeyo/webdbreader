var React = require('react');
var color = require('../utils/util.js').color;
var server = require('../utils/server.js');
var Clearfix = require('../comps/clearfix.jsx').Clearfix;
var Glyphicon = require('react-bootstrap').Glyphicon;
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var ListItem = MaterialWrapper.ListItem;
var IconMenu = MaterialWrapper.IconMenu;
var MenuItem = MaterialWrapper.MenuItem;
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var ConfirmDialog = require('../comps/dialog/confirm-dialog.jsx');
var PromptDialog = require('../comps/dialog/prompt-dialog.jsx');


var ScriptPanelItem = React.createClass({
	intervalId: null,

	PropTypes: {
		title: React.PropTypes.string.isRequired,
		isRunning: React.PropTypes.bool.isRequired,
		regdate: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			statistics_input: '...',
			statistics_output: '...',
			statistics_errorLog: '...'
		};
	},

	goToInfoPage(evt) {
		if(evt.target.className.indexOf('glyphicon') !== -1) return;
		window.location.href = '/Script/Info?title=' + encodeURI(this.props.title);
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
				window.location.reload(true);
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
				window.location.reload(true);
			}).catch(function(err) {
				this.refs.alertDialog.show('danger', err);
			}.bind(this));
		}.bind(this)).show('delete script: ' + this.props.title);
	},

	loadStatisticsValues() {
		server.lastStatistics({
			scriptName: this.props.title,
			period: 5*60*1000
		})
		.then(function(data) {
			var state = {};
			state.statistics_input = data.input === undefined ? 0 : data.input;
			state.statistics_output = data.output === undefined ? 0 : data.output;
			state.statistics_errorLog = data.errorLog === undefined ? 0 : data.errorLog;
			this.setState(state);
		}.bind(this))
		.catch(function(err) {
			console.error(err);
			clearInterval(this.intervalId);
		}.bind(this));
	},

	componentDidMount() {
		this.loadStatisticsValues();
		this.intervalId = setInterval(this.loadStatisticsValues, 10*1000);
	},

	componentWillUnmount() {
		clearInterval(this.intervalId);
	},

	render() {
		try {
			var StatisticsValue = (props) => {
				return (
					<span style={{ 
						padding: '10px', 
						color: 'white', 
						backgroundColor: props.bg,
						display: 'inline-block',
						minWidth: '58px',
						textAlign: 'center',
						lineHeight: '1.1',
						marginRight: '3px'
					}}>{props.value}</span>
				);
			};

			var OnOffLabel = (props) => {
				return ( 
					<label style={{ 
						backgroundColor: props.value === 'on' ? color.blue : color.red,
						color: 'white',
						minWidth: '33px',
						textAlign: 'center',
						lineHeight: 1.4,
						borderRadius: '5px',
						marginRight: '10px'
					}}>{props.value.toUpperCase()}</label> 
				);
			};

			return (
				<ListItem 
					onClick={this.goToInfoPage}
					style={{ 
						borderLeft: '7px solid ' + color.lightBlue,
						marginBottom: '3px'
					}}
					rightIconButton={
						<IconMenu 
							iconButtonElement={ <Glyphicon glyph="option-horizontal" /> }
							style={{ cursor: 'pointer', fontSize: '120%' }}
							openDirection="top-left">
							{
								this.props.isRunning === true ? 
								( <MenuItem primaryText="stop" onClick={this.stop} /> ) : 
								( <MenuItem primaryText="start" onClick={this.start} /> )
							}
							<MenuItem primaryText="rename" onClick={this.rename} />
							<MenuItem primaryText="delete" onClick={this.delete} />
						</IconMenu>
					}>
					<div style={{ float: 'left' }}>
						<h3 style={{ 
							fontSize: '150%',
							marginBottom: '10px'
						}}>{this.props.title}</h3>
						<div style={{ fontSize: '80%', color: 'gray' }}>
							<OnOffLabel value={ this.props.isRunning === true ? 'on' : 'off' } />
							<label>{this.props.regdate}</label>
						</div>
					</div>
					<div style={{ float: 'right', fontSize: '150%' }}>
						<StatisticsValue bg="rgb(22, 160, 133)" value={this.state.statistics_input} />
						<StatisticsValue bg="rgb(41, 128, 185)" value={this.state.statistics_output} />
						<StatisticsValue bg="rgb(186, 41, 56)" value={this.state.statistics_errorLog} />
					</div>
					<Clearfix />
					<PromptDialog ref="promptDialog" />
					<AlertDialog ref="alertDialog" />
					<ConfirmDialog ref="confirmDialog" />
				</ListItem>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = ScriptPanelItem;