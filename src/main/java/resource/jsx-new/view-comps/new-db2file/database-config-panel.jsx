var React = require('react'),
	_ = require('underscore'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	SelectBox = require('../../comps/select-box.jsx').SelectBox,
	Panel = require('../../comps/panel.jsx').Panel,
	DarkBlueSmallBtn = require('../../comps/btn.jsx').DarkBlueSmallBtn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	LayerPopup = require('../../comps/layer-popup.jsx').LayerPopup,
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
	getInitialState() {
		return {
			dbVendor: 'oracle',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			columns: []
		};
	},

	onClickDbVendorBtn(evt) {
		this.refs.databaseConfigModal.show();
	},

	onDbVendorChange(evt) {
		var state = { dbVendor: evt.target.value };

		if(state.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.state.dbVendor];
			state.driver = tmpl.driver;
		}

		this.setState(state);
	},

	onDatabaseConfigModalChange(args) {
		if(this.state.dbVendor === 'etc') return;
		if(!args.ip) args.ip = '';
		if(!args.port) args.port = '';
		if(!args.sid) args.sid = '';
		var tmpl = jdbcTmpl[this.state.dbVendor];
		var connUrl = tmpl.connUrl.replace('{ip}', args.ip)
								.replace('{port}', args.port)
								.replace('{database}', args.sid);
		this.setState({ jdbcConnUrl: connUrl });
	},

	onTableConfigModalChange(table) {
		this.setState({ table: table });
	},

	onColumnConfigModalChange(column) {
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

	render() {
		var leftStyle = {
			width: '100px',
			float: 'left',
			textAligh: 'right',
			textSize: '90%'
		};

		var jdbcInfo = {
			driver: this.state.jdbcDriver,
			connUrl: this.state.jdbcConnUrl,
			username: this.state.jdbcUsername,
			password: this.state.jdbcPassword
		};

		return (
			<Panel>
				<Panel.SmallHeading glyphicon="cog">jdbc 설정</Panel.SmallHeading>
				<Panel.Body>
					<KeyValueLine label="데이터베이스">
						<SelectBox 
							values={[ 'oracle', 'mysql', 'mssql', 'db2', 'tibero', 'etc' ]} 
							value={this.state.dbVendor}
							onChange={this.onDbVendorChange} />
						<DarkBlueSmallBtn onClick={this.onClickDbVendorBtn}>설정</DarkBlueSmallBtn>
						<TextBox 
							placeholder="jdbc driver" 
							value={this.state.jdbcDriver} />
						<TextBox
							placeholder="jdbc connection url"
							value={this.state.jdbcConnUrl} />
						<TextBox
							placeholder="jdbc username"
							value={this.state.jdbcUsername} />
						<TextBox
							type="password"
							placeholder="jdbc password"
							value={this.state.jdbcPassword} />
					</KeyValueLine>
					<KeyValueLine label="테이블">
						<TextBox
							placeholder="table"
							value={this.state.table}
							onClick={this.onClickTableTextbox} />
					</KeyValueLine>
					<KeyValueLine label="컬럼">
						<TextBox
							placeholder="columns"
							value={this.state.columns.join(',')}
							onClick={this.onClickColumnTextbox} />
					</KeyValueLine>
				</Panel.Body>
				<DatabaseConfigModal 
					ref="databaseConfigModal"
					dbVendor={this.state.dbVendor}
					onChange={this.onDatabaseConfigModalChange} />
				<TableConfigModal 
					ref="tableConfigModal"
					jdbc={jdbc}
					table={this.state.table}
					onChange={this.onTableConfigModalChange} />
				<ColumnConfigModal 
					ref="columnConfigModal"
					jdbc={jdbc}
					columns={this.state.columns}
					onChange={this.onColumnConfigModalChange} />
			</Panel>
		);
	}
});

