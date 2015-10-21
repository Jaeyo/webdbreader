var React = require('react'),
	util = require('util'),
	color = require('../utils/util.js').color;

var STAGE_SIZE = 20;

var StageMap = React.createClass({
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
			height: STAGE_SIZE + 'px'
		};
		return (<div key={left} style={style}><Stage isActive={isActive} /></div>);
	},

	render() {
		if(this.props.stages.length < 2) return null;

		var outerDivStyle = {
			backgroundColor: color.darkBlue,
			position: 'relative',
			width: '100%',
			height: '100%'
		};

		var body = [];
		for(var i=0; i<this.props.stages.length; i++) {
			var left = null;
			if(i == 0) {
				left = '10%';
			} else if(i == this.props.stages.length-1) {
				left = '90%';
			} else {
				left = 80 / (this.props.stages.length-1) + 10 + '%';
			}

			body.push(this.makeStage(left, this.props.pos === i));

			var desc = this.props.stages[i];
			var descStyle = {
				display: 'inline-block',
				position: 'absolute',
				top: util.format('calc(40% + %spx)', STAGE_SIZE / 2),
				left: left,
				transform: 'translate(-50%, 0)',
				paddingTop: '3px',
				color: color.lightGray,
				fontSize: '70%'
			};
			body.push(
				<div key={this.props.stages[i]} style={descStyle}>
					{this.props.stages[i]}
				</div>
			);
		}

		return (
			<div style={outerDivStyle}>
				<Line />
				{body}
			</div>
		);
	}
});
exports.StageMap = StageMap;

var Line = React.createClass({
	render() {
		var style = {
			backgroundColor: color.lightGray,
			height: (STAGE_SIZE/3) + 'px',
			position: 'absolute',
			left: '10%',
			right: '10%',
			top: '40%',
			transform: 'translateY(-50%)'
		};

		return ( <div style={style} /> );
	}
});

var Stage = React.createClass({
	getDefaultProps() {
		return { isActive: false };
	},

	render() {
		var outerDivStyle = {
			width: STAGE_SIZE + 'px',
			height: STAGE_SIZE + 'px',
			borderRadius: '50%',
			backgroundColor: color.lightGray,
			position: 'relative',
			display: 'inline-block'
		};

		var innerDivStyle = {
			width: (STAGE_SIZE/2) + 'px',
			height: (STAGE_SIZE/2) + 'px', 
			borderRadius: '50%',
			backgroundColor: this.props.isActive === true ? color.darkBlue : color.lightGray,
			position: 'absolute',
			zIndex: '1',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			display: 'inline-block'
		};

		return (
			<div style={outerDivStyle}>
				<div style={innerDivStyle} />
			</div>
		);
	}
});