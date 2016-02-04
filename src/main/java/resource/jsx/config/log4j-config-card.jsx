import React from 'react';
import ReactDOM from 'react-dom';
import PolymerIcon from '../comps/polymer-icon.jsx';
import {
	Button,
	Card,
	CardHeader,
	CardText,
	TextField
} from '../comps/material-wrapper.jsx';
import { Table } from 'react-bootstrap';
import SimpleRepoDialog from './simple-repo-card/simple-repo-dialog.jsx';
import AlertDialog from '../comps/dialog/alert-dialog.jsx';
import ConfirmDialog from '../comps/dialog/confirm-dialog.jsx';
import server from '../utils/server.js';
import _ from 'underscore';

var Log4jConfigCard = React.createClass({
	getInitialState() {
		return { threshold: null };
	},

	componentDidMount() {
		var self = this;
		try {
			this.loadLog4jThreshold(function(threshold) {
				self.setState({ threshold: threshold });
			});
		} catch(err) {
			console.error(err.stack);
		}
	},

	loadLog4jThreshold(callback) {
		var self = this;
		server
			.loadLog4jThreshold()
			.then(function(threshold) {
				callback(threshold);
			}).catch(function(err) {
				self.refs.alertDialog.show('danger', err);
			})
	},

	//args: threshold
	updateLog4jThreshold(args) {
		var self = this;
		server
			.updateLog4jThreshold({ threshold: args.threshold })	
			.then(function() {
				self.refs.alertDialog.show('success', '변경되었습니다.');
				self.loadLog4jThreshold(function(threshold) {
					self.setState({ threshold: threshold });
				});
			}).catch(function(err) {
				self.refs.alertDialog.show('danger', err);
			});
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		this.setState({ threshold: evt.target.value });
	},

	onUpdateBtnClick(evt) {
		evt.stopPropagation();
		this.updateLog4jThreshold({ threshold: this.state.threshold });
	},

	render() {
		try {
			return (
				<Card>
					<CardHeader
						title="log4j configuration"
						subtitle="로그 관련 설정을 합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="Threshold"
							value={this.state.threshold}
							onChange={this.handleChange.bind(this, 'threshold')}
							fullWidth={true} />
						<div style={{ textAlign: 'right' }}>
							<Button label="update" onClick={this.onUpdateBtnClick} />
						</div>
						<ConfirmDialog ref="confirmDialog" />
						<AlertDialog ref="alertDialog" />
						<SimpleRepoDialog ref="simpleRepoDialog" />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = Log4jConfigCard;