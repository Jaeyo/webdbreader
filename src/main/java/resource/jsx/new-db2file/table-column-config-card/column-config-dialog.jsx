"use strict";

import React from 'react';
import server from '../../utils/server.js';
import MaterialWrapper from '../../comps/material-wrapper.jsx';
import PolymerIcon from '../../comps/polymer-icon.jsx';
import AlertDialog from '../../comps/dialog/alert-dialog.jsx';
var {
	Button,
	FlatButton,
	TextField,
	Card,
	CardHeader,
	CardText,
	CircularProgress,
	List,
	ListItem,
	ListDivider,
	Dialog,
	Toggle
} = MaterialWrapper;


var ColumnConfigDialog = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			visible: false,
			isColumnsLoaded: false,
			loadedColumns: null
		}
	},

	show() {
		var { alertDialog } = this.refs;

		this.setState({ visible: true }, () => {
			try {
				this.loadColumns();
			} catch(err) {
				alertDialog.show('danger', err);
			}
		});
	},

	hide() {
		this.setState({ visible: false });
	},

	handleChange(name, evt) {
		var { props } = this;
		evt.stopPropagation();

		switch(name) {
		case 'column': 
			props.handleStateChange({ columns: evt.target.value });
			break;
		}
	},

	loadColumns() {
		var { props } = this;
		var { alertDialog } = this.refs;

		server.loadColumns({
			jdbc: {
				driver: props.jdbcDriver,
				connUrl: props.jdbcConnUrl,
				username: props.jdbcUsername,
				password: props.jdbcPassword
			},
			table: props.table
		}).then((columns) => {
			this.setState({
				isColumnsLoaded: true,
				loadedColumns: columns
			});
		}).catch((err) => {
			this.setState({ isColumnsLoaded: false });
			alertDialog.show('danger', err);
		});
	},

	onClose(evt) {
		evt.stopPropagation();
		this.hide();
	},

	onSelectAllBtnClick(evt) {
		var { alertDialog } = this.refs;
		var { props, state } = this;

		try {
			evt.stopPropagation();

			var allColumns = state.loadedColumns.map((col) => {
				return col.columnName.toLowerCase();
			}).join(',');

			if(props.columns.toLowerCase() === allColumns) {
				props.handleStateChange({ columns: '' });
			} else {
				props.handleStateChange({ columns: allColumns });
			}
		} catch(err) {
			alertDialog.show('danger', err);
		}
	},

	renderColumnList() {
		var { props, state } = this;

		if(state.isColumnsLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		var selectedColumnsArr = 
			props.columns.split(',')
				.map((s) => { return s.trim(); })
				.filter((s) => { if(s === '') return false; return true; });

		return (
			<List>
			{
				state.loadedColumns.map((column) => {
					var columnName = column.columnName.toLowerCase();
					var columnType = column.columnType;

					var onClick = (evt) => {
						evt.stopPropagation();
						if(Array.contains(selectedColumnsArr, columnName)) {
							selectedColumnsArr.remove(columnName);
						} else {
							selectedColumnsArr.push(columnName);
						}
						props.handleStateChange({ columns: selectedColumnsArr.join(',') })
					};

					return (
						<ListItem
							key={columnName}
							primaryText={columnName}
							secondaryText={columnType}
							onClick={onClick} />
					);
				}.bind(this))
			}
			</List>
		);
	},

	render() {
		try {
			return (
				<Dialog
					actions={[
						{ text: 'close', onClick: this.onClose }
					]}
					actionFocus="close"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<Card>
						<CardHeader
							title="column 설정"
							subtitle="사용할 column 정보를 설정합니다."
							avatar={ <PolymerIcon icon="config" /> } />
						<CardText>
							<TextField
								floatingLabelText="columns"
								value={this.props.columns} 
								onChange={this.handleChange.bind(this, 'columns')}
								fullWidth={true} />
							<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
								{ this.renderColumnList() }
							</div>
							<div style={{ textAlign: 'right' }}>
								<FlatButton
									label="select all"
									onClick={this.onSelectAllBtnClick} />
							</div>
						</CardText>
					</Card>
					<AlertDialog ref="alertDialog" />
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ColumnConfigDialog;