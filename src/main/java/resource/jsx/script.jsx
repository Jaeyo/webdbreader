import React from 'react';
import server from './utils/server.js';
import { Glyphicon } from 'react-bootstrap';
import {
	Button,
	Card,
	CardHeader,
	CardText,
	List,
	ListItem
} from './comps/material-wrapper.jsx';
import TotalChartCard from './script/total-chart-card.jsx';
import ScriptPanelItem from './script/script-panel-item.jsx';
import NewScriptDialog from './script/new-script-dialog.jsx';


var ScriptsPanel = React.createClass({
	getInitialState() {
		return { scripts: [] };
	},

	componentDidMount() {
		server
			.loadScripts()
			.then((scripts) => {
				this.setState({ scripts: scripts });
			}).catch((err) => {
				console.error(err.stack);
			});
	},

	showNewScriptDialog(evt) {
		var { refs } = this;
		evt.stopPropagation();
		refs.newScriptDialog.show();
	},

	render() {
		try {
			var { state } = this;

			return (
				<Card style={{ marginBottom: '10px', overflow: 'inherit' }}>
					<CardHeader
						title="scripts"
						subtitle="등록된 스크립트들을 제어합니다."
						avatar={ <Glyphicon glyph="console" /> } />
					<CardText>
						<List>
						{
							state.scripts.length === 0 ? 
							(<ListItem primaryText="no data" />) : 
							state.scripts.map(function(script) {
								return (
									<ScriptPanelItem 
										key={script.SCRIPT_NAME}
										title={script.SCRIPT_NAME} 
										isRunning={script.IS_RUNNING} 
										regdate={script.REGDATE} />
								)
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