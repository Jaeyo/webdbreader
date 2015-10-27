var React = require('react'),
	util = require('util'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var PAGE_WIDTH = '1024px';
var NAV_WIDTH = '100px';
var CONTENTS_WIDTH = (1024-100) + 'px';

var Layout = React.createClass({
	getDefaultProps() {
		return {
			active: 'script'
		};
	},

	render() {
		var outerDivStyle = _.extend({
			height: '100%',
			width: '100%',
		}, color.background);

		var innerDivStyle = {
			marginLeft: 'auto',
			marginRight: 'auto',
			height: '100%',
			width: PAGE_WIDTH
		};

		return (
			<div style={outerDivStyle}>
				<div style={innerDivStyle}>
					<Nav active={this.props.active} />
					<Container>{this.props.children}</Container>
				</div>
			</div>	
		);
	}
});
exports.Layout = Layout;

var Nav = React.createClass({
	getDefaultProps() {
		return {
			active: 'script'
		};
	},

	render() {
		var outerDivStyle = {
			float: 'left', 
			width: NAV_WIDTH,
			height: '100%',
			position: 'relative'
		};

		var innerDivStyle = {
			position: 'absolute',
			top: '50%',
			right: '0',
			transform: 'translateY(-50%)'
		};

		return (
			<div style={outerDivStyle}>
				<div style={innerDivStyle}>
					<Nav.Btn gly="console" name="script" href="/" isActive={this.props.active === 'script'} />
					<Nav.Btn gly="cog" name="config" href="/TODO" isActive={this.props.active === 'config'} />
					<Nav.Btn gly="modal-window" name="api" href="/Api" isActive={this.props.active === 'api'} />
				</div>
			</div>
		);
	}
});
Nav.Btn = React.createClass({
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
	render() {
		var aStyle = { textDecoration: 'none' }		;
		var divStyle = _.extend({
			margin: '30px 0 30px 0',
			padding: '15px',
			textAlign: 'center'		
		}, this.state.isActive === true ? {
			backgroundColor: color.transparentWhite,
			color: color.darkBlue,
		} : {
			color: 'white'
		});
		var glyDivStyle = { fontSize: '180%' };
		var nameDivStyle = { fontSize: '90%' };

		return (
			<a href={this.props.href}
				style={aStyle}>
				<div onMouseOver={this.onMouseOver}
					onMouseOut={this.onMouseOut}
					style={divStyle}>
					<div style={glyDivStyle}>
						<span className={'glyphicon glyphicon-' + this.props.gly} />
					</div>
					<div style={nameDivStyle}>
					 	{this.props.name}
					 </div>
				</div>
			</a>
		);
	}
});
exports.Nav = Nav;

var Container = React.createClass({
	render() {
		var outerDivStyle = {
			float: 'left', 
			padding: '15px 15px 15px 0',
			width: CONTENTS_WIDTH,
			height: '100%'
		};
		var innerDivStyle = {
			backgroundColor: color.transparentWhite,
			width: '100%',
			height: '100%',
			overflow: 'auto',
			padding: '15px'
		};

		return (
			<div style={outerDivStyle}>
				<div style={innerDivStyle}>
					{this.props.children}
				</div>
			</div>
		);
	}
});
exports.Container = Container;