var DatabaseConfigModal = React.createClass({
	mixins: [ LayerPopup.modalMixin ],

	getDefaultProps() {
		return { 
			dbVendor: 'oracle',
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

	componentWillReceiveProps(nextProps) {
		if(this.props.dbVendor !== nextProps.dbVendor && nextProps.dbVendor !== 'etc') {
			this.setState({
				port: jdbcTmpl[nextProps.dbVendor].port
			});
		}
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

	render() {
		return (
			<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
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
	mixins: [ LayerPopup.modalMixin ],

	getDefaultProps() {
		return { 
			onChange: null,
			table: '',
			jdbc: {}
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
		this.setState({ table: evt.target.value });
	},

	show() {
		loadTables();
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	loadTables() {
		$.getJSON('/REST/Database/Tables/', this.props.jdbc)
		.fail(function(err) {
			console.error(err);
			this.setState({ loadedTablesStatus: 'fail' });
		}.bind(this)).done(function(resp) {
			if(resp.success !== 1) {
				console.error(resp);
				this.setState({ loadedTablesStatus: 'fail' });
				return;
			}
			this.setState({ 
				loadedTablesStatus: 'loaded',
				loadedTables: resp.tables
			});
		}.bind(this));
	},

	render() {
		var loadedTables = null;
		if(this.state.loadedTablesStatus === 'loading') {
			loadedTables = ( <div style={{ textAlign: 'center', padding: '10px', fontSize: '90%' }}>loading...</div> );
		} else if(this.state.loadedTablesStatus === 'failed') {
			loadedTables = ( <div style={{ textAlign: 'center', padding: '10px', fontSize: '90%' }}>load fail</div> );
		} else if(this.state.loadedTablesStatus === 'loaded') {
			loadedTables = (
				<TableList 
					items={this.state.loadedTables}
					onTableChange={this.props.onChange}
					tableText={this.props.table} />
			);
		}

		return (
			<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
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
	getDefaultProps() {
		return { 
			items: [],
			onTableChange: null,
			tableText: ''
		};
	},

	render() {
		var outer = {
			height: '100px',
			overflow: 'auto'
		};

		var body = [];
		this.props.items.forEach(function(item) {
			if(tableText !== '' && item.toLowerCase().indexOf(tableText.toLowerCase()) === -1) return;

			var onClickFn = function() {
				this.props.onTableChange(item);
			}.bind(this);

			body.push(<ListItem key={item} name={item} onClick={onClickFn} />);
		});

		return (
			<div style={outer}>
				{body}
			</div>
		);
	}
});


var ColumnConfigModal = React.createClass({
	mixins: [ LayerPopup.modalMixin ],

	getDefaultProps() {
		return { 
			onChange: null,
			columns: '',
			jdbc: {}
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
		$.getJSON(util.format('/REST/Database/Columns/%s/', this.selectedTableName), this.props.jdbc)
		.fail(function(err) {
			console.error(err);
			this.setState({ loadedColumnsStatus: 'failed' });
		}.bind(this)).done(function(resp) {
			if(resp.success !== 1) {
				console.error(resp);
				this.setState({ loadedColumnsStatus: 'failed' });
				return;
			}

			this.setState({
				loadedColumnsStatus: 'loaded',
				columns: resp.columns
			});
		}.bind(this));
	},

	render() {
		return (
			var loadedColumns = null;
			if(this.state.loadedColumnsStatus === 'loading') {
				loadedColumns = ( <div style={{ textAlign: 'center', padding: '10px', fontSize: '90%' }}>loading...</div> );
			} else if(this.state.loadedColumnsStatus === 'failed') {
				loadedColumns = ( <div style={{ textAlign: 'center', padding: '10px', fontSize: '90%' }}>load fail</div> );
			} else if(this.state.loadedColumnsStatus === 'loaded') {
				loadedColumns = (
					<ColumnList 
						items={this.state.loadedColumns}
						onColumnChange={this.props.onChange} />
				);
			}

			return (
				<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
					<Curtain />
					<div style={this.getModalDivStyle()}>
						<TextBox 
							placeholder="table"
							value={this.props.table}
							onChange={this.onChangeTable} />
						<hr />
						{loadedColumns}
						<DarkBlueSmallBtn onClick={this.hide}>ok</DarkBlueSmallBtn>
					</div>
				</div>
			);
		);
	}
});


var ColumnList = React.createClass({
	getDefaultProps() {
		return { 
			items: [],
			onColumnChange: null
		};
	},

	render() {
		return (
			var outer = {
				height: '100px',
				overflow: 'auto'
			};

			var body = [];
			this.props.items.forEach(function(item) {
				var onClickFn = function() {
					this.props.onColumnChange(item);
				}.bind(this);

				body.push(<ListItem key={item} name={item} onClick={onClickFn} />);
			});

			return (
				<div style={outer}>
					{body}
				</div>
			);
		);
	}
});


module.exports = DatabaseConfigPanel;