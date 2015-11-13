var React = require('react');

var PolymerIcon = React.createClass({
	//http://dmfrancisco.github.io/react-icons/
	propTypes: {
		icon: React.PropTypes.string.isRequired,
		size: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		style: React.PropTypes.object
	},
	getDefaultProps() {
		return { size: 24 };
	},
	_mergeStyle(...args) {
		return Object.assign({}, ...args);
	},
	renderGraphic() {
		switch(this.props.icon) {
		case 'my-icon':
			return (
				<g><path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" /></g>
			);
		case 'another-icon':
			return (
				<g><path d="M7.41 15.41l4.59-4.58 4.59 4.58 1.41-1.41-6-6-6 6z" /></g>
			);
		}
	},
	render() {
		var styles = {
			fill: 'currentcolor',
			verticalAlign: 'middle',
			width: this.props.size,
			height: this.props.size
		};

		return (
			<svg 
				viewBox="0 0 24 24" 
				preserveAspectRatio="xMidYMid meet" 
				fit 
				style={this._mergeStyle(
					styles,
					this.props.style
				)}>
				{this.renderGraphic()}
			</svg>
		);
	}
});

module.exports = PolymerIcon;