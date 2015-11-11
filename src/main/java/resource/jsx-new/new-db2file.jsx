var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx');

jsUtil.initPrototypeFunctions();

var NewDb2FileView = React.createClass({
	getInitialState() {
		return {
			dbVendor: 'oracle',
			dbIp: '192.168.10.101',
			dbPort: '1521',
			dbSid: 'spiderx',
			jdbcDriver: 'oracle.jdbc.driver.OracleDriver',
			jdbcConnUrl: 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx',
			jdbcUsername: 'admin_test',
			jdbcPassword: 'admin_test',
			table: '',
			columns: '',
			bindingType: 'simple',
			bindingColumn: ''
		};
	},

	onChange(args) {
		this.setState(args);
	},

	render() {
		return (
			<BuilderView visible={true} onChange={this.onChange} {...this.state} />
		);
	}
});


var BuilderView = React.createClass({
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
			visible: false,
			bindingType: '',
			bindingColumn: '',
			onChange: null
		};
	},

	classes() {
		return {
			'default': {
				header: {
					marginBottom: '25px'
				},
				outer: {
					display: this.props.visible === true ? 'block' : 'none'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var dbConfigPanelParams = {
			dbVendor: this.props.dbVendor,
			dbIp: this.props.dbIp,
			dbPort: this.props.dbPort,
			dbSid: this.props.dbSid,
			jdbcDriver: this.props.jdbcDriver,
			jdbcConnUrl: this.props.jdbcConnUrl,
			jdbcUsername: this.props.jdbcUsername,
			jdbcPassword: this.props.jdbcPassword,
			table: this.props.table,
			columns: this.props.columns,
			onChange: this.props.onChange
		};

		var bindingTypePanelParams = {
			bindingType: this.props.bindingType,
			bindingColumn: this.props.bindingColumn,
			jdbcDriver: this.props.jdbcDriver,
			jdbcConnUrl: this.props.jdbcConnUrl,
			jdbcUsername: this.props.jdbcUsername,
			jdbcPassword: this.props.jdbcPassword,
			table: this.props.table,
			onChange: this.props.onChange
		};

		return (
			<div is="outer">
				<h3 is="header">database 설정</h3>
				<DatabaseConfigPanel {...dbConfigPanelParams} />
				<BindingTypePanel {...bindingTypePanelParams} />
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