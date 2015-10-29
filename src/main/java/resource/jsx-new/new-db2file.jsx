var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx');


window.store = {};
[ 'dbVendor', 'jdbc', 'table' ].forEach(function(action) {
	window.store[action] = {
		storedData: {},
		listeners: [],
		listen(listener) {
			this.listeners.push(listener);
			listener(this.storedData);
		},
		dispatch(data) {
			this.storedData = _.extend(this.storedData, data);
			this.listeners.forEach(function(listener) {
				listener(this.storedData);
			});
		}
	};
});

window.store.dbVendor.storedData = { dbVendor: 'oracle' };
window.store.jdbc.storedData = { 
	ip: 'localhost',
	port: '1521',
	sid: '',
	driver: 'oracle.jdbc.driver.OracleDriver',
	connUrl: 'jdbc:oracle:thin:@localhost:1521:',
	username: '',
	password: ''
};
window.store.table.storedData = { table: '' };



var NewDb2FileView = React.createClass({
	render() {
		return (
			<BuilderView visible={true} />
		);
	}
});


var BuilderView = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { visible: false };
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
				<DatabaseConfigPanel />
				<BindingTypePanel />
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