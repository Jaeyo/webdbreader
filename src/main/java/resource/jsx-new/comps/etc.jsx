var React = require('react'),
	_ = require('underscore');

exports.getKeyValueLine = function(width) {
	return React.createClass({
		getDefaultProps() {
			return { label: '', style: {} };
		},

		render() {
			var leftStyle = {
				float: 'left',
				width: width,
				textAlign: 'right'
			};
			var rightStyle = _.extend({
				float: 'left'
			}, this.props.style);

			return (
				<div>
					<div style={leftStyle}>{this.props.label}</div>
					<div style={rightStyle}>{this.props.children}</div>
					<Clearfix />
				</div>
			);
		}
	});
};


exports.ListItem = React.createClass({
	getDefaultProps() {
		return { 
			name: '',
			onClick: null
		};
	},

	getInitialState() {
		return { isMouseOver: false };
	},

	onMouseOver(evt) {
		this.setState({ isMouseOver: true });
	},

	onMouseOut(evt) {
		this.setState({ isMouseOver: false });
	},

	render() {
		var outer = {
			borderBottom: '1px solid ' + color.lightGray,
			padding: '3px 6px',
			cursor: 'pointer',
			backgroundColor: this.state.isMouseOver === true ? color.lightGray : 'inherit'
		};

		return (
			<div 
				style={outer} 
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}>
				onClick={this.props.onClick}
				{this.props.name}
			</div>
		);
	}
});