var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	util = require('util'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	server = require('../../utils/server.js'),
	SelectBox = require('../../comps/select-box.jsx').SelectBox,
	TextBox = require('../../comps/textbox.jsx').TextBox,
	Panel = require('../../comps/panel.jsx').Panel,
	DarkBlueSmallBtn = require('../../comps/btn.jsx').DarkBlueSmallBtn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	LayerPopup = require('../../comps/layer-popup.jsx').LayerPopup,
	modalMixin = require('../../comps/layer-popup.jsx').modalMixin,
	Curtain = require('../../comps/layer-popup.jsx').Curtain,
	KeyValueLine = require('../../comps/etc.jsx').getKeyValueLine('100px'),
	ListItem = require('../../comps/etc.jsx').ListItem;

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

	onClickDbVendorConfigBtn(evt) {
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

	onDatabaseConfigModalChange(args) {
		var newState = {
			dbIp: args.dbIp != null ? args.dbIp : this.props.dbIp,
			dbPort: args.dbPort != null ? args.dbPort : this.props.dbPort,
			dbSid: args.dbSid != null ? args.dbSid : this.props.dbSid
		};

		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			newState.jdbcConnUrl = tmpl.connUrl.replace('{ip}', newState.dbIp)
												.replace('{port}', newState.dbPort)
												.replace('{database}', newState.dbSid);
		}

		this.props.onChange(newState);
	},

	onTableChange(table) {
		this.props.onChange({ table: table });
	},

	onColumnChange(columns) {
		this.props.onChange({ columns: columns });
	},

	onClickTableTextbox(evt) {
		this.refs.tableConfigModal.show();
	},

	onClickColumnTextbox(evt) {
		this.refs.columnConfigModal.show();
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
							<DarkBlueSmallBtn onClick={this.onClickDbVendorConfigBtn}>설정</DarkBlueSmallBtn>
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
							onClick={this.onClickTableTextbox}
							onFocus={this.onClickTableTextbox} />
					</KeyValueLine>
					<KeyValueLine label="컬럼">
						<TextBox is="TextBox"
							placeholder="columns"
							value={this.props.columns}
							onClick={this.onClickColumnTextbox}
							onFocus={this.onClickColumnTextbox} />
					</KeyValueLine>
				</Panel.Body>
				<DatabaseConfigModal 
					ref="databaseConfigModal"
					dbIp={this.props.dbIp}
					dbPort={this.props.dbPort}
					dbSid={this.props.dbSid}
					onChange={this.onDatabaseConfigModalChange} />
				<TableConfigModal 
					ref="tableConfigModal"
					jdbcDriver={this.props.jdbcDriver}
					jdbcConnUrl={this.props.jdbcConnUrl}
					jdbcUsername={this.props.jdbcUsername}
					jdbcPassword={this.props.jdbcPassword}
					table={this.props.table}
					onChange={this.onTableChange} />
				<ColumnConfigModal 
					ref="columnConfigModal"
					jdbcDriver={this.props.jdbcDriver}
					jdbcConnUrl={this.props.jdbcConnUrl}
					jdbcUsername={this.props.jdbcUsername}
					jdbcPassword={this.props.jdbcPassword}
					table={this.props.table}
					columns={this.props.columns}
					onChange={this.onColumnChange} />
			</Panel>
		);
	}
});

