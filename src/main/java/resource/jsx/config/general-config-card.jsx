import React from 'react';
import PolymerIcon from '../comps/polymer-icon.jsx';
import {
	Button,
	Card,
	CardHeader,
	CardText,
	Toggle
} from '../comps/material-wrapper.jsx';
import { Table } from 'react-bootstrap';
import SimpleRepoDialog from './simple-repo-card/simple-repo-dialog.jsx';
import AlertDialog from '../comps/dialog/alert-dialog.jsx';
import ConfirmDialog from '../comps/dialog/confirm-dialog.jsx';
import server from '../utils/server.js';

var GeneralConfigCard = React.createClass({
	render() {
		try {
			return (
				<Card>
					<CardHeader
						title="general configuration"
						subtitle="일반 설정"
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<EnableTail />
						<AlertDialog ref="alertDialog" />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = GeneralConfigCard;


var EnableTail = React.createClass({
	getInitialState() {
		return { isTailEnable: true };
	},

	componentDidMount() {
		server
			.isEnableTail()
			.then((isTailEnable) => { 
				this.setState({ isTailEnable: isTailEnable });
			});
	},

	handleToggle(evt, toggle) {
		evt.stopPropagation();

		this.setState({ isTailEnable: toggle });
		server.setEnableTail({ enableTail: toggle });
	},

	render() {
		try {
			var { state, props } = this;
			return (
				<div>
					<Toggle toggled={state.isTailEnable} onToggle={this.handleToggle} />
					<span>tail 기능 on/off</span>
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});