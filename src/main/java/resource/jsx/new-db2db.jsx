import React from 'react';
import _ from 'underscore';
import {
	jdbcTmpl
} from './utils/util.js';
import DatabaseConfigCard from './new-db2file/database-config-card.jsx';
import TableColumnsMappingCard from './new-db2db/table-columns-mapping-card.jsx';
import BindingTypeCard from './new-db2file/binding-type-card.jsx';
import EtcConfigCard from './new-db2db/etc-config-card.jsx';
import {
	Button
} from './comps/material-wrapper.jsx';
import ScriptDialog from './comps/dialog/script-dialog.jsx';
import AlertDialog from './comps/dialog/alert-dialog.jsx';
import precondition from './utils/precondition.js';
import server from './utils/server.js';


var NewDb2DbView = React.createClass({
	getInitialState() {
		return {
			srcDbVendor: 'oracle',
			srcDbIp: '192.168.10.101',
			srcDbPort: '1521',
			srcDbSid: 'spiderx',
			srcJdbcDriver: 'oracle.jdbc.driver.OracleDriver',
			srcJdbcConnUrl: 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx',
			srcJdbcUsername: 'admin_test',
			srcJdbcPassword: 'admin_test',
			srcTable: 'AGENT_INFO_LIST',
			srcColumns: 'col1,col2',
			destDbVendor: 'oracle',
			destDbIp: '192.168.10.101',
			destDbPort: '1521',
			destDbSid: 'spiderx',
			destJdbcDriver: 'oracle.jdbc.driver.OracleDriver',
			destJdbcConnUrl: 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx',
			destJdbcUsername: 'admin_test',
			destJdbcPassword: 'admin_test',
			destTable: 'AGENT_INFO_LIST',
			destColumns: 'col1,col2',
			bindingType: 'simple',
			srcBindingColumn: '',
			period: '60 * 1000',
			deleteAllBeforeInsert: 'false'
		};
	},

	handleStateChange(state) {
		this.setState(state);
	},

	handleSrcDbStateChange(state) {
		if(state.jdbcDriver) Object.renameProperty(state, 'jdbcDriver', 'srcJdbcDriver');
		if(state.jdbcConnUrl) Object.renameProperty(state, 'jdbcConnUrl', 'srcJdbcConnUrl');
		if(state.jdbcUsername) Object.renameProperty(state, 'jdbcUsername', 'srcJdbcUsername');
		if(state.jdbcPassword) Object.renameProperty(state, 'jdbcPassword', 'srcJdbcPassword');

		if(state.dbVendor) {
			Object.renameProperty(state, 'dbVendor', 'srcDbVendor');
			if(state.srcDbVendor != 'etc') {
				state.srcJdbcDriver = jdbcTmpl[state.srcDbVendor].driver;
				state.srcDbPort = jdbcTmpl[state.srcDbVendor].port;
				state.srcJdbcConnUrl = jdbcTmpl[state.srcDbVendor].connUrl
											.replace('{ip}', this.state.srcDbIp)
											.replace('{port}', state.srcDbPort)
											.replace('{database}', this.state.srcDbSid);
			}
		}
		if(state.dbIp) {
			Object.renameProperty(state, 'dbIp', 'srcDbIp');
			if(this.state.srcDbVendor != 'etc') {
				state.srcJdbcConnUrl = jdbcTmpl[this.state.srcDbVendor].connUrl
											.replace('{ip}', state.srcDbIp)
											.replace('{port}', this.state.srcDbPort)
											.replace('{database}', this.state.srcDbSid);
			}
		}
		if(state.dbPort) {
			Object.renameProperty(state, 'dbPort', 'srcDbPort');
			if(this.state.srcDbVendor != 'etc') {
				state.srcJdbcConnUrl = jdbcTmpl[this.state.srcDbVendor].connUrl
											.replace('{ip}', this.state.srcDbIp)
											.replace('{port}', state.srcDbPort)
											.replace('{database}', this.state.srcDbSid);
			}
		}
		if(state.dbSid) {
			Object.renameProperty(state, 'dbSid', 'srcDbSid');
			if(this.state.srcDbVendor != 'etc') {
				state.srcJdbcConnUrl = jdbcTmpl[this.state.srcDbVendor].connUrl
											.replace('{ip}', this.state.srcDbIp)
											.replace('{port}', this.state.srcDbPort)
											.replace('{database}', state.srcDbSid);
			}
		}

		this.setState(state);
	},

	handleDestDbStateChange(state) {
		if(state.jdbcDriver) Object.renameProperty(state, 'jdbcDriver', 'destJdbcDriver');
		if(state.jdbcConnUrl) Object.renameProperty(state, 'jdbcConnUrl', 'destJdbcConnUrl');
		if(state.jdbcUsername) Object.renameProperty(state, 'jdbcUsername', 'destJdbcUsername');
		if(state.jdbcPassword) Object.renameProperty(state, 'jdbcPassword', 'destJdbcPassword');

		if(state.dbVendor) {
			Object.renameProperty(state, 'dbVendor', 'destDbVendor');
			if(state.destDbVendor != 'etc') {
				state.destJdbcDriver = jdbcTmpl[state.destDbVendor].driver;
				state.destDbPort = jdbcTmpl[state.destDbVendor].port;
				state.destJdbcConnUrl = jdbcTmpl[state.destDbVendor].connUrl
											.replace('{ip}', this.state.destDbIp)
											.replace('{port}', state.destDbPort)
											.replace('{database}', this.state.destDbSid);
			}
		}
		if(state.dbIp) {
			Object.renameProperty(state, 'dbIp', 'destDbIp');
			if(this.state.destDbVendor != 'etc') {
				state.destJdbcConnUrl = jdbcTmpl[this.state.destDbVendor].connUrl
											.replace('{ip}', state.destDbIp)
											.replace('{port}', this.state.destDbPort)
											.replace('{database}', this.state.destDbSid);
			}
		}
		if(state.dbPort) {
			Object.renameProperty(state, 'dbPort', 'destDbPort');
			if(this.state.destDbVendor != 'etc') {
				state.destJdbcConnUrl = jdbcTmpl[this.state.destDbVendor].connUrl
											.replace('{ip}', this.state.destDbIp)
											.replace('{port}', state.destDbPort)
											.replace('{database}', this.state.destDbSid);
			}
		}
		if(state.dbSid) {
			Object.renameProperty(state, 'dbSid', 'destDbSid');
			if(this.state.destDbVendor != 'etc') {
				state.destJdbcConnUrl = jdbcTmpl[this.state.destDbVendor].connUrl
											.replace('{ip}', this.state.destDbIp)
											.replace('{port}', this.state.destDbPort)
											.replace('{database}', state.destDbSid);
			}
		}

		this.setState(state);
	},

	showScriptDialog(evt) {
		try {
			evt.stopPropagation();

			var { refs, state } = this;

			precondition
				.instance(this.state)
				.stringNotByEmpty([ 'srcDbVendor', 'srcDbIp', 'srcDbPort', 'srcDbSid' ], 'src db 정보 미입력')
				.stringNotByEmpty([ 'destDbVendor', 'destDbIp', 'destDbPort', 'destDbSid' ], 'dest db 정보 미입력')
				.stringNotByEmpty([ 'srcJdbcDriver', 'srcJdbcConnUrl', 'srcJdbcUsername', 'srcJdbcPassword' ], 'src jdbc 연결 정보 미입력')
				.stringNotByEmpty([ 'destJdbcDriver', 'destJdbcConnUrl', 'destJdbcUsername', 'destJdbcPassword' ], 'dest jdbc 연결 정보 미입력')
				.stringNotByEmpty('srcTable', 'src table 정보 미입력')
				.stringNotByEmpty('destTable', 'dest table 정보 미입력')
				.stringNotByEmpty('srcColumns', 'src columns 정보 미입력')
				.stringNotByEmpty('destColumns', 'dest columns 정보 미입력')
				.stringNotByEmpty('bindingType', 'binding type 정보 미입력')
				.check(function(data) {
					if(data.bindingType !== 'simple')
						return ( data.srcBindingColumn != null && data.srcBindingColumn.trim().length !== 0);
					return true;
				}, 'binding column 정보 미입력')
				.stringNotByEmpty('period', 'period 정보 미입력')
		} catch(errmsg) {
			this.refs.alertDialog.show('danger', errmsg);
			return;
		}

		server.generateDb2DbScript({
			srcDbVendor: state.srcDbVendor,
			srcDbIp: state.srcDbIp,
			srcDbPort: state.srcDbPort,
			srcDbSid: state.srcDbSid,
			srcJdbcDriver: state.srcJdbcDriver,
			srcJdbcConnUrl: state.srcJdbcConnUrl,
			srcJdbcUsername: state.srcJdbcUsername,
			srcJdbcPassword: state.srcJdbcPassword,
			srcTable: state.srcTable,
			srcColumns: state.srcColumns,
			destDbVendor: state.destDbVendor,
			destDbIp: state.destDbIp,
			destDbPort: state.destDbPort,
			destDbSid: state.destDbSid,
			destJdbcDriver: state.destJdbcDriver,
			destJdbcConnUrl: state.destJdbcConnUrl,
			destJdbcUsername: state.destJdbcUsername,
			destJdbcPassword: state.destJdbcPassword,
			destTable: state.destTable,
			destColumns: state.destColumns,
			bindingType: state.bindingType,
			srcBindingColumn: state.srcBindingColumn,
			period: state.period,
			deleteAllBeforeInsert: state.deleteAllBeforeInsert
		}).then((script) => {
			refs.scriptDialog.show({
				scriptName: '',
				script: script,
				onActionCallback: ((result, scriptName, script) => {
					if(result === false) {
						refs.scriptDialog.hide();
						return;
					}

					if(scriptName == null || scriptName.trim().length === 0) {
						refs.alertDialog.show('danger', '스크립트 이름 미입력');
						return;
					}

					server
						.postScript({ title: scriptName, script: script })
						.then((success) => {
							refs.scriptDialog.hide();
							refs.alertDialog.show('success', 'script registered');
						}).catch((err) => {
							refs.alertDialog.show('danger', err);
						});
				})
			});
		}).catch((err) => {
			refs.alertDialog.show('danger', err);
		});
	},

	render() {
		try {
			var { state } = this;
			var childProps = _.extend({}, state, {
				handleStateChange: this.handleStateChange,
				handleSrcDbStateChange: this.handleSrcDbStateChange,
				handleDestDbStateChange: this.handleDestDbStateChange
			});

			return (
				<div>
					<SrcDatabaseConfigCardWithProps {...childProps} />
					<DestDatabaseConfigCardWithProps {...childProps} />
					<TableColumnsMappingCardWithProps {...childProps} />
					<BindingTypeCardWithProps {...childProps} />
					<EtcConfigCardWithProps {...childProps} />
					<Button
						label="생성"
						primary={true}
						onClick={this.showScriptDialog} />
					<ScriptDialog ref="scriptDialog" />
					<AlertDialog ref="alertDialog" />
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = NewDb2DbView;


var SrcDatabaseConfigCardWithProps = (props) => {
	return (
		<DatabaseConfigCard
			jdbcDriver={props.srcJdbcDriver}
			jdbcConnUrl={props.srcJdbcConnUrl}
			jdbcUsername={props.srcJdbcUsername}
			jdbcPassword={props.srcJdbcPassword}
			dbVendor={props.srcDbVendor}
			dbIp={props.srcDbIp}
			dbPort={props.srcDbPort}
			dbSid={props.srcDbSid}
			title="source database 설정"
			subtitle="source database의 연결정보를 설정합니다."
			handleStateChange={props.handleSrcDbStateChange} />
	);
};

var DestDatabaseConfigCardWithProps = (props) => {
	return (
		<DatabaseConfigCard
			jdbcDriver={props.destJdbcDriver}
			jdbcConnUrl={props.destJdbcConnUrl}
			jdbcUsername={props.destJdbcUsername}
			jdbcPassword={props.destJdbcPassword}
			dbVendor={props.destDbVendor}
			dbIp={props.destDbIp}
			dbPort={props.destDbPort}
			dbSid={props.destDbSid}
			title="destination database 설정"
			subtitle="destination database의 연결정보를 설정합니다."
			handleStateChange={props.handleDestDbStateChange} />
	);
};

var TableColumnsMappingCardWithProps = (props) => {
	return (
		<TableColumnsMappingCard
			srcJdbcDriver={props.srcJdbcDriver}
			srcJdbcConnUrl={props.srcJdbcConnUrl}
			srcJdbcUsername={props.srcJdbcUsername}
			srcJdbcPassword={props.srcJdbcPassword}
			destJdbcDriver={props.destJdbcDriver}
			destJdbcConnUrl={props.destJdbcConnUrl}
			destJdbcUsername={props.destJdbcUsername}
			destJdbcPassword={props.destJdbcPassword}
			srcTable={props.srcTable}
			destTable={props.destTable}
			srcColumns={props.srcColumns}
			destColumns={props.destColumns}
			handleStateChange={props.handleStateChange} />
	);
};

var BindingTypeCardWithProps = (props) => {
	var handleStateChange = function(state) {
		if(state.bindingColumn)
			Object.renameProperty(state, 'bindingColumn', 'srcBindingColumn');
		if(state.bindingType) {
			if(state.bindingType === 'simple') {
				state.srcBindingColumn = '';
			} else {
				state.deleteAllBeforeInsert = 'false';
			}
		}
		props.handleStateChange(state);
	};

	return (
		<BindingTypeCard
			jdbcDriver={props.srcJdbcDriver}
			jdbcConnUrl={props.srcJdbcConnUrl}
			jdbcUsername={props.srcJdbcUsername}
			jdbcPassword={props.srcJdbcPassword}
			handleStateChange={handleStateChange}
			table={props.srcTable}
			bindingType={props.bindingType}
			bindingColumn={props.srcBindingColumn} />
	);
};

var EtcConfigCardWithProps = (props) => {
	return (
		<EtcConfigCard
			handleStateChange={props.handleStateChange}
			deleteAllBeforeInsert={props.deleteAllBeforeInsert}
			bindingType={props.bindingType}
			period={props.period} />
	);
};