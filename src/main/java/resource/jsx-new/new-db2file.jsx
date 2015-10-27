var React = require('react'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	TextBox = require('./comps/textbox.jsx').TextBox,
	SelectBox = require('./comps/select-box.jsx').SelectBox,
	Panel = require('./comps/panel.jsx').Panel,
	DarkBlueSmallBtn = require('./comps/btn.jsx').DarkBlueSmallBtn,
	Clearfix = require('./comps/clearfix.jsx').Clearfix,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup;

window.store = {
	actions: {
	},
	listeners: [],
	listen(listener) {
		this.listeners.push(listener);
	},
	dispatch(action, data) {
		this.listeners.forEach(function(listener) {
			listener(action, data);
		});
	}
};


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


var NewDb2FileView = React.createClass({
	render() {
		return (
			<BuilderView />
		);
	}
});


var BuilderView = React.createClass({
	getDefaultProps() {
		return { visible: false };
	},

	render() {
		var outer = { display: this.props.visible === true ? 'block' : 'none' };

		return (
			<div style={outer}>
				<h3>database 설정</h3>
				<JdbcConfigPanel />
			</div>
		);
	}
});


var JdbcConfigPanel = React.createClass({
	getInitialState() {
		return {
			dbVendor: 'oracle',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: ''
		};
	},

	configureDatabase() {
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

	render() {
		var leftStyle = {
			width: '100px',
			float: 'left',
			textAligh: 'right',
			textSize: '90%'
		};

		return (
			<Panel>
				<Panel.SmallHeading glyphicon="cog">jdbc 설정</Panel.SmallHeading>
				<Panel.Body style={{ position: 'relative' }}>
					<KeyValueLine label="데이터베이스">
						<SelectBox 
							values={[ 'oracle', 'mysql', 'mssql', 'db2', 'tibero', 'etc' ]} 
							value={this.state.dbVendor}
							onChange={this.onDbVendorChange} />
						<DarkBlueSmallBtn onClick={this.configureDatabase}>설정</DarkBlueSmallBtn>
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
				</Panel.Body>
				<DatabaseConfigModal 
					ref="databaseConfigModal"
					dbVendor={this.state.dbVendor}
					onChange={this.onDatabaseConfigModalChange} />
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


var KeyValueLine = React.createClass({
	getDefaultProps() {
		return { label: '' };
	},

	render() {
		var leftStyle = {
			float: 'left',
			wkdth: '100px',
			textAlign: 'right'
		};
		var rightStyle = {
			float: 'left'
		};

		return (
			<div>
				<div style={leftStyle}>{this.props.label}</div>
				<div style={rightStyle}>{this.props.children}</div>
				<Clearfix />
			</div>
		);
	}
});


React.render(
	<Layout active="script">
		<NewDb2FileView />
		<LayerPopup />
	</Layout>,
	document.body
);