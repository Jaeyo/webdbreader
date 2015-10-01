var React = require('react'),
	util = require('util');

var Menu = React.createClass({
	getInitialState() {
		return {
			scripts: [],
			isScriptLoaded: false
		};
	}, //getDefaultProps
	componentWillMount() {
		$.getJSON('/REST/Script/Info/', {})
		.done(function(resp) {
			if(resp.success !== 1) {
				bootbox.alert(JSON.stringify(resp));
				this.setState({ isScriptLoaded: true });
				return;
			} //if
			this.setState({
				scripts: resp.scriptInfos,
				isScriptLoaded: true
			});
		}.bind(this)).fail(function(err) {
			if(typeof err == 'object') err = JSON.stringify(err);
			bootbox.alert(err);
			this.setState({ isScriptLoaded: true });
		}.bind(this));
	}, //componentWillMount
	render() {
		var scriptDOM = null;
		if(this.state.isScriptLoaded === false) {
			scriptDOM = (<div className="well">loading...</div>);
		} else {
			if(this.state.scripts.length === 0) {
				scriptDOM = (<div className="well">no script</div>)
			} else {
				scriptDOM = [];
				this.state.scripts.forEach(function(scriptItem) {
					scriptDOM.push(
						<Menu.Item 
							glyphiName="console" 
							name={scriptItem.SCRIPT_NAME} 
							link={'/Script/View/' + scriptItem.SCRIPT_NAME} />
					);
				});
			} ///if
		} //if

		return (
			<ul className="nav nav-pills nav-stacked">
				<Menu.Item glyphiName="cloud" name="overview" link="/" />
				<li><hr /></li>
				<li><h5>Scripts</h5</li>
				{scriptDOM}
				<li><hr /></li>
				<Menu.Item glyphiName="cog" name="configuration" link="/Config/" />
			</ul>
		);
	} //render
}); //Menu

Menu.Item = React.createClass({
	getDefaultProps() {
		return {
			glyphiName: '',
			name: '',
			link: ''
		};
	}, //getDefaultProps
	render() {
		return (
			<li>
				<a href={this.props.link}>
					<span className={util.format('glyphicon glyphicon-%s pull-left', this.props.glyphiName)}></span>
					<span className="pull-right">{this.props.name}</span>
					<div class="clearfix" />
				</a>
			</li>
		);
	} //render
}); //Menu.Item