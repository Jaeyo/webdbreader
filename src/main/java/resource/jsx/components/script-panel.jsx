var React = require('react'),
	util = require('util');

var ScriptPanel = React.createClass({
	defaultProps() {
		return {
			isScriptRunning: false,
			scriptName: ''
		};
	},

	render() {
		return (
			<div className={'panel script-panel ' + (this.props.isScriptRunning === true ? 
				'panel-primary' : 'panel-red' )}>
				<div className="panel-heading align-right">
					<span className="pull-left glyphicon glyphicon-console" />
					<span className="pull-right script-name">{this.props.scriptName}</span>
					<div className="clearfix" />
				</div>
				<a href={util.format('/Script/View/%s/', this.props.scriptName)}>
					<div className="panel-footer">
						<span className="pull-left">view details</span>
						<span className="pull-right">
							<span className="glyphicon glyphicon-chevron-right" />
						</span>
						<div className="clearfix" />
					</div>
				</a>
			</div>
		);
	}
});

exports.ScriptPanel = ScriptPanel;