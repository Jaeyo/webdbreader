import _ from 'underscore'
import { jdbcTmpl } from './utils/util.js'

module.exports = {
	state: {
		db: {
			vendor: 'oracle',
			ip: 'localhost',
			port: '1521',
			sid: 'sid_here'
		},
		jdbc: {
			driver: 'oracle.jdbc.driver.OracleDriver',
			connUrl: 'jdbc:oracle:thin:@localhost:1521:sid_here',
			username: '',
			password: ''
		},
		table: '',
		columns: '',
		bindingType: 'simple',
		bindingColumn: '',
		period: '60 * 1000',
		charset: 'utf8',
		delimiter: '|',
		outputPath: ''
	},

	listeners: [],

	listen: function(listener) {
		this.listeners.push(listener)
	},

	unlisten: function(unlistener) {
		this.listeners = this.listeners.filter((listener) => { return listener !== unlistener })
	},

	getState() {
		return this.state
	},

	set: function(stateChangeCallback) {
		var oldState = Object.deepCopy(this.state)
		stateChangeCallback()
		var newState = Object.deepCopy(this.state)

		if(Object.equals(oldState, newState) === true) return;

		this.listeners.forEach((listener) => {
			listener(oldState, newState)
		})
	},

	setDbVendor: function(dbVendor) {
		set(() => {
			this.state.db.vendor = dbVendor
			if(this.state.db.vendor === 'etc') return

			this.state.jdbc.driver = jdbcTmpl[dbVendor].driver
			this.state.db.port = jdbcTmpl[dbVendor].port
			this.state.jdbc.connUrl = jdbcTmpl[dbVendor].connUrl
										.replace('{ip}', this.state.db.ip)
										.replace('{port}', this.state.db.port)
										.replace('{database}', this.state.db.sid)
		})
	},

	setDbIp: function(dbIp) {
		set(() => {
			this.state.db.ip = dbIp
			if(this.state.db.vendor === 'etc') return

			this.state.jdbc.connUrl = jdbcTmpl[this.state.db.vendor].connUrl
										.replace('{ip}', this.state.db.ip)
										.replace('{port}', this.state.db.port)
										.replace('{database}', this.state.db.sid)
		})
	},

	setDbPort: function(dbPort) {
		set(() => {
			this.state.db.port = dbPort
			if(this.state.db.vendor === 'etc') return

			this.state.jdbc.connUrl = jdbcTmpl[this.state.db.vendor].connUrl
										.replace('{ip}', this.state.db.ip)
										.replace('{port}', this.state.db.port)
										.replace('{database}', this.state.db.sid)
		})
	},

	setDbSid: function(dbSid) {
		set(() => {
			this.state.db.sid = dbSid
			if(this.state.db.vendor === 'etc') return

			this.state.jdbc.connUrl = jdbcTmpl[this.state.db.vendor].connUrl
										.replace('{ip}', this.state.db.ip)
										.replace('{port}', this.state.db.port)
										.replace('{database}', this.state.db.sid)
		})
	},

	setTable: function(table) {
		set(() => {
			this.table = table
		})
	},

	setColumns: function(columns) {
		set(() => {
			this.columns = columns.toLowerCase()
		})
	},

	setOutputPath: function(outputPath) {
		set(() => {
			this.outputPath = outoutPath
		})
	}
}