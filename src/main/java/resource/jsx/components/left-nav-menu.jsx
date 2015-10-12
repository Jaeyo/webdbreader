var React = require('react'),
	util = require('util'),
	jsUtil = require('../util/util.js'),
	Noti = require('./noti.jsx').Noti,
	handleError = jsUtil.handleError,
	handleResp = jsUtil.handleResp;

var LeftNavMenu = React.createClass({
	getInitialState() {
		return {
			scriptNames: []
		};
	},

	componentDidMount() {
		$.getJSON('/REST/Script/Info/', {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			var scriptNames = [];
			resp.scriptInfos.forEach(function(scriptInfo) {
				scriptNames.push(scriptInfo.SCRIPT_NAME);
			});

			this.setState({ scriptNames: scriptNames });
		}.bind(this)));
	},

	render() {
		var scriptBtns = [];
		if(this.state.scriptNames.length === 0) {
			scriptBtns.push(<div className="well">no scripts</div>);
		} else {
			this.state.scriptNames.forEach(function(scriptName) {
				scriptBtns.push(
					<LeftNavMenu.Btn 
						link={'/Script/View/' + scriptName + '/' } 
						name={scriptName}
						glyphiName="console" />);
			});
		} //if

		return (
			<ul className="nav nav-pills nav-stacked">
				<Noti />
				<LeftNavMenu.Btn link="/" name="overview" glyphiName="cloud" />
				<li><hr /></li>
				<li><h5>Scripts</h5></li>
				{scriptBtns}
				<li><hr /></li>
				<LeftNavMenu.Btn link="/Config/" name="configuration" glyphiName="cog" />
				<li><hr /></li>
				<LeftNavMenu.Btn link="/ApiDoc/" name="api" glyphiName="modal-window" />
			</ul>
		);
	}
});

LeftNavMenu.Btn = React.createClass({
	getDefaultProps() {
		return {
			link: '',
			name: '',
			glyphiName: ''
		};
	},
	render() {
		return (
			<li>
				<a href={this.props.link}>
					<span className={ util.format('glyphicon glyphicon-%s pull-left', this.props.glyphiName) } />
					<span className="pull-right">{this.props.name}</span>
					<div className="clearfix" />
				</a>
			</li>
		);
	}
});

exports.LeftNavMenu = LeftNavMenu;