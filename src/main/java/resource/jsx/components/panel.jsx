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


Panel.HeadingWithIndicators = React.createClass({
	getDefaultProps() {
		return {
			glyphicon: '',
			style: {},
			indicatorTotal: 0,
			indicatorCurrent: 0
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
				<div style={{ float: 'right' }}>
					<StageIndicator 
						total={this.props.indicatorTotal}
						current={this.props.indicatorCurrent} />
				</div>
			</div>
		);
	}
});

var StageIndicator = React.createClass({
	getDefaultProps() {
		return {
			total: 0,
			current: 0
		}
	},

	render() {
		var indicators = [];
		for(var i=1; i<=this.props.total; i++) {
			var style = {
				display: 'inline-block',
				width: '10px',
				height: '10px',
				borderRadius: '100%',
				opacity: '0.5',
				margin: '0 2px 0 2px'
			}
			if(i === this.props.current) {
				style.background: 'black';
			} else { 
				style.background: 'gray';
			}
			indicators.push(<span style={indicators} />);
		}
		return (
			<div>{indicators}</div>
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


Panel.Footer = React.createClass({
	getDefaultProps() {
		return {
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
				{this.props.children}
			</div>
		);
	}
});

exports.Panel = Panel;