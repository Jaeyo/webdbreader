var React = require('react'),
	util = require('util');

var LeftNavMenu = React.createClass({
	getInitialState() {
		return {
			scriptNames: []
		};
	},

	componentDidMount() {
		$.getJSON('/REST/Script/Info/', {})
		.done(function(resp) {
			if(resp.success !== 1) {
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			var scriptNames = [];
			resp.scriptInfos.forEach(function(scriptInfo) {
				scriptNames.push(scriptInfo.SCRIPT_NAME);
			});

			this.setState({ scriptNames: scriptNames });
		}.bind(this)).fail(function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			bootbox.alert(err);
		});
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
				<LeftNavMenu.Btn link="/" name="overview" glyphiName="cloud" />
				<li><hr /></li>
				<li><h5>Scripts</h5></li>
				{scriptBtns}
				<li><hr /></li>
				<LeftNavMenu.Btn link="/Config/" name="configuration" glyphiName="cog" />
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