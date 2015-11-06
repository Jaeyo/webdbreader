var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	util = require('util'),
	Loading = require('react-loading'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	server = require('../../utils/server.js'),
	SelectBox = require('../../comps/select-box.jsx').SelectBox,
	TextBox = require('../../comps/textbox.jsx').TextBox,
	Panel = require('../../comps/panel.jsx').Panel,
	DarkBlueSmallBtn = require('../../comps/btn.jsx').DarkBlueSmallBtn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	LayerPopup = require('../../comps/layer-popup.jsx'),
	modalMixin = require('../../comps/layer-popup.jsx').modalMixin,
	Curtain = require('../../comps/layer-popup.jsx').Curtain,
	KeyValueLine = require('../../comps/etc.jsx').getKeyValueLine('100px'),
	ListItem = require('../../comps/etc.jsx').ListItem,
	ColumnSelectTable = require('./column-select-table.jsx').ColumnSelectTable;

Array.prototype.remove = require('array-remove-by-value');

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
	mixins: [ ReactCSS.mixin ],

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

	showDatabaseConfigModal(evt) {
		this.refs.databaseConfigModal.show();
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
		this.props.onChange({ connUrl: evt.target.value });
	},

	onJdbcUsernameChanged(evt) {
		this.props.onChange({ jdbcUsername: evt.target.value });
	},

	onJdbcPasswordChanged(evt) {
		this.props.onChange({ jdbcPassword: evt.target.value });
	},

	showTableColumnConfigModal() {
		this.refs.tableColumnConfigModal.show();
	},

	classes() {
		return {
			'default': {
				Panel: {
					style: {
						marginBottom: '10px'
					}
				},
				DbVendorSelectBox: {
					style: {
						width: '400px',
						marginRight: '10px'
					}
				},
				border: {
					display: 'inline-block',
					border: '1px dashed ' + color.lightGray,
					padding: '10px',
					margin: '10px 0'
				},
				TextBox: {
					style: {
						display: 'block',
						width: '400px',
						marginBottom: '3px'
					}
				},
				JdbcTextBox: {
					style: {
						display: 'block',
						width: '350px',
						marginBottom: '3px'
					}
				}
			}
		};
	},

	styles() {
		return this.css();
	},


	render() {
		return (
			<Panel is="Panel">
				<Panel.SmallHeading glyphicon="cog">jdbc 설정</Panel.SmallHeading>
				<Panel.Body>
					<KeyValueLine label="데이터베이스">
						<div>
							<SelectBox is="DbVendorSelectBox"
								values={[ 'oracle', 'mysql', 'mssql', 'db2', 'tibero', 'etc' ]} 
								value={this.props.dbVendor}
								onChange={this.onDbVendorChange} />
							<DarkBlueSmallBtn onClick={this.showDatabaseConfigModal}>설정</DarkBlueSmallBtn>
						</div>
						<div is="border">
							<TextBox is="JdbcTextBox"
								placeholder="jdbc driver" 
								value={this.props.jdbcDriver}
								onChange={this.onJdbcDriverChanged} />
							<TextBox is="JdbcTextBox"
								placeholder="jdbc connection url"
								value={this.props.jdbcConnUrl}
								onChange={this.onJdbcConnUrlChanged} />
							<TextBox is="JdbcTextBox"
								placeholder="jdbc username"
								value={this.props.jdbcUsername}
								onChange={this.onJdbcUsernameChanged} />
							<TextBox is="JdbcTextBox"
								type="password"
								placeholder="jdbc password"
								value={this.props.jdbcPassword}
								onChange={this.onJdbcPasswordChanged} />
						</div>
					</KeyValueLine>
					<KeyValueLine label="테이블">
						<TextBox is="TextBox"
							placeholder="table"
							value={this.props.table}
							onClick={this.showTableColumnConfigModal}
							onFocus={this.showTableColumnConfigModal} />
					</KeyValueLine>
					<KeyValueLine label="컬럼">
						<TextBox is="TextBox"
							placeholder="columns"
							value={this.props.columns}
							onClick={this.showTableColumnConfigModal}
							onFocus={this.showTableColumnConfigModal} />
					</KeyValueLine>
				</Panel.Body>
				<DatabaseConfigModal 
					ref="databaseConfigModal"
					dbVendor={this.props.dbVendor}
					dbIp={this.props.dbIp}
					dbPort={this.props.dbPort}
					dbSid={this.props.dbSid}
					onChange={this.props.onChange} />
				<TableColumnConfigModal
					ref="tableColumnConfigModal"
					jdbcDriver={this.props.jdbcDriver}
					jdbcConnUrl={this.props.jdbcConnUrl}
					jdbcUsername={this.props.jdbcUsername}
					jdbcPassword={this.props.jdbcPassword}
					table={this.props.table}
					columns={this.props.columns}
					onChange={this.props.onChange} />
			</Panel>
		);
	}
});


