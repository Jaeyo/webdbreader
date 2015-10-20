var React = require('react'),
	Loading = require('react-loading'),
	DarkBlueBtn = require('./btn.jsx').DarkBlueBtn;

var CurtainLoadingView = React.createClass({
	render() {
		var outerDivStyle = {
			position: 'relative',
			zIndex: 999,
			width: '100%',
			height: '100%',
			backgroundColor: 'gray',
			opacity: '0.6'
		};

		var innerSpanStyle = {
			position: 'absolute',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)'
		};

		return (
			<div style={outerDivStyle}>
				<span style={innerSpanStyle}>
					<Loading type="bubbles" color="#e4e4e4" />
				</span>
			</div>
		);
	}
});
exports.CurtainLoadingView = CurtainLoadingView;

var CurtainMsgModalLodingBox = React.createClass({
	getDefaultProps() {
		return { onClick: null };
	},

	render() {
		var outerDivStyle = {
			position: 'relative',
			zIndex: 999,
			width: '100%',
			height: '100%',
			backgroundColor: 'gray',
			opacity: '0.6'
		};

		return (
			<div style={outerDivStyle}>
				<div>
					<div>
						<label>{this.props.children}</label>
					</div>
					<div style={{ textAlign: 'center' }}>
						<DarkBlueBtn style={{ width: '100px' }} onClick={this.props.onClick}>ok</DarkBlueBtn>
					</div>
				</div>
			</div>
		);
	}
});
exports.CurtainMsgModalLodingBox = CurtainMsgModalLodingBox;