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
					dbVendor={this.props.dbVendor}
					dbIp={this.props.dbIp}
					dbPort={this.props.dbPort}
					dbSid={this.props.dbSid}
					onChange={this.props.onChange} />
				<TableConfigModal 
					ref="tableConfigModal"
					jdbcDriver={this.props.jdbcDriver}
					jdbcConnUrl={this.props.jdbcConnUrl}
					jdbcUsername={this.props.jdbcUsername}
					jdbcPassword={this.props.jdbcPassword}
					table={this.props.table}
					onChange={this.props.onChange} />
				<ColumnConfigModal 
					ref="columnConfigModal"
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
											.replace('{sid}', this.props.dbSid);
		}

		this.props.onChange(state);
	},

	onPortChange(evt) {
		var state = { dbPort: evt.target.value };

		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
											.replace('{port}', state.dbPort)
											.replace('{sid}', this.props.dbSid);
		}

		this.props.onChange(state);
	},

	onSidChange(evt) {
		var state = { dbSid : evt.target.value };

		if(this.props.dbVendor !== 'etc') {
			var tmpl = jdbcTmpl[this.props.dbVendor];
			state.jdbcConnUrl = tmpl.connUrl.replace('{ip}', this.props.dbIp)
											.replace('{port}', this.props.dbPort)
											.replace('{sid}', state.dbSid);
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


var TableColumnConfigModal = {
	clazz: React.createClass({
		mixins: [ modalMixin, ReactCSS.mixin ],

		getDefaultProps() {
			return {
				jdbcDriver: '',
				jdbcConnUrl: '',
				jdbcUsername: '',
				jdbcPassword: '',
				table: '',
				columns: '',
				onChange: null,
				hide: null
			};
		},

		getInitialState() {
			return {
				loadingTableStatus: 'loading', // loading / failed / loaded
				loadedTables: [],
				loadingTableDataStatus: 'none', // none / loading / failed / loaded
				loadedColumns: [],
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
				console.error(err);
				this.setState({ loadingTableStatus: 'failed' });
				if(typeof err !== 'string') err = JSON.stringify(err);
				//TODO layer popup alert error
				alert(err);
			}.bind(this));
		},


		loadTableData() {
			//TODO
		},

		classes() {
			return {
				'default': {
					outer: _.extend(this.getModalDivStyle(), {
						width: '510px',
						height: '300px',
						position: 'relative'
					}),
					tableArea: {
						position: 'absolute',
						top: '10px',
						right: '310px',
						bottom: '10px',
						left: '10px'
					}, 
					columnArea: {
						position: 'absolute',
						top: '10px',
						right: '10px',
						bottom: '10px',
						left: '210px'
					}
				}
			}
		},

		styles() {
			return this.css();
		},

		onTableChange(evt) {
			this.props.onChange({ table: evt.target.value });
		},

		onColumnsChange(evt) {
			this.props.onChange({ columns: evt.target.value });
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
					this.props.loadedTables.forEach(function(table) {
						if(this.props.table !== '' && this.props.table.toLowerCase().indexOf(table.toLowerCase()) !== -1) return;

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
			switch(this.state.loadingColumnsStatus) {
			case 'none':
				return null;
			case 'loading':
				return (<Loading type="bubbles" color="#e4e4e4" />);
			case 'failed':
				return (<label>failed</label>);
			case 'loaded':
				var th = [];
				this.state.loadedColumns.forEach(function(loadedColumn) {
					th.push(
						<this.columnListItem 
							type="th" 
							msg={loadedColumn.columnName} 
							inColumn={loadedColumn.columnName}
							columns={this.props.columns} 
							onChange={this.props.onChange} />
					);
				}.bind(this));
				var thead = (<tr>{th}</tr>);

				var tbody = [];
				this.state.loadedTableData.forEach(function(tableRowData) {
					var td = [];
					Object.keys(tableRowData).forEach(function(column) {
						var data = tableRowData[column];
						td.push(
							<this.columnListItem
								msg={data}
								inColumn={column}
								columns={this.props.columns}
								onChange={this.props.onChange} />
						);
					}.bind(this));
					tbody.push(<tr>{td}</tr>);
				}.bind(this));

				return (
					<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
						<table>
							<thead>{thead}</thead>
							<tbody>{tbody}</tbody>
						</table>
					</div>
				);
			}
		},

		columnListItem: React.createClass({
			getDefaultProps() {
				return {
					type: 'td',
					msg: '',
					inColumn: '',
					columns: '',
					onChange: null
				};
			},
			getInitialState() {
				return { isMouseOver: false };
			},
			onClick(evt) {
				//TODO
			},
			onMouseOver(evt) {
				this.setState({ isMouseOver: true });
			},
			onMouseOut(evt) {
				this.setState({ isMouseOver: false });
			},
			render() {
				var isSelected = columns.toLowerCase().split(',').indexOf(inColumn.toLowerCase()) !== -1;

				var props = {
					onClick: this.onClick,
					onMouseOver: this.onMouseOver,
					onMouseOut: this.onMouseOut,
					style: isSelected === true ? {
						backgroundColor: color.lightGray
					} : {}
				};

				//TODO apply hover action...  시발

				switch(this.props.type) {
					case 'td':
						return (<td {...props}>{this.props.msg}</td>);
					case 'th':
						return (<th {...props}>{this.props.msg}</th>);
				}
			}
		}),

		render() {
			return (
				<div>
					<Curtain onClick={this.props.hide} />
					<div is="modal">
						<div is="tableArea">
							<div>
								<TextBox placeholder="table" value={this.props.table} onChange={this.onTableChange} />
								<DarkBlueSmallBtn onClick={this.loadTableData}>테이블 로드</DarkBlueSmallBtn>
							</div>
							{this.renderTableList()}
						</div>
						<div is="columnArea">
							<div>
								<TextBox placeholder="columns" value={this.props.columns} onChange={this.onColumnsChange} />
							</div>
							{this.renderColumnList()}
						</div>
					</div>
				</div>
			);
		}
 	}),
	layer: null,
	show(props) {
		props = _.extend(props, {
			hide: this.hide
		});

		this.layer = new Layer(document.body, function() {
			return (<this.clazz {...props} />);
		}.bind(this));

		this.layer.render();
	},
	hide() {
		this.layer.destroy();
		this.layer = null;
	}
};




var TableColumnConfigModal = React.createClass({

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
				},
				tableListOuter: {
					height: '150px',
					overflow: 'auto'
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
			var tableArr = [];
			this.state.loadedTables.forEach(function(table) {
				if(this.props.table !== '' && table.toLowerCase().indexOf(this.props.table.toLowerCase()) === -1) return;
				var onClick = function() {
					this.props.onChange({ table: table });
				}.bind(this);
				tableArr.push(<ListItem key={table} name={table} onClick={onClick} />);
			}.bind(this));
			loadedTables = (
				<div is="tableListOuter">{tableArr}</div>
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

	onColumnTextChange(evt) {
		this.props.onChange({ columns: evt.target.value });
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
			var columnArr = [];
			var selectedColumns = this.props.columns.split(',');
			this.props.columns.forEach(function(columnItem) {
				var name = util.format('%s (%s)', columnItem.columnName, columnItem.columnType);

				var onClick = function() {
					if(selectedColumns.indexOf(columnItem.columnName) !== -1) selectedColumns.remove(columnItem.columnName);
					else selectedColumns.push(columnItem.columnName);
					this.props.onChange({ columns: selectedColumns.join(',') });
				}.bind(this);

				columnArr.push(
					<ListItem 
						key={name} 
						name={name} 
						onClick={onClick}
						isSelected={selectedColumns.indexOf(columnItem.columnName) !== -1} />
				);

			}.bind(this));
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
module.exports = DatabaseConfigPanel;