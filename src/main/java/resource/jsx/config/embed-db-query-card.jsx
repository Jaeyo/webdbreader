'use strict';

import React from 'react';
import AlertDialog from '../comps/dialog/alert-dialog.jsx';
import server from '../utils/server.js';
import PolymerIcon from '../comps/polymer-icon.jsx';
import {
	Button,
	Card,
	CardHeader,
	CardText,
	TextField
} from '../comps/material-wrapper.jsx';

var EmbedDbQueryCard = React.createClass({
	getInitialState() {
		return {
			query: ''
		};
	},

	handleChange(name, evt) {
		try {
			evt.stopPropagation();
			var state = {};
			state[name] = evt.target.value;
			this.setState(state);
		} catch(err) {
			console.error(err.stack);
		}
	},

	onRunQueryBtnClick(evt) {
		var { state, refs } = this;

		try {
			if(state.query == null || state.query.length === 0) {
				refs.alertDialog.show('danger', 'query is null');
				return;
			}

			evt.stopPropagation();
			server
				.embedDbQuery({
					query: state.query
				}).then((rows) => {
					var result = JSON.stringify(rows);
					refs.alertDialog.show('success', result);
				}).catch((err) => {
					refs.alertDialog.show('danger', err);
				});
		} catch(err) {
			console.error(err.stack);
		}
	},

	render() {
		var { state } = this;
		try {
			return (
				<Card>
					<CardHeader
						title="embed db"
						subtitle="embed db에서 sql을 실행할 수 있는 인터페이스를 제공합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							fullWidth={true}
							floatingLabelText="query"
							value={state.query}
							onChange={this.handleChange.bind(this, 'query')} />
						<div style={{ textAlign: 'right' }}>
							<Button
								label="run query"
								onClick={this.onRunQueryBtnClick} />
						</div>
						<AlertDialog ref="alertDialog" />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = EmbedDbQueryCard;