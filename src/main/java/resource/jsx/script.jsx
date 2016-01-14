var React = require('react');
var server = require('./utils/server.js');
var Glyphicon = require('react-bootstrap').Glyphicon;
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var TotalChartCard = require('./script/total-chart-card.jsx');
var ScriptPanelItem = require('./script/script-panel-item.jsx');
var NewScriptDialog = require('./script/new-script-dialog.jsx');


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
				console.error(err.stack);
			});
	},

	showNewScriptDialog(evt) {
		evt.stopPropagation();
		this.refs.newScriptDialog.show();
	},

	render() {
		try {
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
									<ScriptPanelItem 
										key={script.SCRIPT_NAME}
										title={script.SCRIPT_NAME} 
										isRunning={script.IS_RUNNING} 
										regdate={script.REGDATE} />
								);
							})
						}
						</List>
						<div style={{ padding: '10px', textAlign: 'right' }}>
							<Button 
								label="new script" 
								primary={true} 
								onClick={this.showNewScriptDialog} />
						</div>
					</CardText>
					<NewScriptDialog ref="newScriptDialog" />
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

var ScriptView = React.createClass({
	render() {
		try {
			return (
				<div>	
					<TotalChartCard />
					<ScriptsPanel/>
				</div>	
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ScriptView;