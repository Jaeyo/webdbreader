var React = require('react'),
	ReactCSS = require('reactcss'),
	util = require('util'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var PAGE_WIDTH = '1024px';
var NAV_WIDTH = '100px';
var CONTENTS_WIDTH = (1024-100) + 'px';

var Layout = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			active: 'script'
		};
	},

	classes() {
		return {
			'default': {
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
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<div is="innerDiv">
					<Nav active={this.props.active} />
					<Container>{this.props.children}</Container>
				</div>
			</div>	
		);
	}
});
exports.Layout = Layout;

var Nav = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			active: 'script'
		};
	},

	classes() {
		return {
			'default': {
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
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<div is="innerDiv">
					<Nav.Btn gly="console" name="script" href="/" isActive={this.props.active === 'script'} />
					<Nav.Btn gly="cog" name="config" href="/TODO" isActive={this.props.active === 'config'} />
					<Nav.Btn gly="modal-window" name="api" href="/Api" isActive={this.props.active === 'api'} />
				</div>
			</div>
		);
	}
});
Nav.Btn = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			gly: '',
			name: '',
			href: '',
			isActive: false
		};
	},

	getInitialState() {
		return {
			isActive: this.props.isActive
		}
	},

	onMouseOver() {
		if(this.props.isActive === false)
			this.setState({ isActive: true });
	},

	onMouseOut() {
		if(this.props.isActive === false)
			this.setState({ isActive: false });
	},


	classes() {
		return {
			'default': {
				a: {
					textDecoration: 'none'
				},
				div: {
					margin: '30px 0 30px 0',
					padding: '15px',
					textAlign: 'center'		
				},
				glydiv: {
					fontSize: '180%'
				},
				nameDiv: {
					fontSize: '90%'
				}
			}, 
			'isActive-true': {
				div: {
					backgroundColor: color.contentsBackground,
					color: color.darkBlue
				}
			},
			'isActive-false': {
				div: {
					color: 'white'
				}
			}
		}
	},

	styles() {
		return this.css({
			'isActive-true': this.state.isActive
		});
	},

	render() {
		return (
			<a href={this.props.href} is="a">
				<div is="div"
					onMouseOver={this.onMouseOver}
					onMouseOut={this.onMouseOut}>
					<div is="glydiv">
						<span className={'glyphicon glyphicon-' + this.props.gly} />
					</div>
					<div is="nameDiv">
					 	{this.props.name}
					 </div>
				</div>
			</a>
		);
	}
});
exports.Nav = Nav;

var Container = React.createClass({
	mixins: [ ReactCSS.mixin ],

	classes() {
		return {
			'default': {
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
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<div is="innerDiv">
					{this.props.children}
				</div>
			</div>
		);
	}
});
exports.Container = Container;