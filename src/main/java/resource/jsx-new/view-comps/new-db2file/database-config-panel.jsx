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

	getInitialState() {
		return {
			dbVendor: 'oracle',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			columns: ''
		};
	},

	onClickDbVendorBtn(evt) {
		this.refs.databaseConfigModal.show();
	},

	onDbVendorChange(evt) {
		var state = { dbVendor: evt.target.value };

		if(state.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.state.dbVendor];
			state.jdbcDriver = tmpl.driver;
		}

		this.setState(state);
		window.store.dbVendor.dispatch({ dbVendor: state.dbVendor });
		window.store.jdbc.dispatch({ driver: state.jdbcDriver });
	},

	onJdbcDriverChanged(evt) {
		this.setState({ jdbcDriver: evt.target.value });
		window.store.jdbc.dispatch({ driver: evt.target.value });
	},

	onJdbcConnUrlChanged(evt) {
		this.setState({ connUrl: evt.target.value });
		window.store.jdbc.dispatch({ connUrl: evt.target.value });
	},

	onJdbcUsernameChanged(evt) {
		this.setState({ jdbcUsername: evt.target.value });
		window.store.jdbc.dispatch({ username: evt.target.value });
	},

	onJdbcPasswordChanged(evt) {
		this.setState({ jdbcPassword: evt.target.value });
		window.store.jdbc.dispatch({ password: evt.target.value });
	},

	onDatabaseConfigModalChange(args) {
		if(this.state.dbVendor === 'etc') return;

		var tmpl = jdbcTmpl[this.state.dbVendor];
		var connUrl = tmpl.connUrl.replace('{ip}', args.ip != null ? args.ip : '')
								.replace('{port}', args.port != null ? args.port : '')
								.replace('{database}', args.sid != null ? args.sid : '');

		this.setState({ jdbcConnUrl: connUrl }); 

		var newData = { connUrl: connUrl };
		if(args.ip) newData.ip = args.ip;
		if(args.port) newData.port = args.port;
		if(args.sid) newData.sid = args.sid;
		window.store.jdbc.dispatch(newData);
	},

	onTableConfigModalChange(table) {
		this.setState({ table: table });
		window.store.table.dispatch({ table: table });
	},

	onColumnConfigModalChange(column) {
		//TODO IMME modify
		var columns = JSON.parse(JSON.stringify(this.state.columns));
		if(columns.indexOf(column) > -1)
			columns.remove(column);
		else
			columns.push(column);
		this.setState({ columns: columns });
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
								value={this.state.dbVendor}
								onChange={this.onDbVendorChange} />
							<DarkBlueSmallBtn onClick={this.onClickDbVendorBtn}>설정</DarkBlueSmallBtn>
						</div>
						<div is="border">
							<TextBox is="JdbcTextBox"
								placeholder="jdbc driver" 
								value={this.state.jdbcDriver}
								onChange={this.onJdbcDriverChanged} />
							<TextBox is="JdbcTextBox"
								placeholder="jdbc connection url"
								value={this.state.jdbcConnUrl}
								onChange={this.onJdbcConnUrlChanged} />
							<TextBox is="JdbcTextBox"
								placeholder="jdbc username"
								value={this.state.jdbcUsername}
								onChange={this.onJdbcUsernameChanged} />
							<TextBox is="JdbcTextBox"
								type="password"
								placeholder="jdbc password"
								value={this.state.jdbcPassword}
								onChange={this.onJdbcPasswordChanged} />
						</div>
					</KeyValueLine>
					<KeyValueLine label="테이블">
						<TextBox is="TextBox"
							placeholder="table"
							value={this.state.table}
							onClick={this.onClickTableTextbox} />
					</KeyValueLine>
					<KeyValueLine label="컬럼">
						<TextBox is="TextBox"
							placeholder="columns"
							value={this.state.columns}
							onClick={this.onClickColumnTextbox} />
					</KeyValueLine>
				</Panel.Body>
				<DatabaseConfigModal 
					ref="databaseConfigModal"
					onChange={this.onDatabaseConfigModalChange} />
				<TableConfigModal 
					ref="tableConfigModal"
					table={this.state.table}
					onChange={this.onTableConfigModalChange} />
				<ColumnConfigModal 
					ref="columnConfigModal"
					columns={this.state.columns}
					onChange={this.onColumnConfigModalChange} />
			</Panel>
		);
	}
});

