import React from 'react'
import store from './re-new-db2file/store.js'
import server from './utils/server.js'
import DatabaseConfigCard from './re-new-db2file/database-config-card.jsx'
import TableColumnConfigCard from './re-new-db2file/table-column-config-card.jsx'

var NewDb2FileView = React.createClass({
	componentDidMount() {
		var { refs } = this

		server.getHomePath()
		.then((homepath) => {
			homepath = homepath.split('\\').join('\\\\')
			store.setOutputPath(homepath)
		})
		.catch((err) => {
			refs.alertDialog.show('danger', err)
		})
	},

	showScriptDialog(evt) {
		var { refs } = this
		var state = store.getState()

		try {
			if(String.isEmpty(state.jdbc.driver) ||
				String.isEmpty(state.jdbc.connUrl) ||
				String.isEmpty(state.jdbc.username) ||
				String.isEmpty(state.jdbc.password)) throw 'jdbc 정보 미입력'
			if(String.isEmpty(state.jdbc.table)) throw 'table 정보 미입력'
			if(String.isEmpty(state.jdbc.columns)) throw 'column 정보 미입력'
			if(String.isEmpty(state.jdbc.bindingType)) throw 'bindingType 정보 미입력'
			if(data.bindingType !== 'simple' && String.isEmpty(state.bindingColumn)) throw 'bindingColumn 정보 미입력'
			if(String.isEmpty(state.period)) throw 'period 정보 미입력'
			if(String.isEmpty(state.charset)) throw 'charset 정보 미입력'
			if(String.isEmpty(state.delimiter)) throw 'delimiter 정보 미입력'
			if(String.isEmpty(state.outputPath)) throw 'outputPath 정보 미입력'
		} catch(errmsg) {
			refs.alertDialog.show('danger', errmsg)
			return
		}

		if(String.endsWith(state.outputPath, '/') === false && String.endsWith(state.outputPath, '\\') === false)
			state.outputPath += '/'

		server.generateDb2FileScript({
			period: state.period,
			dbVendor: state.db.vendor,
			dbIp: state.db.ip,
			dbPort: state.db.port,
			dbSid: state.db.sid,
			jdbcDriver: state.jdbc.driver,
			jdbcConnUrl: state.jdbc.connUrl,
			jdbcUsername: state.jdbc.username,
			jdbcPassword: state.jdbc.password,
			columns: state.columns,
			table: state.table,
			bindingType: state.bindingType,
			bindingColumn: state.bindingColumn,
			delimiter: state.delimiter,
			charset: state.charset,
			outputPath: state.outputPath
		})
		.then((script) => {
			refs.scriptDialog.show({
				scriptName: '',
				script: script,
				onActionCallback: (result, scriptName, script) => {
					if(result === false) {
						refs.scriptDialog.hide()
						return
					}

					if(scriptName == null || scriptName.trim().length === 0) {
						refs.alertDialog.show('danger', '스크립트 이름 미입력')
						return
					}

					server.postScript({ title: scriptName, script: script })
						.then((success) => {
							refs.scriptDialog.hide()
							refs.alertDialog.show('success', 'script registered')
						})
						.catch((err) => {
							refs.alertDialog.show('danger', err)
						})
				}
			})
		})
		.catch((err) => {
			refs.alertDialog.show('danger', err);
		})

	},

	render() {
		try {
			return (
				<DatabaseConfigCard 
					mode="db2file"
					store={store} />
				<TableColumnConfigCard 
					store={store} />
				//TODO IMME
			)
		} catch(err) {
			console.error(err.stack)
		}
	}
})
module.exports = NewDb2FileView