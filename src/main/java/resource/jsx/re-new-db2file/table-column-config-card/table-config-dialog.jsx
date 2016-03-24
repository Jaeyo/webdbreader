import React from 'react'
import server from '../../utils/server.js'
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
} from '../../comps/material-wrapper.jsx'
import PolymerIcon from '../../comps/polymer-icon.jsx'
import AlertDialog from '../../comps/dialog/alert-dialog.jsx'


var TableConfigDialog = React.createClass({
	PropTypes: {
		store: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return { 
			visible: false,
			isTablesLoaded: false,
			loadedTables: null
		}
	},

	show() {
		var { props } = this
		this.setState({
			visible: true
		}, () => {
			this.loadTables()
		})
	},

	hide() {
		this.setState({ visible: false })
	},

	loadTables() {
		var { props, refs } = this
		var storeState = props.store.getState()

		server.loadTables({
			jdbc: storeState.jdbc
		}).then((tables) => {
			this.setState({
				isTablesLoaded: true,
				loadedTables: tables
			})
		}).catch((err) => {
			this.setState({ isTablesLoaded: true })
			refs.alertDialog.show('danger', err)
		})
	},

	renderTableList() {
		var { props, state } = this

		if(state.isTablesLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />)

		var isListShouldFilter = (props.table != null && props.table.trim().length  !== 0)

		return (
			<List>
			{
				state
					.loadedTables
					.map((table) => {
						var isDisplay = String.containsIgnoreCase(table, props.table)
						return (
							<ListItem
								key={'loadedTable-' + table}
								primaryText={table}
								onClick={(evt) => {
									evt.stopPropagation()
									props.store.setTable(table)
								}}
								style={{
									display: isDisplay === true ? 'block' : 'none'
								}} />
						)
					})
			}
			</List> 
		)
	},

	render() {
		try {
			return (
				//TODO IMME
			)
		} catch(err) {
			console.error(err)
		}
	}
})
module.exports = TableConfigDialog