var DatabaseConfigModal = React.createClass({
	mixins: [ modalMixin, ReactCSS.mixin ],

	getDefaultProps() {
		return { 
			onChange: null
		};
	},

	getInitialState() {
		return { 
			visible: false,
			ip: '',
			port: '',
			sid: ''
		};
	},

	componentDidMount() {
		window.store.dbVendor.listen(function(data) {
			this.setState({ port: jdbcTmpl[data.dbVendor].port });
		}.bind(this));
	},

	onIpChange(evt) {
		this.setState({ ip: evt.target.value });
		if(this.props.onChange) 
			this.props.onChange({ ip: evt.target.value });
	},

	onPortChange(evt) {
		this.setState({ port: evt.target.value });
		if(this.props.onChange) 
			this.props.onChange({ port: evt.target.value });
	},

	onSidChange(evt) {
		this.setState({ sid: evt.target.value });
		if(this.props.onChange) 
			this.props.onChange({ sid: evt.target.value });
	},

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
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
				<Curtain />
				<div style={this.getModalDivStyle()}>
					<TextBox 
						placeholder="database ip" 
						value={this.state.ip}
						onChange={this.onIpChange} />
					<TextBox
						placeholder="port"
						value={this.state.port}
						onChange={this.onPortChange} />
					<TextBox
						placeholder="database"
						value={this.state.sid}
						onChange={this.onSidChange} />
					<DarkBlueSmallBtn onClick={this.hide}>ok</DarkBlueSmallBtn>				
				</div>
			</div>
		);
	}
});


var TableConfigModal = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],
	jdbc: {},

	getDefaultProps() {
		return { 
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

	onChangeTable(evt) {
		if(this.props.onChange)
			this.props.onChange(evt.target.value);
	},

	show() {
		loadTables();
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
		window.store.table.dispatch({ table: this.state.table });
	},

	loadTables() {
		server.loadTables(this.jdbc).then(function(tables) {
			this.setState({ 
				loadedTablesStatus: 'loaded',
				loadedTables: resp.tables
			});
		}.bind(this)).catch(function(err) {
			this.setState({ loadedTablesStatus: 'fail' });
		}.bind(this));
	},

	componentDidMount() {
		window.store.jdbc.listen(function(data) {
			this.jdbc = data;
		}.bind(this));
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
				<Curtain />
				<div style={this.getModalDivStyle()}>
					<TextBox 
						placeholder="table"
						value={this.props.table}
						onChange={this.onChangeTable} />
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
			if(tableText !== '' && item.toLowerCase().indexOf(tableText.toLowerCase()) === -1) return;

			var onClickFn = function() {
				this.props.onChange(item);
			}.bind(this);

			body.push(<ListItem key={item} name={item} onClick={onClickFn} />);
		});

		return (
			<div is="outer">
				{body}
			</div>
		);
	}
});


var ColumnConfigModal = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],
	jdbc: {},
	table: '',

	getDefaultProps() {
		return { 
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
		this.loadColumns();
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	loadColumns() {
		server.loadColumns(this.jdbc, this.table).then(function(columns) {
			this.setState({
				loadedColumnsStatus: 'loaded',
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			this.setState({ loadedColumnsStatus: 'failed' });
		}.bind(this));
	},

	onListChange(column) {
		column = column.columnName;

		var columns = this.props.columns.split(',').map(function(column) {
			return column.trim();
		});

		if(columns.indexOf(column) === -1) columns.push(column);
		else columns.remove(column);

		this.props.onChange(columns.join(','));
	},

	componentDidMount() {
		window.store.jdbc.listen(function(data) {
			this.jdbc = data;
		}.bind(this));
		window.store.table.listen(function(data) {
			this.table = data.table;
		}.bind(this))
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
					items={this.state.loadedColumns}
					onChange={this.props.onChange} />
			);
		}

		return (
			<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
				<Curtain />
				<div style={this.getModalDivStyle()}>
					<TextBox 
						placeholder="table"
						value={this.props.columns}
						onListChange={this.onListChange} />
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
		this.props.items.forEach(function(item) {
			var onClickFn = function() {
				this.props.onListChange(item);
			}.bind(this);

			var name = util.format('%s (%s)', item.columnName, item.columnType);
			body.push(<ListItem key={name} name={name} onClick={onClickFn} />);
		});

		return (
			<div is="outer">
				{body}
			</div>
		);
	}
});


module.exports = DatabaseConfigPanel;