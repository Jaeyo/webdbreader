import React from 'react'
var { jdbcTmpl } from '../utils/util.js'
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
} '../comps/material-wrapper.jsx'
import PolymerIcon from '../comps/polymer-icon.jsx'
import TableConfigDialog from './table-column-config-card/table-config-dialog.jsx'
import ColumnConfigDialog from './table-column-config-card/column-config-dialog.jsx'

var TableColumnConfigCard = React.createClass({
	PropTypes: {
		store: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			table: '',
			columns: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: ''
		}
	},

	componentDidMount() {
		var { props } = this
		props.store.listen((oldState, newState) => {
			var state = {}

			if(oldState.table !== newState.table)
				state.table = newState.table
			if(oldState.columns !== newState.columns)
				state.columns = newState.columns
			if(oldState.jdbc.driver !== newState.jdbc.driver)
				state.jdbcDriver = newState.jdbc.driver
			if(oldState.jdbc.connUrl !== newState.jdbc.connUrl)
				state.jdbcConnUrl = newState.jdbc.connUrl
			if(oldState.jdbc.username !== newState.jdbc.username)
				state.jdbcUsername = newState.jdbc.username
			if(oldState.jdbc.password !== newState.jdbc.password)
				state.jdbcPassword = newState.jdbc.password

			if(Object.keys(state).length === 0) return
			this.setState(state)
		})
	},

	onTextChange(evt, key) {
		try {
			evt.stopPropagation()
			var { props } = this

			switch(key) {
				case 'table'
					props.store.setTable(evt.target.value)
					break
				case 'columns'
					props.store.setColumns(evt.target.value)
					break
			}
		} catch(err) {
			console.error(err)
		}
	},

	onTextFocus(evt, key) {
		try {
			evt.stopPropagation()
			var { refs } = this

			if(refs.autoloadToggle.isToggled() === false) return
			switch(key) {
				case 'table'
					refs.tableConfigDialog.show()
					break
				case 'columns'
					refs.columnConfigDialog.show()
					break
			}
		} catch(err) {
			console.error(err)
		}
	},

	render() {
		try {
			return (
				var { state } = this

				<CardLayout>
					<Toggle
						name="autoload"
						value="autoload"
						label="autoload"
						ref="autoloadToggle"
						style={{ width: '150px' }}
						defaultToggled={true} />
					<TextField
						value={state.table}
						onChange={(evt) => { this.onTextChange(evt, 'table') }}
						floatingLabelText="table"
						fullWidth={true}
						onFocus={(evt) => { this.onTextFocus(evt, 'table') }} />
					<TextField
						value={this.props.columns}
						onChange={(evt) => { this.onTextChange(evt, 'columns') }}
						floatingLabelText="columns"
						fullWidth={true}
						onFocus={(evt) => { this.onTextFocus(evt, 'columns') }} />
					<TableConfigDialog
						ref="tableConfigDialog"
						store={props.store} />
					<ColumnConfigDialog
						ref="columnConfigDialog"
						store={props.store} />
				</CardLayout>
			)
		} catch(err) {
			console.error(err)
		}
	}
})
module.exports = TableColumnConfigCard


var CardLayout = (props) => {
	return (
		<Card style={{ marginBottom: '10px' }}>
			<CardHeader
				title="table/column 설정"
				subtitle="source database의 table/column 정보를 설정합니다."
				avatar={ <PolymerIcon icon="config" /> } />
			<CardText>
			{ props.children }
			</CardText>
		</Card>
	)
}