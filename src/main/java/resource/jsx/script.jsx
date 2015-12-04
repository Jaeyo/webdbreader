var React = require('react');
var _ = require('underscore');
var Clearfix = require('./comps/clearfix.jsx').Clearfix;
var server = require('./utils/server.js');
var color = require('./utils/util.js').color;
var Glyphicon = require('react-bootstrap').Glyphicon;
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
var PromptDialog = require('./comps/dialog/prompt-dialog.jsx');
var AlertDialog = require('./comps/dialog/alert-dialog.jsx');


var TotalChartPanel = React.createClass({
	styles() {
		return {
			card: {
				marginBottom: '10px'
			}
		};
	},

	render() {
		var style = this.styles();
		return (
			<Card style={style.card}>
				<CardHeader
					title="chart"
					subtitle="등록된 스크립트들의 통계를 제공합니다."
					avatar={ <Glyphicon glyph="signal" /> } />
				<CardText>
					//TODO IMME
				</CardText>
			</Card>
		);
	}
});


var ScriptsPanel = React.createClass({
	getInitialState() {
		return { scripts: [] };
	},

	componentDidMount() {
		server
			.loadScripts()
			.then(function(scripts) {
				this.setState({ scripts: scripts });
			}.bind(this)).catch(function(err) {
				console.error(err);
				console.error(err.stack);
				//TODO IMME
			});
	},

	render() {
		return (
			<Card style={{ marginBottom: '10px', overflow: 'inherit' }}>
				<CardHeader
					title="scripts"
					subtitle="등록된 스크립트들을 제어합니다."
					avatar={ <Glyphicon glyph="console" /> } />
				<CardText>
					<List>
					{
						this.state.scripts.length === 0 ? 
						( <ListItem primaryText="no data" /> ) : 
						this.state.scripts.map(function(script) {
							return (
								<ScriptsPanelItem 
									key={script.SCRIPT_NAME}
									title={script.SCRIPT_NAME} 
									isRunning={script.IS_RUNNING} 
									regdate={script.REGDATE} />
							);
						})
					}
					</List>
				</CardText>
				<div style={{ padding: '10px', textAlign: 'right' }}>
					<Button label="new script" primary={true} />
				</div>
			</Card>
		);
	}
});


var ScriptsPanelItem = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired,
		isRunning: React.PropTypes.bool.isRequired,
		regdate: React.PropTypes.object.isRequired
	},

	goToInfoPage(evt) {
		if(evt.target.className.indexOf('glyphicon') !== -1) return;
		window.location.href = '/Script/Info?title=' + encodeURI(this.props.title);
	},

	start() {
		//TODO
	},

	stop() {
		//TODO
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
				if(typeof err === 'object') err = JSON.stringify(err);
				this.refs.alertDialog.show('danger', err);
			}.bind(this));
		}.bind(this)).show('rename to', this.props.title);
	},

	delete() {
		//TODO
	},

	render() {
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
					<StatisticsValue bg="rgb(22, 160, 133)" value="22" />
					<StatisticsValue bg="rgb(243, 156, 18)" value="24" />
					<StatisticsValue bg="rgb(41, 128, 185)" value="44" />
				</div>
				<Clearfix />
				<PromptDialog ref="promptDialog" />
				<AlertDialog ref="alertDialog" />
			</ListItem>
		);
	}
});


var ScriptView = React.createClass({
	render() {
		return (
			<div>	
				<TotalChartPanel />
				<ScriptsPanel/>
			</div>	
		);
	}
});

module.exports = ScriptView;