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
			return (<g><path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" /></g>);
		case 'another-icon':
			return (<g><path d="M7.41 15.41l4.59-4.58 4.59 4.58 1.41-1.41-6-6-6 6z" /></g>);
		case 'config':
			return (<g><path d="M18.622,8.371l-0.545-1.295c0,0,1.268-2.861,1.156-2.971l-1.679-1.639c-0.116-0.113-2.978,1.193-2.978,1.193l-1.32-0.533
		c0,0-1.166-2.9-1.326-2.9H9.561c-0.165,0-1.244,2.906-1.244,2.906L6.999,3.667c0,0-2.922-1.242-3.034-1.131L2.289,4.177
		C2.173,4.29,3.507,7.093,3.507,7.093L2.962,8.386c0,0-2.962,1.141-2.962,1.295v2.322c0,0.162,2.969,1.219,2.969,1.219l0.545,1.291
		c0,0-1.268,2.859-1.157,2.969l1.678,1.643c0.114,0.111,2.977-1.195,2.977-1.195l1.321,0.535c0,0,1.166,2.898,1.327,2.898h2.369
		c0.164,0,1.244-2.906,1.244-2.906l1.322-0.535c0,0,2.916,1.242,3.029,1.133l1.678-1.641c0.117-0.115-1.22-2.916-1.22-2.916
		l0.544-1.293c0,0,2.963-1.143,2.963-1.299v-2.32C21.59,9.425,18.622,8.371,18.622,8.371z M14.256,10.794
		c0,1.867-1.553,3.387-3.461,3.387c-1.906,0-3.461-1.52-3.461-3.387s1.555-3.385,3.461-3.385
		C12.704,7.41,14.256,8.927,14.256,10.794z"/></g>);
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