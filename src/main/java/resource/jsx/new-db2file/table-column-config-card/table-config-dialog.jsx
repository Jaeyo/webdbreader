import React from 'react';
import server from '../../utils/server.js';
import {
	Button,
	TextField,
	SelectField,
	Card,
	CardHeader,
	CardText,
	CircularProgress,
	List,
	ListItem,
	ListDivider,
	Dialog,
	Toggle
} from '../../comps/material-wrapper.jsx';
import PolymerIcon from '../../comps/polymer-icon.jsx';
import AlertDialog from '../../comps/dialog/alert-dialog.jsx';


var TableConfigDialog = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		table: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			visible: false,
			isTablesLoaded: false,
			loadedTables: null
		}
	},

	show() {
		this.setState({ 
			visible: true 
		}, () => {
			this.loadTables();
		});
	},

	hide() {
		this.setState({ visible: false });
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		var { props } = this;

		switch(name) {
		case 'table': 
			props.handleStateChange({ table: evt.target.value });
			break;
		}
	},

	loadTables() {
		var { props, state, refs } = this;

		server.loadTables({
			jdbc: {
				driver: props.jdbcDriver,
				connUrl: props.jdbcConnUrl,
				username: props.jdbcUsername,
				password: props.jdbcPassword
			}
		}).then((tables) => {
			this.setState({
				isTablesLoaded: true,
				loadedTables: tables
			});
		}).catch((err) => {
			this.setState({ isTablesLoaded: true });
			refs.alertDialog.show('danger', err);
		});
	},

	renderTableList() {
		var { props, state } = this;

		if(state.isTablesLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		var isListShouldFilter = (props.table != null && props.table.trim().length  !== 0);

		return (
			<List>
			{
				state
					.loadedTables
					.map((table) => {
						var isDisplay = String.containsIgnoreCase(table, props.table);
						return (
							<ListItem
								key={'loadedTable-' + table}
								primaryText={table}
								onClick={(evt) => {
									evt.stopPropagation();
									props.handleStateChange({ table: table });
								}}
								style={{
									display: isDisplay === true ? 'block' : 'none'
								}} />
						);
					})
			}
			</List> 
		);
	},

	onClose(evt) {
		evt.stopPropagation();
		this.hide();
	},

	render() {
		try {
			return (
				<Dialog
					actions={[
						{ text: 'close', onClick: this.onClose }
					]}
					actionFocus="ok"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<Card>
						<CardHeader
							title="table 설정"
							subtitle="source database의 table 정보를 설정합니다."
							avatar={ <PolymerIcon icon="config" /> } />
						<CardText>
							<TextField
								floatingLabelText="table"
								value={this.props.table} 
								onChange={this.handleChange.bind(this, 'table')}
								fullWidth={true} />
							<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
								{ this.renderTableList() }
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
module.exports = TableConfigDialog;