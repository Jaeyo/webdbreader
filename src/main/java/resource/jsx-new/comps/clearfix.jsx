var React = require('react');

var Clearfix = React.createClass({
	render() {
		return (
			<div 
				style={{
					content: '',
					display: 'table',
					clear: 'both'
				}} />
		);
	}
});

exports.Clearfix = Clearfix;