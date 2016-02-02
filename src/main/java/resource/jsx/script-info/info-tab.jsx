'use strict';

import React from 'react';
import util from 'util';
import moment from 'moment';
import uuid from 'uuid';
import { Glyphicon } from 'react-bootstrap';
import AlertDialog from '../comps/dialog/alert-dialog.jsx';
import server from '../utils/server.js';
import ScriptChartCard from './info-tab/script-chart-card.jsx';
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
	Paper
} from '../comps/material-wrapper.jsx';

moment.locale('ko');

var InfoTab = React.createClass({
	editor: null,
	uuid: uuid.v4(),

	PropTypes: {
		title: React.PropTypes.string.isRequired,
		script: React.PropTypes.string.isRequired
	},

	componentDidMount() {
		this.editor = ace.edit(this.uuid);
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.$blockScrolling = Infinity;
		this.editor.setValue(this.props.script);
	},

	componentDidUpdate(prevProps, prevState) {
		this.editor.setValue(this.props.script);
	},

	edit() {
		var { props, editor, refs } = this;

		server
			.editScript({
				title: props.title,
				script: editor.getValue()
			}).then(() => {
				window.location.reload(true);
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});
	},

	render() {
		var { props } = this;

		try {
			return (
				<Paper style={{ padding: '10px' }}>
					<ScriptChartCard scriptName={props.title} />
					<Card style={{ marginBottom: '10px' }}>
						<CardHeader
							title="code"
							avatar={ <Glyphicon glyph="file" /> } />
						<CardText>
							<div>
								<div id="editor-wrapper" 
									style={{
										position: 'relative',
										minHeight: '400px' 
									}}>
									<div id={this.uuid}
										style={{
											position: 'absolute',
											top: 0,
											bottom: 0,
											right: 0,
											left: 0 }} />
									}
								</div>
								<div style={{ textAlign: 'right', marginTop: '10px' }}>
									<Button
										label="수정"
										primary={true}
										onClick={this.edit} />
								</div>
								<AlertDialog ref="alertDialog" />
							</div>
						</CardText>
					</Card>
				</Paper>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = InfoTab;