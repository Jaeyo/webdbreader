var React = require('react');
var util = require('util');
var _ = require('underscore');
var color = require('../utils/util.js').color;
var Glyphicon = require('react-bootstrap').Glyphicon;

var PAGE_WIDTH = '1024px';
var NAV_WIDTH = '100px';
var CONTENTS_WIDTH = (1024-100) + 'px';

var Layout = React.createClass({
	getDefaultProps() {
		return {
			active: 'script'
		};
	},

	styles() {
		return {
			outer: _.extend({
				height: '100%',
				width: '100%'
			}, color.background),
			innerDiv: {
				marginLeft: 'auto',
				marginRight: 'auto',
				height: '100%',
				width: PAGE_WIDTH
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<div style={style.outer}>
				<div style={style.innerDiv}>
					<Nav active={this.props.active} />
					<Container>{this.props.children}</Container>
				</div>
			</div>	
		);
	}
});
exports.Layout = Layout;

var Nav = React.createClass({
	PropTypes: {
		active: React.PropTypes.string.isRequired
	},

	styles() {
		return {
			outer: {
				float: 'left', 
				width: NAV_WIDTH,
				height: '100%',
				position: 'relative'
			},
			innerDiv: {
				position: 'absolute',
				top: '50%',
				right: '0',
				transform: 'translateY(-50%)'
			}
		}
	},

	render() {
		var style = this.styles();

		return (
			<div style={style.outer}>
				<div style={style.innerDiv}>
					<Nav.Btn gly="console" name="script" href="/" isActive={this.props.active === 'script'} />
					<Nav.Btn gly="cog" name="config" href="/TODO" isActive={this.props.active === 'config'} />
					<Nav.Btn gly="modal-window" name="api" href="/Api" isActive={this.props.active === 'api'} />
				</div>
			</div>
		);
	}
});

Nav.Btn = React.createClass({
	PropTypes: {
		gly: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired,
		href: React.PropTypes.string.isRequired,
		isActive: React.PropTypes.bool.isRequired
	},

	getInitialState() {
		return {
			isActive: this.props.isActive
		}
	},

	handleMouseOver(action, evt) {
		if(action === 'over') {
			if(this.props.isActive === false)
				this.setState({ isActive: true });
		} else if(action === 'out') {
			if(this.props.isActive === false)
				this.setState({ isActive: false });
		}
	},

	styles() {
		return {
			a: {
				textDecoration: 'none'
			},
			div: {
				margin: '30px 0 30px 0',
				padding: '15px',
				textAlign: 'center',
				backgroundColor: this.state.isActive === true ? color.contentsBackground : 'inherit',
				color: this.state.isActive === true ? color.darkBlue : 'white'
			},
			glydiv: {
				fontSize: '180%'
			},
			nameDiv: {
				fontSize: '90%'
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<a href={this.props.href} style={style.a}>
				<div style={style.div}
					onMouseOver={this.handleMouseOver.bind(this, 'over')}
					onMouseOut={this.handleMouseOver.bind(this, 'out')}>
					<div style={style.glydiv}>
						<Glyphicon glyph={this.props.gly} />
					</div>
					<div style={style.nameDiv}>
					 	{this.props.name}
					 </div>
				</div>
			</a>
		);
	}
});

var Container = React.createClass({
	styles() {
		return {
			outer: {
				float: 'left', 
				padding: '15px 15px 15px 0',
				width: CONTENTS_WIDTH,
				height: '100%'
			},
			innerDiv: {
				backgroundColor: color.contentsBackground,
				width: '100%',
				height: '100%',
				overflow: 'auto',
				padding: '15px'
			}
		};
	},

	render() {
		var style = this.styles();

		return (
			<div style={style.outer}>
				<div style={style.innerDiv}>
					{this.props.children}
				</div>
			</div>
		);
	}
});