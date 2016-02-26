import React from 'react';

var Filter = React.createClass({
	PropTypes: {
		test: React.PropTypes.bool.isRequired
	},

	render() {
		try {
			var { props } = this;
			if(props.test === true) return props.children;
			else return [];
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = Filter;