var React = require('react'),
	ReactDOM = require('react-dom'),
	ReactCSS = require('reactcss'),
	Layout = require('./comps/layout.jsx').Layout,
	Panel = require('./comps/panel.jsx').Panel,
	Btn = require('./comps/btn.jsx').Btn,
	GlyphiconBtn = require('./comps/btn.jsx').GlyphiconBtn,
	Clearfix = require('./comps/clearfix.jsx').Clearfix,
	server = require('./utils/server.js'),
	jsUtil = require('./utils/util.js'),
	Glyphicon = require('react-bootstrap').Glyphicon,
	PolymerIcon = require('./comps/polymer-icon.jsx'),
	MaterialWrapper = require('./comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button,
	TextField = MaterialWrapper.TextField,
	SelectField = MaterialWrapper.SelectField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText,
	CircularProgress = MaterialWrapper.CircularProgress,
	List = MaterialWrapper.List,
	ListItem = MaterialWrapper.ListItem,
	ListDivider = MaterialWrapper.ListDivider,
	Dialog = MaterialWrapper.Dialog;


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
				//TODO IMME
			});
	},

	styles() {
		return {
			card: {
				marginBottom: '10px'
			},
			newScriptBtnDiv: {
				padding: '10px',
				textAlign: 'right'
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<Card style={style.card}>
				<CardHeader
					title="scripts"
					subtitle="등록된 스크립트들을 제어합니다."
					avatar={ <Glyphicon glyph="console" /> } />
				<CardText>
				{
					this.state.scripts.length === 0 ? 
					( <div>no data</div> ) : 
					this.state.scripts.map(function(script) {
						return (
							<ScriptsPanelItem 
								title={script.script_name} 
								isRunning={script.IS_RUNNING} 
								regdate={script.REGDATE} />
						);
					})
				}
				</CardText>
				<div style={style.newScriptBtnDiv}>
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

	styles() {
		return {
			outer: {
				style: {
					position: 'relative'
				},
				infoArea: {
					style: {
						float: 'left'
					}
				},
				btnArea: {
					style: {
						float: 'right'
					}
				},
				statisticsArea: {
					style: {
						float: 'right'
					},
					selectQuery: {
						display: 'inline-block',
						padding: '10px',
						backgroundColor: 'green'
					},
					updateQuery: {
						display: 'inline-block',
						padding: '10px',
						backgroundColor: 'blue'
					},
					fileWrite: {
						display: 'inline-block',
						padding: '10px',
						backgroundColor: 'yellow'
					}
				}
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<div style={style.outer.style}>
				<div style={style.infoArea.style}>
					<h3>{this.props.title}</h3>
					<label>{this.props.isRunning}</label>
					<label>{this.props.regdate}</label>
				</div>
				<div style={style.btnArea.style}>
					<Button label="start" secondary={true} />
					<Button label="edit" secondary={true} />
					<Button label="rename" secondary={true} />
					<Button label="delete" secondary={true} />
				</div>
				<div style={style.statisticsArea.style}>
					<div style={style.statisticsArea.selectQuery}>25</div>
					<div style={style.statisticsArea.updateQuery}>25</div>
					<div style={style.statisticsArea.fileWrite}>25</div>
				</div>
			</div>
		);
	}
});


ReactDOM.render(
	<Layout active="script">
		<TotalChartPanel />
		<ScriptsPanel/>
	</Layout>,
	document.getElementById('container')
);