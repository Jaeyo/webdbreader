'use strict';

import React from 'react';
import util from 'util';
import server from '../../../utils/server.js';
import AlertDialog from '../../../comps/dialog/alert-dialog.jsx';
import {
	Row,
	Col
} from 'react-bootstrap';
import {
	RadioButton,
	RadioButtonGroup
} from '../../../comps/material-wrapper.jsx';

var LoadedColumns = React.createClass({
	PropTypes: {
		srcTable: React.PropTypes.string.isRequired,
		srcJdbcDriver: React.PropTypes.string.isRequired,
		srcJdbcConnUrl: React.PropTypes.string.isRequired,
		srcJdbcUsername: React.PropTypes.string.isRequired,
		srcJdbcPassword: React.PropTypes.string.isRequired,

		destTable: React.PropTypes.string.isRequired,
		destJdbcDriver: React.PropTypes.string.isRequired,
		destJdbcConnUrl: React.PropTypes.string.isRequired,
		destJdbcUsername: React.PropTypes.string.isRequired,
		destJdbcPassword: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			loadedSrcColumns: [],
			loadedDestColumns: [],
			selectedSrcColumnName: null,
			selectedDestColumnName: null
		};
	},

	loadColumns() {
		var { props, refs } = this;

		if(props.srcTable == null || 
			props.srcTable.trim().length === 0 ||
			props.destTable == null ||
			props.destTable.trim().length === 0)
			return;

		server
			.loadColumns({
				table: props.srcTable,
				jdbc: {
					driver: props.srcJdbcDriver,
					connUrl: props.srcJdbcConnUrl,
					username: props.srcJdbcUsername,
					password: props.srcJdbcPassword
				}
			}).then((columns) => {
				this.setState({ loadedSrcColumns: columns });
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});

		server
			.loadColumns({
				table: props.destTable,
				jdbc: {
					driver: props.destJdbcDriver,
					connUrl: props.destJdbcConnUrl,
					username: props.destJdbcUsername,
					password: props.destJdbcPassword
				}
			}).then((columns) => {
				this.setState({ loadedDestColumns: columns });
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
			});
	},

	getSelectedColumns() {
		var { state } = this;
		return {
			srcColumn: state.selectedSrcColumnName,
			destColumn: state.selectedDestColumnName
		};
	},

	handleRadioButtonSelected(name, evt) {
		try {
			evt.stopPropagation();
			var state = {};
			state[name] = evt.target.value;
			this.setState(state);
		} catch(err) {
			console.error(err.stack);
		}
	},

	render() {
		try {
			var { props, state } = this;

			if(state.loadedSrcColumns.length === 0 || state.loadedDestColumns.length === 0)
				return null;

			return (
				<Row>
					<Col md={6}>
						<RadioButtonGroup 
							name="srcColumns"
							onChange={this.handleRadioButtonSelected.bind(this, 'selectedSrcColumnName')}>
						{
							state.loadedSrcColumns.map((column) => {
								var { columnName, columnType } = column;
								return (
									<RadioButton
										value={columnName}
										label={ util.format('%s (%s)', columnName, columnType) } />
								);
							})
						}
						</RadioButtonGroup>
					</Col>
					<Col md={6}>
						<RadioButtonGroup 
							name="destColumns"
							onChange={this.handleRadioButtonSelected.bind(this, 'selectedDestColumnName')}>
						{
							state.loadedDestColumns.map((column) => {
								var { columnName, columnType } = column;
								return (
									<RadioButton
										value={columnName}
										label={ util.format('%s (%s)', columnName, columnType) } />
								);
							})
						}
						</RadioButtonGroup>
					</Col>
					<AlertDialog refs="alertDialog" />
				</Row>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = LoadedColumns;