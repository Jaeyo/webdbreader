var React = require('react'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	DatabaseConfigPanel = require('./view-comps/new-db2file/database-config-panel.jsx'),
	BindingTypePanel = require('./view-comps/new-db2file/binding-type-panel.jsx');


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