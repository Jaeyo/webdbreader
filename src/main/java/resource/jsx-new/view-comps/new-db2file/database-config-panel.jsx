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
	getDefaultProps() {
		return {
			dbVendor: '',
			dbIp: '',
			dbPort: '',
			dbSid: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			columns: '',
			onChange: null
		};
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
		this.onChange({ table: table });
	},
	
	styles() {
		return {
			card: {
				marginBottom: '10px'
			},
			textbox: {
				display: 'block'
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
				jdbcTextBox: {
					display: 'block'
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
								style={style.jdbcConfig.jdbcTextBox}
								floatingLabelText="jdbc driver"
								value={this.props.jdbcDriver}
								fullWidth={true}
								onChange={this.onJdbcDriverChanged} />
							<TextField
								style={style.jdbcConfig.jdbcTextBox}
								floatingLabelText="jdbc connection url"
								value={this.props.jdbcConnUrl}
								fullWidth={true}
								onChange={this.onJdbcConnUrlChanged} />
							<TextField
								style={style.jdbcConfig.jdbcTextBox}
								floatingLabelText="jdbc username"
								value={this.props.jdbcUsername}
								fullWidth={true}
								onChange={this.onJdbcUsernameChanged} />
							<TextField
								type="password"
								style={style.jdbcConfig.jdbcTextBox}
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
							style={ style.textBox }
							fullWidth={true}
							onClick={this.toggleTableColumnConfigModal} />
						<TextField
							value={this.props.columns}
							disabled={true}
							floatingLabelText="columns"
							style={ style.textBox }
							fullWidth={true}
							onClick={this.toggleTableColumnConfigModal} />
						<TableConfigDialog
							visible={this.state.isTableConfigDialogVisible}
							table={this.props.table}
							onTableChange={this.props.onTableChange}
							onAction={this.onTableConfigAction}
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
			isLoadingDialogVisible: false,
			isTablesLoaded: false
			loadedTables: null
		}
	},

	componentDidMount() {
		this.loadTables();
	},

	onOk() {
		this.props.onAction('ok');
	},

	onCancel() {
		this.props.onAction('cancel');
	},

	toggleLoadingDialogVisible(visible) {
		if(visible === undefined) visible = !this.state.isLoadingDialogVisible;
		this.setState({ isLoadingDialogVisible: visible });
	},

	loadTables() {
		this.toggleLoadingDialogVisible(true);

		server.loadTables(this.jdbc)
		.then(function(tables) {
			this.toggleLoadingDialogVisible(false);
			this.setState({
				isTablesLoaded: true
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			this.toggleLoadingDialogVisible(false);
			console.error(err.stack);
			this.setState({ isTablesLoaded: 'failed' });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
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
							onChange={this.props.onTableChange}
							fullWidth={true} />
						{
							this.state.isTablesLoaded === true ? 
							(<List>
							{
								var isShouldFilter = this.props.table != null && this.props.table.trim().length  != 0;
								this.state.loadedTables.filter(function(table) {
									if(isShouldFilter === false) return true;
									return String.containsIgnoreCase(table, this.props.table);
								}).map(function(table) {
									var onClick = function() {
										this.props.onTableChange(table);
									}.bind(this);
									return (
										<ListItem
											key={table}
											primaryText={table}
											onClick={onClick} />
									);
								});
							}
							</List>) : null
						}
					</CardText>
				</Card>
				<Dialog
					title="loading tables..."
					actions={[
						{ text: 'cancel', onClick: this.toggleLoadingDialogVisible}
					]}
					actionFocus="cancel"
					open={this.state.isLoadingDialogVisible}>
					<CircularProgress mode="indeterminate" size={1} />
				</Dialog>
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
			isLoadingDialogVisible: false,
			isColumnsLoaded: false,
			loadedColumns: null
		};
	},

	componentDidMount() {
		this.loadColumns();
	},

	toggleLoadingDialogVisible(visible) {
		if(visible === undefined) visible = !this.state.isLoadingDialogVisible;
		this.setState({ isLoadingDialogVisible: visible });
	},

	loadColumns() {
		this.toggleLoadingDialogVisible(true);

		server.loadColumns(this.props.jdbc, this.props.table)
		.then(function(columns) {
			this.toggleLoadingDialogVisible(false);
			this.setState({
				isColumnsLoaded: true,
				loadedColumns: columns
			});
		}).catch(function(err) {
			this.toggleLoadingDialogVisible(false);
			console.error(err.stack);
			this.setState({ isColumnsLoaded: 'failed' });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		});
	},

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'ok', onClick: this.props.onClose },
					{ text: 'cancel', onClick: this.props.onClose }
				]}
				actionFocus="ok"
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
							onChange={this.props.onColumnsChange}
							fullWidth={true} />
						{
							this.state.isColumnsLoaded === true ? 
							(<List>
							{
								var selectedColumnsArr = this.props.columns.split(',').map(function(s) { return s.trim().toLowerCase(); });
								this.state.loadedColumns.map(function(column) {
									var onClick = function() {
										if(Array.contains(selectedColumnsArr, column.toLowerCase())) {
											//TODO columns state always must be lower case!!!!!
										} else {

										}
									}.bind(this);
								}.bind(this));
							}
							</List>) : null
						}
					</CardText>
				</Card>
				<Dialog
					title="loading tables..."
					actions={[
						{ text: 'cancel', onClick: this.toggleLoadingDialogVisible}
					]}
					actionFocus="cancel"
					open={this.state.isLoadingDialogVisible}>
					<CircularProgress mode="indeterminate" size={1} />
				</Dialog>
			</Dialog>
		);
	}
});













