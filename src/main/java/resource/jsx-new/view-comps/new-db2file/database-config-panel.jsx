var React = require('react'),
	ReactDOM = require('react-dom'),
	ReactGateway = require('react-gateway'),
	_ = require('underscore'),
	util = require('util'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	server = require('../../utils/server.js'),
	LayerPopup = require('../../comps/layer-popup.jsx'),
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	ColumnSelectTable = require('./column-select-table.jsx').ColumnSelectTable,
	PolymerIcon = require('../../comps/polymer-icon.jsx'),
	MaterialWrapper = require('../../comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button,
	TextField = MaterialWrapper.TextField,
	SelectField = MaterialWrapper.SelectField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText,
	CircularProgress = MaterialWrapper.CircularProgress,
	List = MaterialWrapper.List,
	ListItem = MaterialWrapper.ListItem,
	ListDivider = MaterialWrapper.ListDivider,
	Dialog = MaterialWrapper.Dialog;

var jdbcTmpl = {
	oracle: {
		driver: 'oracle.jdbc.driver.OracleDriver',
		connUrl: 'jdbc:oracle:thin:@{ip}:{port}:{database}',
		port: 1521
	},
	mysql: {
		driver: 'com.mysql.jdbc.Driver',
		connUrl: 'jdbc:mysql://{ip}:{port}/{database}',
		port: 3306
	},
	mssql: {
		driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
		connUrl: 'jdbc:sqlserver://{ip}:{port};databaseName={database}',
		port: 1433
	},
	db2: {
		driver: 'com.ibm.db2.jcc.DB2Driver',
		connUrl: 'jdbc:db2://{ip}:{port}/{database}',
		port: 50000
	},
	tibero: {
		driver: 'com.ibm.db2.jcc.DB2Driver',
		connUrl: 'jdbc:db2://{ip}:{port}/{database}',
		port: 8629
	}
};


var DatabaseConfigPanel = React.createClass({
	PropTypes: {
		dbVendor: React.PropTypes.string.isRequired,
		dbIp: React.PropTypes.string.isRequired,
		dbPort: React.PropTypes.string.isRequired,
		dbSid: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			isDatabaseConfigModalVisible: false,
			isTableConfigDialogVisible: false,
			isColumnConfigDialogVisible: false
		};
	},

	toggleDbConfigModal(evt) {
		this.setState({ isDatabaseConfigModalVisible: !this.state.isDatabaseConfigModalVisible });
	},

	toggleTableConfigDialog(evt) {
		this.setState({ isTableConfigDialogVisible: !this.state.isTableConfigDialogVisible });
	},

	toggleColumnConfigDialog(evt) {
		this.setState({ isColumnConfigDialogVisible: !this.state.isColumnConfigDialogVisible });
	},

	onTableConfigAction(action) {
		if(action === 'ok') {
			this.setState({
				isTableConfigDialogVisible: false,
				isColumnConfigDialogVisible: true
			});
		} else {
			this.setState({
				isTableConfigDialogVisible: false
			});
		}
	},

	onDbConfigIpChange(evt) {
		var state = { dbIp: evt.target.value };
		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', state.dbIp)
								.replace('{port}', this.props.dbPort)
								.replace('{database}', this.props.dbSid);
		}
		this.props.onChange(state);
	},

	onDbConfigPortChange(evt) {
		var state = { dbPort: evt.target.value };
		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
								.replace('{port}', state.dbPort)
								.replace('{database}', this.props.dbSid);
		}
		this.props.onChange(state);
	},

	onDbConfigSidChange(evt) {
		var state = { dbSid : evt.target.value };
		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
								.replace('{port}', this.props.dbPort)
								.replace('{database}', state.dbSid);
		}
		this.props.onChange(state);
	},

	onDbConfigKeyUp(evt) {
		if(evt.keyCode === 13) this.props.hide();
	},

	onDbVendorChange(evt) {
		var state = { dbVendor: evt.target.value };

		if(state.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[state.dbVendor];
			state.jdbcDriver = tmpl.driver;
			state.dbPort = tmpl.port;
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
											.replace('{port}', state.dbPort)
											.replace('{database}', this.props.dbSid);
		}

		this.props.onChange(state);
	},

	onJdbcDriverChanged(evt) {
		this.props.onChange({ jdbcDriver: evt.target.value });
	},

	onJdbcConnUrlChanged(evt) {
		this.props.onChange({ jdbcConnUrl: evt.target.value });
	},

	onJdbcUsernameChanged(evt) {
		this.props.onChange({ jdbcUsername: evt.target.value });
	},

	onJdbcPasswordChanged(evt) {
		this.props.onChange({ jdbcPassword: evt.target.value });
	},

	onTableChange(table) {
		this.props.onChange({ table: table });
	},

	onColumnChange(columns) {
		this.props.onChange({ columns: columns });
	},
	
	styles() {
		return {
			card: {
				marginBottom: '10px'
			},
			textfieldInputStyle: {
				color: 'black'
			},
			jdbcConfig: {
				dbVendorSelectBox: {
					float: 'left',
					marginRight: '10px'
				},
				configBtn: {
					float: 'left',
					marginTop: '27px'
				},
				jdbcBorder: {
					border: '1px dashed ' + color.lightGray,
					padding: '10px',
					margin: '10px 0'
				},
				dbConfigModal: {
					dbIpTextBox: {
						width: '170px',
						marginRight: '3px'
					},
					dbPortTextBox: {
						width: '60px',
						marginRight: '3px'
					},
					dbSidTextBox: {
						width: '120px',
						marginRight: '3px'
					},
				}
			}
		};
	},

	render() {
		var style = this.styles();
		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		return (
			<div>
				<Card style={style.card}>
					<CardHeader
						title="jdbc 설정"
						subtitle="source database의 연결 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<SelectField
							style={style.jdbcConfig.dbVendorSelectBox}
							floatingLabelText="데이터베이스"
							value={this.props.dbVendor}
							menuItems={[
								{ text: 'oracle', payload: 'oracle' },
								{ text: 'mysql', payload: 'mysql' },
								{ text: 'mssql', payload: 'mssql' },
								{ text: 'db2', payload: 'db2' },
								{ text: 'tibero', payload: 'tibero' },
								{ text: 'etc', payload: 'etc' }
							]}
							onChange={this.onDbVendorChange} />
						<Button 
							label="설정" 
							secondary={true} 
							style={style.jdbcConfig.configBtn}
							onClick={this.toggleDbConfigModal} />
						<Clearfix />
						<Dialog
							title="database config"
							actions={[
								{ text: 'ok', onClick: this.toggleDbConfigModal }
							]}
							actionFocus="ok"
							open={this.state.isDatabaseConfigModalVisible}>
							<TextField
								style={style.jdbcConfig.dbConfigModal.dbIpTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="database ip"
								value={this.props.dbIp}
								onChange={this.onDbConfigIpChange}
								onKeyUp={this.onDbConfigKeyUp} />
							<TextField
								style={style.jdbcConfig.dbConfigModal.dbPortTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="port"
								value={this.props.dbPort}
								onChange={this.onDbConfigPortChange}
								onKeyUp={this.onDbConfigKeyUp} />
							<TextField
								style={style.jdbcConfig.dbConfigModal.dbSidTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="sid"
								value={this.props.dbSid}
								onChange={this.onDbConfigSidChange}
								onKeyUp={this.onDbConfigKeyUp} />
						</Dialog>
						<div style={style.jdbcConfig.jdbcBorder}>
							<TextField
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc driver"
								value={this.props.jdbcDriver}
								fullWidth={true}
								onChange={this.onJdbcDriverChanged} />
							<TextField
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc connection url"
								value={this.props.jdbcConnUrl}
								fullWidth={true}
								onChange={this.onJdbcConnUrlChanged} />
							<TextField
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc username"
								value={this.props.jdbcUsername}
								fullWidth={true}
								onChange={this.onJdbcUsernameChanged} />
							<TextField
								type="password"
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc password"
								value={this.props.jdbcPassword}
								fullWidth={true}
								onChange={this.onJdbcPasswordChanged} />
						</div>
					</CardText>
				</Card>
				<Card style={style.card}>
					<CardHeader
						title="table/column 설정"
						subtitle="source database의 table/column 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							value={this.props.table}
							disabled={true}
							floatingLabelText="tables"
							inputStyle={style.textfieldInputStyle}
							fullWidth={true}
							onClick={this.toggleTableConfigDialog} />
						<TextField
							value={this.props.columns}
							disabled={true}
							floatingLabelText="columns"
							inputStyle={style.textfieldInputStyle}
							fullWidth={true}
							onClick={this.toggleColumnConfigDialog} />
						<TableConfigDialog
							visible={this.state.isTableConfigDialogVisible}
							table={this.props.table}
							onTableChange={this.onTableChange}
							onAction={this.onTableConfigAction}
							jdbc={jdbc} />
						<ColumnConfigDialog
							visible={this.state.isColumnConfigDialogVisible}
							onClose={this.toggleColumnConfigDialog}
							table={this.props.table}
							columns={this.props.columns}
							onColumnsChange={this.onColumnChange}
							jdbc={jdbc} />
					</CardText>
				</Card>
			</div>
		);
	}
});


var TableConfigDialog = React.createClass({
	PropTypes: {
		visible: React.PropTypes.bool.isRequired,
		table: React.PropTypes.string.isRequired,
		onTableChange: React.PropTypes.func.isRequired,
		onAction: React.PropTypes.func.isRequired,
		jdbc: React.PropTypes.object.isRequired,
	},

	getDefaultProps() {
		return { visible: false };
	},

	getInitialState() {
		return {
			isTablesLoaded: false,
			loadedTables: null
		}
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.visible === false && this.props.visible === true)
			this.loadTables();
	},

	onOk() {
		this.props.onAction('ok');
	},

	onCancel() {
		this.props.onAction('cancel');
	},

	onTableTextFieldChange(evt) {
		this.props.onTableChange(evt.target.value);
	},

	loadTables() {
		server.loadTables(this.props.jdbc)
		.then(function(tables) {
			this.setState({
				isTablesLoaded: true,
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			console.error(err.stack);
			this.setState({ isTablesLoaded: true });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
	},

	renderTableList() {
		if(this.state.isTablesLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		var isShouldFilter = (this.props.table != null && this.props.table.trim().length  !== 0);

		return (
			<List>
			{
				this.state.loadedTables.filter(function(table) {
					if(isShouldFilter === false) return true;
					return String.containsIgnoreCase(table, this.props.table);
				}.bind(this)).map(function(table) {
					var onClick = function() {
						this.props.onTableChange(table);
					}.bind(this);
					return (
						<ListItem
							key={table}
							primaryText={table}
							onClick={onClick} />
					);
				}.bind(this))
			}
			</List> 
		);
	},

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'ok', onClick: this.onOk },
					{ text: 'cancel', onClick: this.onCancel }
				]}
				actionFocus="ok"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.props.visible}>
				<Card>
					<CardHeader
						title="table 설정"
						subtitle="source database의 table 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="table"
							value={this.props.table} 
							onChange={this.onTableTextFieldChange}
							fullWidth={true} />
						<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
							{ this.renderTableList() }
						</div>
					</CardText>
				</Card>
			</Dialog>
		);
	}
});


