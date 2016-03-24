import React from 'react'
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

var DbAddressDialog = React.createClass({
	PropTypes: {
		store: React.PropTypes.object.isRequired
	},

	getInitialState() {
	    return { 
	    	visible: false,
	    	dbIp: '',
	    	dbPort: '',
	    	dbSid: ''
	    }
	},

	componentDidMount() {
		var { props } = this
		props.store.listen((oldState, newState) => {
			var state = {}

			if(oldState.db.ip !== newState.db.ip)
				state.dbIp = newState.db.ip
			if(oldState.db.port !== newState.db.port)
				state.dbPort = newState.db.port
			if(oldState.db.sid !== newState.db.sid)
				state.dbSid = newState.db.sid

			if(Object.keys(state).length !== 0)
				this.setState(state)
		})
	},

	show() {
		var { props } = this
		var storeState = props.store.getState()
		this.setState({
			visible: true,
			dbIp: storeState.db.ip,
			dbPort: storeState.db.port,
			dbSid: storeState.db.sid
		})
	},

	hide() {
		this.setState({ visible: false })
	},

	onDbTextKeyUp(evt) {
		evt.stopPropagation()
		if(evt.keyCode === 13) this.hide()
	},
	
	onDbTextChange(evt, key) {
		evt.stopPropagation()

		switch(key) {
			case 'dbIp':
				props.store.setDbIp(evt.target.value)
				break
			case 'dbPort':
				props.store.setDbPort(evt.target.value)
				break
			case 'dbSid':
				props.store.setDbSid(evt.target.value)
				break
		}
	},

	render() {
		try {
			var { state } = this

			return (
				<DialogLayout hide={this.hide} visible={state.visible}>
					<DbTextField
						label="database ip" 
						value={state.dbIp} 
						onChange={(evt) => { this.onDbTextChange(evt, 'dbIp') }}
						onKeyUp={this.onDbTextKeyUp} />
					<DbTextField
						label="port" 
						value={state.dbPort} 
						onChange={(evt) => { this.onDbTextChange(evt, 'dbPort') }}
						onKeyUp={this.onDbTextKeyUp} />
					<DbTextField
						label="sid" 
						value={state.dbSid} 
						onChange={(evt) => { this.onDbTextChange(evt, 'dbSid') }}
						onKeyUp={this.onDbTextKeyUp} />
				</DialogLayout>
			)
		} catch(err) {
			console.error(err)
		}
	}
})
module.exports = DbAddressDialog


//props: hide, visible
var DialogLayout = (props) => {
	return (
		<Dialog
			titie="database address config"
			actions={[
				{ text: 'ok', onClick: props.hide }
			]}
			actionFocus="ok"
			autoDetectWindowHeight={true}
			autoScrollBodyContent={true}
			open={props.visible}>
			{ props.children }
		</Dialog>
	)
}

//props: label, value, onChange, onKeyup
var DbTextField = (props) => {
	return (
		<TextField
			style={{ width: '170px', marginRight: '3px' }}
			inputStyle={{ textAlign: 'center' }}
			floatingLabelText={props.label}
			value={props.value}
			onChange={props.onChange}
			onKeyUp={props.onKeyUp} />
	)
}