var TableColumnConfigModal = React.createClass({
	getDefaultProps() {
		return {
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			columns: '',
			onChange: null
		};
	},

	getInitialState() {
		return {
			loadingTableStatus: 'loading', // loading / failed / loaded
			loadedTables: [],
			loadingTableDataStatus: 'none', // none / loading / failed / loaded
			loadedTableData: [],
			isLoadingDialogVisible: false
		};
	},

	componentDidMount() {
		this.loadTables();
	},

	toggleLoadingDialogVisible(visible) {
		if(visible === undefined)
			this.setState({ isLoadingDialogVisible: !this.state.isLoadingDialogVisible });
		else
			this.setState({ isLoadingDialogVisible: visible });
	},

	loadTables() {
		this.toggleLoadingDialogVisible(true);

		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		server.loadTables(jdbc)
		.then(function(tables) {
			this.toggleLoadingDialogVisible(false);
			this.setState({
				loadingTableStatus: 'loaded',
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			this.toggleLoadingDialogVisible(false);
			console.error(err.stack);
			this.setState({ loadingTableStatus: 'failed' });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
	},


	loadTableData() {
		this.toggleLoadingDialogVisible(true);

		var params = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword,
			query: 'select * from ' + this.props.table,
			rowCount: 10,
			isEncrypted: false
		};

		server.querySampleData(params)
		.then(function(sampleData) {
			this.toggleLoadingDialogVisible(false);
			this.setState({
				loadingTableDataStatus: 'loaded',
				loadedTableData: sampleData
			});
		}.bind(this)).catch(function(err) {
			this.toggleLoadingDialogVisible(false);
			console.error(err.stack);
			this.setState({ loadingTableDataStatus: 'failed' });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
	},

	onTableChange(evt) {
		this.props.onChange({ table: evt.target.value });
	},

	onColumnsChange(evt) {
		this.props.onChange({ columns: evt.target.value });
	},

	styles() {
		return {
			tableArea: {
				float: 'left',
				height: '100%',
				padding: '10px'
			}, 
			tableTextBox: {
				width: '200px',
				marginRight: '6px'
			},
			tableListDiv: {
				height: '350px',
				overflow: 'auto',
				padding: '10px'
			},
			columnArea: {
				float: 'left',
				height: '100%',
				padding: '10px'
			},
			columnTextBox: {
				style: {
					width: '400px'
				}
			},
			columnListDiv: {
				height: '350px',
				width: '400px',
				overflow: 'auto',
				padding: '10px'
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<Card>
				<CardHeader
					title="table/column 설정"
					subtitle="source database의 table/column 정보를 설정합니다."
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					<TextField
						inputStyle={style.tableTextBox}
						floatingLabelText="table"
						value={this.props.table} 
						onChange={this.onTableChange} />
					<Button
						label="로드"
						onClick={this.loadTableData} />
					<div style={style.tableListDiv}>
						{this.renderTableList()}
					</div>
					<div style={style.columnArea}>
						<div>
							<TextField
								inputStyle={style.columnTextBox}
								floatingLabelText="columns" 
								value={this.props.columns} 
								onChange={this.onColumnsChange} />
						</div>
						<div is="columnListDiv">
							{this.renderColumnList()}
						</div>
					</div>
					<Clearfix />
					<Dialog
						title="loading..."
						actions={[
							{ text: 'cancel', onClick: this.toggleLoadingDialogVisible}
						]}
						actionFocus="cancel"
						open={this.state.isLoadingDialogVisible}>
						<CircularProgress mode="indeterminate" size={1} />
					</Dialog>
				</CardText>
			</Card>
		);
	},

	renderTableList() {
		switch(this.state.loadingTableStatus) {
		case 'loading': 
			return ( <CircularProgress mode="indeterminate" size={0.5} /> );
		case 'failed':
			return (<label>failed</label>);
		case 'loaded':
			if(this.state.loadedTables.length === 0) {
				return (<label>no tables</label>);
			} else {
				return (
					<div style={{ width: '100%', height: '100%', overflow: 'auto'}}>
						<List>
							{this.state.loadedTables.map(function(table) {
								var onClick = function() {
									this.props.onChange({ table: table });
								}.bind(this);

								return (
									<ListItem
										key={table}
										primaryText={table}
										onClick={onClick} />
								);
							}.bind(this))}
						</List>
					</div>
				);
			}
		}
	},

	renderColumnList() {
		switch(this.state.loadingTableDataStatus) {
		case 'none':
			return null;
		case 'loading':
			return ( <CircularProgress mode="indeterminate" size={0.5} /> );
		case 'failed':
			return (<label>failed</label>);
		case 'loaded':
			var onSelectColumnChange = function(column) {
				var columns = this.props.columns.split(',');
				columns.remove('');
				
				if(Array.containsIgnoreCase(columns, column)) {
					columns.remove(column); //TODO case
				} else {
					columns.push(column);
				}

				this.props.onChange({
					columns: columns.join(',')
				});
			}.bind(this);

			var columnsArr = this.props.columns.split(',').map(function(col) { return col.trim(); });

			return (
				<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
					<ColumnSelectTable 
						rows={this.state.loadedTableData} 
						selectedColumns={columnsArr}
						onSelectedColumnChange={onSelectColumnChange} />
				</div>
			);
		}
	}
});

module.exports = DatabaseConfigPanel;