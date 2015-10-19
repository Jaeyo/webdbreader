var React = require('react'),
	Layout = require('./comps/layout.jsx').Layout,
	Panel = require('./comps/panel.jsx').Panel,
	Btn = require('./comps/btn.jsx').Btn,
	DarkBlueBtn = require('./comps/btn.jsx').DarkBlueBtn,
	Clearfix = require('./comps/clearfix.jsx').Clearfix;

var store = {
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
			<div>
				<InputDatabasePanel />
			</div>
		);
	}
});

var InputDatabasePanel = React.createClass({
	next(evt) {
		//TODO
	},
	render() {
		return (
			<Panel>
				<Panel.HeadingWithIndicators glyphicon="console">input database</Panel.HeadingWithIndicators>
				<Panel.Body>
				</Panel.Body>
				<Panel.Footer>
					<span style={{ float: 'right' }}>
						<Btn onClick={this.next}>next</Btn>
					</span>
					<Clearfix />
				</Panel.Footer>
			</Panel>
		);
	}
});

React.render(
	<Layout active="script">
		<NewDb2FileView />
	</Layout>,
	document.body
);