var ColumnConfigDialog = React.createClass({
	PropTypes: {
		visible: React.PropTypes.bool.isRequired,
		onClose: React.PropTypes.func.isRequired,
		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		onColumnsChange: React.PropTypes.func.isRequired,
		jdbc: React.PropTypes.object.isRequired
	},

	getDefaultProps() {
		return { visible: false };
	},

	getInitialState() {
		return {
			isColumnsLoaded: false,
			loadedColumns: null
		};
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.visible === false && this.props.visible === true)
			this.loadColumns();
	},

	onColumnsTextFieldChange(evt) {
		this.props.onColumnsChange(evt.target.value);
	},

	loadColumns() {
		server.loadColumns(this.props.jdbc, this.props.table)
		.then(function(columns) {
			this.setState({
				isColumnsLoaded: true,
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			console.error(err.stack);
			this.setState({ isColumnsLoaded: false });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
	},

	renderColumnList() {
		if(this.state.isColumnsLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		var selectedColumnsArr = 
			this.props.columns.split(',')
				.map(function(s) { return s.trim(); })
				.filter(function(s){ if(s === '') return false; return true; });

		return (
			<List>
			{
				this.state.loadedColumns.map(function(column) {
					var columnName = column.columnName.toLowerCase();
					var columnType = column.columnType;

					var onClick = function() {
						if(Array.contains(selectedColumnsArr, columnName)) {
							selectedColumnsArr.remove(columnName);
						} else {
							selectedColumnsArr.push(columnName);
						}
						this.props.onColumnsChange(selectedColumnsArr.join(','));
					}.bind(this);

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
		return (
			<Dialog
				actions={[
					{ text: 'close', onClick: this.props.onClose }
				]}
				actionFocus="close"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.props.visible}>
				<Card>
					<CardHeader
						title="column 설정"
						subtitle="사용할 column 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="columns"
							value={this.props.columns} 
							onChange={this.onColumnsTextFieldChange}
							fullWidth={true} />
						<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
							{ this.renderColumnList() }
						</div>
					</CardText>
				</Card>
			</Dialog>
		);
	}
});

module.exports = DatabaseConfigPanel;