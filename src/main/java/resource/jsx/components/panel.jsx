var React = require('react');

var Panel = React.createClass({
	getDefaultProps() {
		return {
			className: '',
		};
	},

	render() {
		return (
			<div className={'panel panel-default ' + this.props.className}>
				{this.props.children}
			</div>	
		);
	}
});

Panel.Heading = React.createClass({
	getDefaultProps() {
		return {
			glyphicon: ''
		};
	},

	render() {
		return (
			<div className="panel-heading">
				<span className={'glyphicon glyphicon-' + this.props.glyphicon} />
				<span>{this.props.children}</span>
			</div>
		);
	}
});

Panel.Body = React.createClass({
	render() {
		return (
			<div className="panel-body">{this.props.children}</div>
		);
	}
});

exports.Panel = Panel;