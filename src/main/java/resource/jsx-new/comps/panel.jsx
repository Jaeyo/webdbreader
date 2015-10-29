var React = require('react'),
	ReactCSS = require('reactcss'),
	color = require('../utils/util.js').color,
	_ = require('underscore');

var Panel = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			className: '',
			style: {}
		};
	},

	classes() {
		return {
			'default': {
				div: _.extend({
					border: '1px solid ' + color.lightGray
				}, this.props.style)
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div 
				className={this.props.className}
				is="div">
				{this.props.children}
			</div>	
		);
	}
});
exports.Panel = Panel;

Panel.Heading = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { glyphicon: '', style: {} };
	},

	classes() {
		return {
			'default': {
				div: _.extend({
					padding: '10px',
					backgroundColor: color.darkBlue,
					color: 'white'
				}, this.props.style),
				span: {
					marginRight: '10px'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="div">
				<span className={'glyphicon glyphicon-' + this.props.glyphicon} is="span" />
				<span>{this.props.children}</span>
			</div>
		);
	}
});


Panel.SmallHeading = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { glyphicon: '', style: {} };
	},

	classes() {
		return {
			'default': {
				Heading: {
					padding: '5px',
					fontSize: '90%'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (<Panel.Heading glyphicon={this.props.glyphicon} is="Heading">{this.props.children}</Panel.Heading>);
	}
});


Panel.HeadingWithIndicators = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			glyphicon: '',
			style: {},
			indicatorTotal: 0,
			indicatorCurrent: 0
		};
	},

	classes() {
		return {
			'default': {
				outer: _.extend({
					padding: '10px',
					backgroundColor: color.darkBlue,
					color: 'white'
				}, this.props.style),
				glySpan: {
					marginRight: '10px'
				},
				stageIndicatorDiv: {
					float: 'right'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<span 
					className={'glyphicon glyphicon-' + this.props.glyphicon}
					is="glySpan" />
				<span>{this.props.children}</span>
				<div is="stageIndicatorDiv">
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
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			style: {}
		};
	},

	classes() {
		return {
			'default': {
				outer: _.extend({
					padding: '15px'
				}, this.props.style)
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				{this.props.children}
			</div>
		);
	}
});


Panel.Footer = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			style: {}
		};
	},

	classes() {
		return {
			'default': {
				outer: _.extend({
					padding: '10px',
					backgroundColor: color.darkBlue,
					color: 'white'
				}, this.props.style)
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				{this.props.children}
			</div>
		);
	}
});