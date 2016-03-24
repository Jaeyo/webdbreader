import React from 'react'
import _ from 'underscore'
import jsUtil '../utils/util.js'
import { color, jdbcTmpl } from jsUtil
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
} from '../comps/material-wrapper.jsx'
import PolymerIcon from '../comps/polymer-icon.jsx'
import DbAddressDialog from './database-config-card/db-address-dialog.jsx'

var DatabaseConfigCard = React.createClass({
	PropTypes: {
		mode: React.PropTypes.string.isRequired,
		store: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return { 
			dbVendor: '',
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

			if(oldState.db.vendor !== newState.db.vendor) 
				state.dbVendor = newState.db.vendor
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

	onDbVendorChange(evt) {
		evt.stopPropagation()
		var { props } = this
		props.store.setDbVendor(evt.target.value)
	},

	onJdbcTextChange(evt, key) {
		//TODO IMME
	},

	render() {
		try {
			var { props, state, refs }= this

			return (
				<CardLayout mode={props.mode}>
					<DbVendorSelectField 
						dbVendor={state.dbVendor}
						onChange={this.onDbVendorChange} />
					<DbAddressDialogBtn onClick={ () => { refs.dbAddressDialog.show() } } />
					<DbAddressDialog
						ref="dbAddressDialog"
						store={props.store} />
					<JdbcTextFields
						jdbcDriver={state.jdbcDriver}
						jdbcConnUrl={state.jdbcConnUrl}
						jdbcUsername={state.jdbcUsername}
						jdbcPassword={state.jdbcPassword}
						onChange={this.onJdbcTextChange} />
				</CardLayout>
			)
		} catch(err) {
			console.error(err)
		}
	}
})
module.exports = DatabaseConfigCard


//props: mode
var CardLayout = (props) => {
	var title, subtitle;

	if(props.mode === 'db2file') {
		title = 'database config'
		subtitle = 'source database 연결 정보를 설정합니다.'
	}

	return (
		<Card style={{ marginBottom: '10px' }}>
			<CardHeader title={title} subtitle={subtitle} avatar={ <PolymerIcon icon="config" /> } />
			<CardText>
			{ props.children }
			</CardText>
		</Card>
	)
}

//props: dbVendor, onChange
var DbVendorSelectField = (props) => {
	return (
		<SelectField
			style={{ float: 'left', marginRight: '10px' }}
			floatingLabelText="데이터베이스"
			value={props.dbVendor}
			menuItems={[
				{ test: 'oracle', payload: 'oracle' },
				{ test: 'mysql', payload: 'mysql' },
				{ test: 'mssql', payload: 'mssql' },
				{ test: 'db2', payload: 'db2' },
				{ test: 'tibero', payload: 'tibero' },
				{ test: 'etc', payload: 'etc' }
			]}
			onChange={props.onChange} />
	)
}

var DbAddressDialogBtn = (props) => {
	return (
		<Button 
			label="설정"
			secondary={true}
			style={{ float: 'left', marginTop: '27px' }}
			onClick={props.onClick} />
	)
}

//props: jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword, onChange
var JdbcTextFields = (props) => {
	return (
		<div style={{
			border: '1px dashed ' + color.lightGray,
			padding: '10px',
			margin: '1px 0' }}>
			<TextField
				inputStyle={{ color: 'black' }}
				floatingLabelText="jdbc driver"
				value={props.jdbcDriver}
				fullWidth={true}
				onChange={(evt) => { props.onChange(evt, 'jdbcDriver') }} />
			<TextField
				inputStyle={{ color: 'black' }}
				floatingLabelText="jdbc connection url"
				value={props.jdbcConnUrl}
				fullWidth={true}
				onChange={(evt) => { props.onChange(evt, 'jdbcConnUrl') }} />
			<TextField
				inputStyle={{ color: 'black' }}
				floatingLabelText="jdbc username"
				value={props.jdbcUsername}
				fullWidth={true}
				onChange={(evt) => { props.onChange(evt, 'jdbcUsername') }} />
			<TextField
				inputStyle={{ color: 'black' }}
				floatingLabelText="jdbc password"
				value={props.jdbcPassword}
				fullWidth={true}
				onChange={(evt) => { props.onChange(evt, 'jdbcPassword') }} />
		</div>
	)
}