var DatabaseConfigModal = React.createClass({
	mixins: [ modalMixin, ReactCSS.mixin ],

	getDefaultProps() {
		return { 
			dbVendor: '',
			dbIp: '',
			dbPort: '',
			dbSid: '',
			onChange: null
		};
	},

	getInitialState() {
		return { visible: false };
	},

	onIpChange(evt) {
		var state = { dbIp: evt.target.value };

		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', state.dbIp)
											.replace('{port}', this.props.dbPort)
											.replace('{database}', this.props.dbSid);
		}

		this.props.onChange(state);
	},

	onPortChange(evt) {
		var state = { dbPort: evt.target.value };

		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
											.replace('{port}', state.dbPort)
											.replace('{database}', this.props.dbSid);
		}

		this.props.onChange(state);
	},

	onSidChange(evt) {
		var state = { dbSid : evt.target.value };

		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
											.replace('{port}', this.props.dbPort)
											.replace('{database}', state.dbSid);
		}

		this.props.onChange(state);
	},

	onKeyUp(evt) {
		if(evt.keyCode === 13) this.hide();
	},

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevState.visible === false && this.state.visible === true)
			React.findDOMNode(this.refs.dbIpTextBox).focus();
	},

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				},
				modal: _.extend(this.getModalDivStyle(), {
					width: '500px',
					textAlign: 'center'
				}),
				dbIpTextBox: {
					width: '200px',
					marginRight: '3px'
				},
				dbPortTextBox: {
					width: '50px',
					marginRight: '3px'
				},
				dbSidTextBox: {
					width: '120px',
					marginRight: '3px'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<Curtain onClick={this.hide} />
				<div is="modal">
					<TextBox 
						ref="dbIpTextBox"
						is="dbIpTextBox"
						placeholder="database ip" 
						value={this.props.dbIp}
						onChange={this.onIpChange}
						onKeyUp={this.onKeyUp} />
					<TextBox
						is="dbPortTextBox"
						placeholder="port"
						value={this.props.dbPort}
						onChange={this.onPortChange}
						onKeyUp={this.onKeyUp} />
					<TextBox
						is="dbSidTextBox"
						placeholder="database"
						value={this.props.dbSid}
						onChange={this.onSidChange}
						onKeyUp={this.onKeyUp} />
					<DarkBlueSmallBtn onClick={this.hide}>ok</DarkBlueSmallBtn>				
				</div>
			</div>
		);
	}
});


var TableColumnConfigModal = React.createClass({
	mixins: [ modalMixin, ReactCSS.mixin ],
	styles() { return this.css(); },

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
			visible: false,
			loadingTableStatus: 'loading', // loading / failed / loaded
			loadedTables: [],
			loadingTableDataStatus: 'none', // none / loading / failed / loaded
			loadedTableData: []
		};
	},

	componentDidUpdate(prevProps, prevStates) {
		if(prevStates.visible === false && this.state.visible === true)
			this.loadTables();
	},

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
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

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				},
				modal: _.extend(this.getModalDivStyle(), { width: 'auto' }),
				tableArea: {
					float: 'left',
					height: '100%',
					padding: '10px'
				}, 
				TableTextBox: {
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
				ColumnTextBox: {
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
			}
		}
	},

	render() {
		return (
			<div is="outer">
				<Curtain onClick={this.hide} />
				<div is="modal">
					<div is="tableArea">
						<div>
							<TextBox 
								is="TableTextBox"
								placeholder="table" 
								value={this.props.table} 
								onChange={this.onTableChange} />
							<DarkBlueSmallBtn 
								onClick={this.loadTableData}>로드</DarkBlueSmallBtn>
						</div>
						<div is="tableListDiv">
							{this.renderTableList()}
						</div>
					</div>
					<div is="columnArea">
						<div>
							<TextBox 
								is="ColumnTextBox"
								placeholder="columns" 
								value={this.props.columns} 
								onChange={this.onColumnsChange} />
						</div>
						<div is="columnListDiv">
							{this.renderColumnList()}
						</div>
					</div>
					<Clearfix />
				</div>
			</div>
		);
	},

	renderTableList() {
		switch(this.state.loadingTableStatus) {
		case 'loading': 
			return (<Loading type="bubbles" color="#e4e4e4" />);
		case 'failed':
			return (<label>failed</label>);
		case 'loaded':
			if(this.state.loadedTables.length === 0) {
				return (<label>no tables</label>);
			} else {
				var body = [];
				this.state.loadedTables.forEach(function(table) {
					if(this.props.table !== '' && 
						table.toLowerCase().indexOf(this.props.table.toLowerCase()) === -1) return;

					var onClick = function() {
						this.props.onChange({ table: table });
					}.bind(this);

					body.push(<ListItem name={table} onClick={onClick} />);
				}.bind(this));

				return (
					<div style={{ width: '100%', height: '100%', overflow: 'auto'}}>
						{body}
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
			return (<Loading type="bubbles" color="#e4e4e4" />);
		case 'failed':
			return (<label>failed</label>);
		case 'loaded':
			var onSelectColumnChange = function(column) {
				column = column.toLowerCase();
				var columns = this.props.columns.toLowerCase().split(',');
				columns.remove('');
				
				if(columns.indexOf(column) !== -1) {
					columns.remove(column);
				} else {
					columns.push(column);
				}

				this.props.onChange({
					columns: columns.join(',')
				});
			}.bind(this);

			return (
				<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
					<ColumnSelectTable 
						rows={this.state.loadedTableData} 
						selectedColumns={this.props.columns.toLowerCase()}
						onSelectedColumnChange={onSelectColumnChange} />
				</div>
			);
		}
	}
});

module.exports = DatabaseConfigPanel;