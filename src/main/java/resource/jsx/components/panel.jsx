var React = require('react'),
	util = require('../util/util.js'),
	_ = require('underscore');

var color = {
	lightBlue: util.color('light-blue'),
	lightGray: util.color('light-gray')
};

var Panel = React.createClass({
	getDefaultProps() {
		return {
			className: '',
			style: {}
		};
	},

	render() {
		return (
			<div 
				className={this.props.className}
				style={_.extend({
					border: '1px solid ' + color.lightGray
				}, this.props.style)}>
				{this.props.children}
			</div>	
		);
	}
});

Panel.Heading = React.createClass({
	getDefaultProps() {
		return {
			glyphicon: '',
			style: {}
		};
	},

	render() {
		return (
			<div 
				style={_.extend({
					padding: '10px',
					backgroundColor: color.lightBlue,
					color: 'white'
				}, this.props.style)}>
				<span 
					className={'glyphicon glyphicon-' + this.props.glyphicon}
					style={{ marginRight: '10px' }} />
				<span>{this.props.children}</span>
			</div>
		);
	}
});

Panel.Body = React.createClass({
	getDefaultProps() {
		return {
			style: {}
		};
	},

	render() {
		return (
			<div
				style={_.extend({ padding: '15px' }, this.props.style)}>
				{this.props.children}
			</div>
		);
	}
});

exports.Panel = Panel;