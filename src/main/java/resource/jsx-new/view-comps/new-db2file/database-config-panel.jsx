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

	toggleDialog(dialog, evt) {
		evt.stopPropagation();

		switch(dialog) {
		case 'dbconfig': 
			this.setState({ isDatabaseConfigModalVisible: !this.state.isDatabaseConfigModalVisible });
			break;
		case 'tableconfig': 
			this.setState({ isTableConfigDialogVisible: !this.state.isTableConfigDialogVisible });
			break;
		case 'columnconfig': 
			if(this.props.table == null || this.props.table.trim().length === 0)
				this.setState({ isTableConfigDialogVisible: !this.state.isTableConfigDialogVisible });
			else
				this.setState({ isColumnConfigDialogVisible: !this.state.isColumnConfigDialogVisible });
			break;
		}
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

	handleChange(name, evt) {
		evt.stopPropagation();

		switch(name) {
		case 'dbconfig-ip': 
		case 'dbconfig-port': 
		case 'dbconfig-sid': 
		case 'dbVendor': 
			var state = {
				dbIp: name === 'dbconfig-ip' ? evt.target.value : this.props.dbIp,
				dbPort: name === 'dbconfig-port' ? evt.target.value : this.props.dbPort,
				dbSid: name === 'dbconfig-sid' ? evt.target.value : this.props.dbSid,
				dbVendor: name === 'dbVendor' ? evt.target.value : this.props.dbVendor
			};
			if(name === 'dbVendor') {
				state.jdbcDriver = jdbcTmpl[state.dbVendor].driver;
				state.dbPort = jdbcTmpl[state.dbVendor].port;
			}
			if(state.dbVendor !== 'etc') {
				state.jdbcConnUrl = 
					jdbcTmpl[state.dbVendor].connUrl
					.replace('{ip}', state.dbIp)
					.replace('{port}', state.dbPort)
					.replace('{database}', state.dbSid);
			}
			this.props.onChange(state);
			break;
		case 'jdbcDriver': 
		case 'jdbcConnUrl': 
		case 'jdbcUsername': 
		case 'jdbcPassword': 
			var state = {};
			state[name] = evt.target.value;
			this.props.onChange(state);
			break;
		}
	},

	onDbConfigKeyUp(evt) {
		evt.stopPropagation();
		if(evt.keyCode === 13) this.props.hide();
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
							onChange={this.handleChange.bind(this, 'dbVendor')} />
						<Button 
							label="설정" 
							secondary={true} 
							style={style.jdbcConfig.configBtn}
							onClick={this.toggleDialog.bind(this, 'dbconfig')} />
						<Clearfix />
						<Dialog
							title="database config"
							actions={[
								{ text: 'ok', onClick: this.toggleDialog.bind(this, 'dbconfig')}
							]}
							actionFocus="ok"
							open={this.state.isDatabaseConfigModalVisible}>
							<TextField
								style={style.jdbcConfig.dbConfigModal.dbIpTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="database ip"
								value={this.props.dbIp}
								onChange={this.handleChange.bind(this, 'dbconfig-ip')}
								onKeyUp={this.onDbConfigKeyUp} />
							<TextField
								style={style.jdbcConfig.dbConfigModal.dbPortTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="port"
								value={this.props.dbPort}
								onChange={this.handleChange.bind(this, 'dbconfig-port')}
								onKeyUp={this.onDbConfigKeyUp} />
							<TextField
								style={style.jdbcConfig.dbConfigModal.dbSidTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="sid"
								value={this.props.dbSid}
								onChange={this.handleChange.bind(this, 'dbconfig-sid')}
								onKeyUp={this.onDbConfigKeyUp} />
						</Dialog>
						<div style={style.jdbcConfig.jdbcBorder}>
							<TextField
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc driver"
								value={this.props.jdbcDriver}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcDriver')} />
							<TextField
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc connection url"
								value={this.props.jdbcConnUrl}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcConnUrl')} />
							<TextField
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc username"
								value={this.props.jdbcUsername}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcUsername')} />
							<TextField
								type="password"
								inputStyle={style.textfieldInputStyle}
								floatingLabelText="jdbc password"
								value={this.props.jdbcPassword}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcPassword')} />
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
							floatingLabelText="tables"
							inputStyle={style.textfieldInputStyle}
							fullWidth={true}
							onFocus={this.toggleDialog.bind(this, 'tableconfig')} />
						<TextField
							value={this.props.columns}
							floatingLabelText="columns"
							inputStyle={style.textfieldInputStyle}
							fullWidth={true}
							onFocus={this.toggleDialog.bind(this, 'columnconfig')} />
						<TableConfigDialog
							visible={this.state.isTableConfigDialogVisible}
							table={this.props.table}
							onChange={this.props.onChange}
							onAction={this.onTableConfigAction}
							jdbc={jdbc} />
						<ColumnConfigDialog
							visible={this.state.isColumnConfigDialogVisible}
							onClose={this.toggleDialog.bind(this, 'columnconfig')}
							table={this.props.table}
							columns={this.props.columns}
							onChange={this.props.onChange}
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
		onChange: React.PropTypes.func.isRequired,
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

	handleChange(name, evt) {
		evt.stopPropagation();
		switch(name) {
		case 'table': 
		var state = {};
		state[name] = evt.target.value;
		this.props.onChange(state);
		break;
		}
	},

	onTableChange(table) {
		this.props.onChange({ table: table });
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
					var onClick = function(evt) {
						evt.stopPropagation();
						this.onTableChange(table);
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
							onChange={this.handleChange.bind(this, 'table')}
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
		onChange: React.PropTypes.func.isRequired,
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

	handleChange(name, evt) {
		evt.stopPropagation();
		switch(name) {
		case 'columns': 
			var state = {};
			state[name] = evt.target.value;
			this.props.onChange(state);
			break;
		}
	},

	onColumnsChange(columns) {
		this.props.onChange({ columns: columns });
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

					var onClick = function(evt) {
						evt.stopPropagation();
						if(Array.contains(selectedColumnsArr, columnName)) {
							selectedColumnsArr.remove(columnName);
						} else {
							selectedColumnsArr.push(columnName);
						}
						this.onColumnsChange(selectedColumnsArr.join(','));
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
							onChange={this.handleChange.bind(this, 'columns')}
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