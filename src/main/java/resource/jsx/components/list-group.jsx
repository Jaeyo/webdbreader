var React = require('react');

var ListGroup = React.createClass({
	render() {
		return (
			<ul className="list-group">
				{this.props.children}
			</ul>
		);
	}
});

ListGroup.Item = React.createClass({
	render() {
		return (
			<li className="list-group-item">
				{this.props.children}
			</li>
		);
	}
});

exports.ListGroup = ListGroup;