import _ from 'underscore'

var store = {
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

	set: function(keyValueArr) {
		var listenersArgs = keyValueArr.map((keyValue) => {
			return {
				key: keyValue.key,
				oldValue: this.state[keyValue.key],
				newValue: keyValue.value
			}
		})

		listenersArgs.forEach((arg) => {
			var newState = {}
			newState[arg.key] = arg.newValue
			this.state = _.extend(this.state, newState)
		})

		this.listeners.forEach((listener) => {
			listener(listenersArgs)
		})
	},

	setColumns: function(columns) {
		set([ { key: 'columns', value: columns } ])
	},

	setDbVendor: function(dbVendor) {
		var args = [ {key: 'db'} ]
		set('dbVendor', )
	}
}