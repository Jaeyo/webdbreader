var React = require('react'),
	ReactDOM = require('react-dom'),
	ReactGateway = require('react-gateway'),
	_ = require('underscore'),
	util = require('util'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	server = require('../../utils/server.js'),
	LayerPopup = require('../../comps/layer-popup.jsx').LayerPopup,
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
			isTableColumnConfigModalVisible: false
		};
	},

	toggleDbConfigModal(evt) {
		this.setState({ isDatabaseConfigModalVisible: !this.state.isDatabaseConfigModalVisible });
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

	toggleTableColumnConfigModal() {
		this.setState({ isTableColumnConfigModalVisible: !this.state.isTableColumnConfigModalVisible });
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
	
	styles() {
		return {
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
			textbox: {
				display: 'block',
				width: '400px',
				marginBottom: '3px',
				color: 'black'
			},
			jdbcTextBox: {
				display: 'block',
				width: '100%'
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
		};
	},

	render() {
		var style = this.styles();
		return (
			<div>
				<Card>
					<CardHeader
						title="jdbc 설정"
						subtitle="source database의 연결 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<SelectField
							style={style.dbVendorSelectBox}
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
							style={style.configBtn}
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
								style={style.dbConfigModal.dbIpTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="database ip"
								value={this.props.dbIp}
								onChange={this.onDbConfigIpChange}
								onKeyUp={this.onDbConfigKeyUp} />
							<TextField
								style={style.dbConfigModal.dbPortTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="port"
								value={this.props.dbPort}
								onChange={this.onDbConfigPortChange}
								onKeyUp={this.onDbConfigKeyUp} />
							<TextField
								style={style.dbConfigModal.dbSidTextBox}
								inputStyle={{ textAlign: 'center' }}
								floatingLabelText="sid"
								value={this.props.dbSid}
								onChange={this.onDbConfigSidChange}
								onKeyUp={this.onDbConfigKeyUp} />
						</Dialog>
						<div style={style.jdbcBorder}>
							<TextField
								style={style.jdbcTextBox}
								floatingLabelText="jdbc driver"
								value={this.props.jdbcDriver}
								onChange={this.onJdbcDriverChanged} />
							<TextField
								style={style.jdbcTextBox}
								floatingLabelText="jdbc connection url"
								value={this.props.jdbcConnUrl}
								onChange={this.onJdbcConnUrlChanged} />
							<TextField
								style={style.jdbcTextBox}
								floatingLabelText="jdbc username"
								value={this.props.jdbcUsername}
								onChange={this.onJdbcUsernameChanged} />
							<TextField
								type="password"
								style={style.jdbcTextBox}
								floatingLabelText="jdbc password"
								value={this.props.jdbcPassword}
								onChange={this.onJdbcPasswordChanged} />
						</div>
					</CardText>
				</Card>
				<Card>
					<CardHeader
						title="table/column 설정"
						subtitle="source database의 table/column 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						//TODO IMME
						<TextField
							value={this.props.table}
							disabled={true}
							inputStyle={ style.textBox }
							onClick={this.toggleTableColumnConfigModal} />
						<TextField
							value={this.props.columns}
							disabled={true}
							inputStyle={ style.textBox }
							onClick={this.toggleTableColumnConfigModal} />
						<Dialog
							title="table/column config"
							actions={[
								{ text: 'ok', onClick: this.toggleTableColumnConfigModal }
							]}
							actionFocus="ok"
							open={this.state.isTableColumnConfigModalVisible}>
							<TableColumnConfigModal
								key="tableColumnConfigModal"
								jdbcDriver={this.props.jdbcDriver}
								jdbcConnUrl={this.props.jdbcConnUrl}
								jdbcUsername={this.props.jdbcUsername}
								jdbcPassword={this.props.jdbcPassword}
								table={this.props.table}
								columns={this.props.columns}
								onChange={this.props.onChange} />
						</Dialog>
					</CardText>
				</Card>
			</div>
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
			loadedTableData: []
		};
	},

	componentDidMount() {
		this.loadTables();
	},

	loadTables() {
		var loadingLayer = LayerPopup.getCurtainCancelableLoadingAlert('loading tables');
		loadingLayer.show();

		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		server.loadTables(jdbc)
		.then(function(tables) {
			loadingLayer.hide();
			this.setState({
				loadingTableStatus: 'loaded',
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			loadingLayer.hide();
			console.error(err.stack);
			this.setState({ loadingTableStatus: 'failed' });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
	},


	loadTableData() {
		var loadingLayer = LayerPopup.getCurtainCancelableLoadingAlert('loading data');
		loadingLayer.show();

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
			loadingLayer.hide();
			this.setState({
				loadingTableDataStatus: 'loaded',
				loadedTableData: sampleData
			});
		}.bind(this)).catch(function(err) {
			loadingLayer.hide();
			console.error(err.stack);
			this.setState({ loadingTableDataStatus: 'failed' });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
		//TODO IMME
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
				style: {
					width: '200px',
					marginRight: '6px'
				}
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
		console.log('table/column render'); //DEBUG
		return (
			<div>
				<div style={style.tableArea}>
					<div>
						<TextField
							inputStyle={style.tableTextBox}
							floatingLabelText="table"
							value={this.props.table} 
							onChange={this.onTableChange} />
						<Button
							label="로드"
							onClick={this.loadTableData} />
					</div>
					<div style={style.tableListDiv}>
						{this.renderTableList()}
					</div>
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
			</div>
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
							{this.state.loadedTables.forEach(function(table) {
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