var DatabaseConfigModal = React.createClass({
	mixins: [ modalMixin, ReactCSS.mixin ],

	getDefaultProps() {
		return { 
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
		if(this.props.onChange) 
			this.props.onChange({ dbIp: evt.target.value });
	},

	onPortChange(evt) {
		if(this.props.onChange) 
			this.props.onChange({ dbPort: evt.target.value });
	},

	onSidChange(evt) {
		if(this.props.onChange) 
			this.props.onChange({ dbSid: evt.target.value });
	},

	onKeyUp(evt) {
		if(evt.keyCode === 13)
			this.hide();
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


var TableConfigModal = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],

	getDefaultProps() {
		return { 
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			onChange: null,
			table: ''
		};
	},

	getInitialState() {
		return { 
			visible: false,
			loadedTablesStatus: 'loading',
			loadedTables: []
		};
	},

	show() {
		this.setState({ 
			visible: true,
			loadedTablesStatus: 'loading',
			loadedTables: []
		});
		this.loadTables();
	},

	hide() {
		this.setState({ visible: false });
	},

	loadTables() {
		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		server.loadTables(jdbc).then(function(tables) {
			this.setState({ 
				loadedTablesStatus: 'loaded',
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			console.error({ err: err });
			this.setState({ loadedTablesStatus: 'failed' });
		}.bind(this));
	},

	onTableChange(evt) {
		if(this.props.onChange)
			this.props.onChange(evt.target.value);
	},

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				},
				loadingBox: {
					textAlign: 'center',
					padding: '10px',
					fontSize: '90%'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var loadedTables = null;
		if(this.state.loadedTablesStatus === 'loading') {
			loadedTables = ( <div is="loadingBox">loading...</div> );
		} else if(this.state.loadedTablesStatus === 'failed') {
			loadedTables = ( <div is="loadingBox">load fail</div> );
		} else if(this.state.loadedTablesStatus === 'loaded') {
			loadedTables = (
				<TableList 
					items={this.state.loadedTables}
					onChange={this.props.onChange}
					tableText={this.props.table} />
			);
		}

		return (
			<div is="outer">
				<Curtain onClick={this.hide} />
				<div style={this.getModalDivStyle()}>
					<TextBox 
						placeholder="table"
						value={this.props.table}
						onChange={this.onTableChange} />
					<hr />
					{loadedTables}
					<DarkBlueSmallBtn onClick={this.hide}>ok</DarkBlueSmallBtn>
				</div>
			</div>
		);
	}
});


var TableList = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { 
			items: [],
			onChange: null,
			tableText: ''
		};
	},

	classes() {
		return {
			'default': {
				outer: {
					height: '100px',
					overflow: 'auto'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var body = [];
		this.props.items.forEach(function(item) {
			if(this.props.tableText !== '' && 
				item.toLowerCase().indexOf(this.props.tableText.toLowerCase()) === -1) 
				return;

			var onClickFn = function() {
				this.props.onChange(item);
			}.bind(this);

			body.push(<ListItem key={item} name={item} onClick={onClickFn} />);
		}.bind(this));

		return (
			<div is="outer">
				{body}
			</div>
		);
	}
});


var ColumnConfigModal = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],

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
			loadedColumnsStatus: 'loading',
			loadedColumns: []
		};
	},

	show() {
		this.setState({ 
			visible: true,
			loadedColumnsStatus: 'loading',
			loadedColumns: []
		});

		this.loadColumns();
	},

	hide() {
		this.setState({ visible: false });
	},

	loadColumns() {
		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		server.loadColumns(jdbc, this.props.table).then(function(columns) {
			this.setState({
				loadedColumnsStatus: 'loaded',
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			console.error({ err: err });
			this.setState({ loadedColumnsStatus: 'failed' });
		}.bind(this));
	},

	onListChange(column) {
		var columns = this.props.columns.trim() === '' ? [] : this.props.columns.split(',');

		if(columns.indexOf(column) === -1) columns.push(column);
		else columns.remove(column);

		this.props.onChange(columns.join(','));
	},

	onColumnTextChange(evt) {
		this.props.onChange(evt.target.value);
	},

	classes() {
		return {
			'default': {
				loadingBox: {
					textAlign: 'center',
					padding: '10px',
					fontSize: '90%'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var loadedColumns = null;
		if(this.state.loadedColumnsStatus === 'loading') {
			loadedColumns = ( <div is="loadingBox">loading...</div> );
		} else if(this.state.loadedColumnsStatus === 'failed') {
			loadedColumns = ( <div is="loadingBox">load fail</div> );
		} else if(this.state.loadedColumnsStatus === 'loaded') {
			loadedColumns = (
				<ColumnList 
					columns={this.props.columns}
					items={this.state.loadedColumns}
					onListChange={this.onListChange} />
			);
		}

		return (
			<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
				<Curtain onClick={this.hide} />
				<div style={this.getModalDivStyle()}>
					<TextBox 
						placeholder="columns"
						value={this.props.columns}
						onChange={this.onColumnTextChange} />
					<hr />
					{loadedColumns}
					<DarkBlueSmallBtn onClick={this.hide}>ok</DarkBlueSmallBtn>
				</div>
			</div>
		);
	}
});


var ColumnList = React.createClass({
	mixins: [ ReactCSS.mixin ],
	getDefaultProps() {
		return { 
			columns: '',
			items: [],
			onListChange: null
		};
	},

	classes() {
		return {
			'default': {
				outer: {
					height: '100px',
					overflow: 'auto'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var body = [];
		var columnsArr = this.props.columns.split(',');
		this.props.items.forEach(function(item) {
			var onClickFn = function() {
				this.props.onListChange(item.columnName);
			}.bind(this);

			var name = util.format('%s (%s)', item.columnName, item.columnType);
			body.push(
				<ListItem 
					key={name} 
					name={name} 
					onClick={onClickFn}
					isSelected={columnsArr.indexOf(item.columnName) !== -1} />
			);
		}.bind(this));

		return (
			<div is="outer">
				{body}
			</div>
		);
	}
});


module.exports = DatabaseConfigPanel;