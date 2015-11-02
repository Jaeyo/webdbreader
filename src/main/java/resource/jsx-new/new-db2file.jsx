var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx');


var NewDb2FileView = React.createClass({
	getInitialState() {
		return {
			dbVendor: 'oracle',
			dbIp: 'localhost',
			dbPort: '1521'
			dbSid: '',
			jdbcDriver: 'oracle.jdbc.driver.OracleDriver'
			jdbcConnUrl: 'jdbc:oracle:thin:@localhost:1521:',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			columns: ''
		};
	},

	onChange(args) {
		this.setState(args);
	},

	render() {
		return (
			<BuilderView visible={true} onChange={this.onChange} />
		);
	}
});


var BuilderView = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { 
			visible: false,
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
		return (
			<div is="outer">
				<h3 is="header">database 설정</h3>
				<DatabaseConfigPanel onChange={this.props.onChange} TODO props />
				<BindingTypePanel onChange={this.props.onChange} />
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