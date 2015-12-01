var React = require('react'),
	ReactCSS = require('reactcss'),
	util = require('util'),
	jsUtil = require('../utils/util.js'),
	color = jsUtil.color,
	boxShadow = jsUtil.boxShadow;

var STAGE_SIZE = 20;

var StageMap = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			stages: [],
			pos: 0
		};
	},

	makeStage(left, isActive) {
		var style = {
			display: 'inline-block',
			position: 'absolute',
			top: '40%',
			left: left,
			transform: 'translate(-50%, -50%)',
			height: STAGE_SIZE + 'px',
			boxShadow: boxShadow.default
		};
		return (<div key={left} style={style}><Stage isActive={isActive} /></div>);
	},

	classes() {
		return {
			'default': {
				outer: {
					backgroundColor: color.darkBlue,
					position: 'relative',
					width: '100%',
					height: '100%'
				},
				desc: {
					display: 'inline-block',
					position: 'absolute',
					top: util.format('calc(40% + %spx)', STAGE_SIZE / 2),
					left: left,
					transform: 'translate(-50%, 0)',
					paddingTop: '3px',
					color: color.lightGray,
					fontSize: '70%'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		if(this.props.stages.length < 2) return null;

		var body = [];
		for(var i=0; i<this.props.stages.length; i++) {
			var left = null;
			if(i == 0) {
				left = '10%';
			} else if(i == this.props.stages.length-1) {
				left = '90%';
			} else {
				left = ((80 / (this.props.stages.length-1)) * i) + 10 + '%';
			}

			body.push(this.makeStage(left, this.props.pos === i));

			var desc = this.props.stages[i];
			body.push( <div key={desc} is="desc">{desc}</div> );
		}

		return (
			<div is="outer">
				<Line />
				{body}
			</div>
		);
	}
});
exports.StageMap = StageMap;

var Line = React.createClass({
	mixins: [ ReactCSS.mixin ],

	classes() {
		return {
			'default': {
				outer: {
					backgroundColor: color.lightGray,
					height: (STAGE_SIZE/3) + 'px',
					position: 'absolute',
					left: '10%',
					right: '10%',
					top: '40%',
					transform: 'translateY(-50%)',
					boxShadow: boxShadow.default
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return ( <div is="outer" /> );
	}
});

var Stage = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { isActive: false };
	},

	classes() {
		return {
			'default': {
				outer: {
					width: STAGE_SIZE + 'px',
					height: STAGE_SIZE + 'px',
					borderRadius: '50%',
					backgroundColor: color.lightGray,
					position: 'relative',
					display: 'inline-block',
					boxShadow: boxShadow.default
				},
				inner: {
					width: (STAGE_SIZE/2) + 'px',
					height: (STAGE_SIZE/2) + 'px', 
					borderRadius: '50%',
					backgroundColor: color.lightGray,
					position: 'absolute',
					zIndex: '1',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					display: 'inline-block'
				}
			},
			'isActive-true': {
				inner: {
					backgroundColor: 'color.darkBlue',
					boxShadow: boxShadow.default
				}
			},
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<div is="inner" />
			</div>
		);
	}
});