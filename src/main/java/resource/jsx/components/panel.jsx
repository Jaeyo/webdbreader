var React = require('react');

var Panel = React.createClass({
	getDefaultProps() {
		return {
			panelClassName: '',
			headerGlyphicon: 'cog',
			headerTitle: '',
			body: null
		};
	},

	render() {
		return (
			<div className={'panel panel-default ' + this.props.panelClassName}>
				<div className="panel-heading">
					<span className={'glyphicon glyphicon-' + this.props.headerGlyphicon} />
					<span>{this.props.headerTitle}</span>
				</div>
				<div className="panel-body">
					{this.props.body}
				</div>
			</div>	
		);
	}
});

exports.Panel = Panel;