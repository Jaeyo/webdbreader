var React = require('react'),
	Panel = require('./components/panel.jsx').Panel;

var store = {
	listeners: [],
	dispatch(type, data) {
		this.listener.forEach(function(listener) {
			listener(type, data);
		});
	},
	listen(listener) {
		this.listeners.push(listener);
	}
};

var BtnArea = React.createClass({
	getInitialState() {
		return {
			isRunning: false,
			isLoaded: false
		};
	},
	render() {
		return (
			<div className="btn-area">
				<button 
			</div>
		);
	}
});