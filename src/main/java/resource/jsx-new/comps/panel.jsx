var React = require('react'),
	color = require('../utils/util.js').color,
	_ = require('underscore');

var Panel = React.createClass({
	getDefaultProps() {
		return {
			className: '',
			style: {}
		};
	},

	render() {
		var divStyle = _.extend({ border: '1px solid ' + color.lightGray }, this.props.style);

		return (
			<div className={this.props.className}
				style={divStyle}>
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
		var divStyle = _.extend({ 
			padding: '10px',
			backgroundColor: color.lightBlue,
			color: 'white'
		}, this.props.style);

		var spanStyle = { marginRight: '10px' };

		return (
			<div style={divStyle}>
				<span className={'glyphicon glyphicon-' + this.props.glyphicon}
					style={spanStyle} />
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
		var outerDivStyle = _.extend({
			padding: '10px',
			backgroundColor: color.lightBlue,
			color: 'white'
		}, this.props.style);
		var glySpanStyle = { marginRight: '10px' };
		var stageIndicatorDivStyle = { float: 'right' };

		return (
			<div style={outerDivStyle}>
				<span className={'glyphicon glyphicon-' + this.props.glyphicon}
					style={glySpanStyle} />
				<span>{this.props.children}</span>
				<div style={stageIndicatorDivStyle}>
					<StageIndicator total={this.props.indicatorTotal}
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
			indicators.push(
				<span style={_.extend({
					display: 'inline-block',
					width: '10px',
					height: '10px',
					borderRadius: '100%',
					opacity: '0.5',
					margin: '0 2px 0 2px'			
				}, i === this.props.current ? {
					background: 'black'
				} : {
					background: 'gray'
				})} />);
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
			<div style={_.extend({ padding: '15px' }, this.props.style)}>
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
		var outerDivStyle = _.extend({
			padding: '10px',
			backgroundColor: color.lightBlue,
			color: 'white'
		}, this.props.style);

		return (
			<div style={outerDivStyle}>
				{this.props.children}
			</div>
		);
	}
});

exports.Panel = Panel;