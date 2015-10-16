var React = require('react'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var BtnMixin = {
	getDefaultProps() {
		return {
			backgroundColor: 'white',
			backgroundColorHover: color.lightGray,
			backgroundColorMouseDown: color.gray,
			borderColor: '#ccc',
			borderColorHover: color.lightGray,
			borderColorMouseDown: color.gray,
			padding: '5px 10px',
			color: '#333',
			fontSize: '14px'
		};
	},
	
	getInitialState() {
		return {
			backgroundColor: this.props.backgroundColor,
			borderColor: this.props.borderColor
		};
	},

	getStyle() {
		return {
			display: 'inline-block'	,
			textAlign: 'center', 
			whiteSpace: 'nowrap',
			verticalAlign: 'middle',
			backgroundImage: 'none',
			backgroundColor: this.state.backgroundColor,
			border: '1px solid transparent',
			borderRadius: '4px',
			borderColor: this.state.borderColor,
			padding: this.props.padding,
			color: this.props.color,
			fontSize: this.props.fontSize
		};
	},
	
	onMouseOver(evt) {
		this.setState({ 
			backgroundColor: this.props.backgroundColorHover,
			borderColor: this.props.borderColorHover
		});
	},
	
	onMouseOut(evt) {
		this.setState({ 
			backgroundColor: this.props.backgroundColor,
			borderColor: this.props.borderColor
		});
	},

	onMouseDown(evt) {
		this.setState({
			backgroundColor: this.props.backgroundColorMouseDown,
			borderColor: this.props.borderColorMouseDown
		});
	},

	onMouseUp(evt) {
		this.onMouseOver(evt);
	},
};

var Btn = React.createClass({
	mixins: [BtnMixin],

	getDefaultProps() {
		return {
			onClick: null
		}
	},
	
	render() {
		return (
			<button 
				type="button"
				style={this.getStyle()}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onClick={this.props.onClick}>
				{this.props.children}
			</button>
		);
	}
});
exports.Btn = Btn;


var ToggleBtn = React.createClass({
	mixins: [BtnMixin],

	getDefaultProps() {
		return {
			onToggle: null
		};
	},

	getInitialState() {
		return {
			isClicked: false
		};
	},

	onClick(evt) {
		var isClicked = !this.state.isClicked;
		if(this.props.onToggle)
			this.props.onToggle(isClicked);
		this.setState({ isClicked: isClicked });
	},

	setClicked(isClicked) {
		this.setState({ isClicked: isClicked });
	},

	render() {
		return (
			<button 
				type="button"
				style={this.getStyle()}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onClick={this.onClick}>
				<span 
					className="glyphicon glyphicon-ok"
					style={{ marginRight: '10px', opacity: this.state.isClicked === true ? 1 : 0 }} />
				{this.props.children}
			</button>
		);
	}
});
exports.ToggleBtn = ToggleBtn;


var DarkBlueBtn = React.createClass({
	render() {
		return (
			<Btn
				backgroundColor={color.darkBlue}
				backgroundColorHover={color.lightBlue}
				backgroundColorMouseDown={color.darkBlue2}
				borderColor={color.darkBlue}
				borderColorHover={color.lightBlue}
				borderColorMouseDown={color.darkBlue2}
				color='white'>
				{this.props.children}
			</Btn>
		);
	}
});
exports.DarkBlueBtn = DarkBlueBtn;


var DarkBlueToggleBtn = React.createClass({
	getDefaultProps() {
		return { onToggle: null }
	},

	setClicked(isClicked) {
		this.refs.btn.setClicked(isClicked);
	},

	render() {
		return (
			<ToggleBtn
				ref="btn"
				backgroundColor={color.darkBlue}
				backgroundColorHover={color.lightBlue}
				backgroundColorMouseDown={color.darkBlue2}
				borderColor={color.darkBlue}
				borderColorHover={color.lightBlue}
				borderColorMouseDown={color.darkBlue2}
				color='white'
				onToggle={this.props.onToggle}>
				{this.props.children}
			</ToggleBtn>
		);
	}
});
exports.DarkBlueToggleBtn = DarkBlueToggleBtn;


var DarkBlueSmallToggleBtn = React.createClass({
	getDefaultProps() {
		return { onToggle: null };
	},

	setClicked(isClicked) {
		this.refs.btn.setClicked(isClicked);
	},

	render() {
		return (
			<ToggleBtn
				ref="btn"
				backgroundColor={color.darkBlue}
				backgroundColorHover={color.lightBlue}
				backgroundColorMouseDown={color.darkBlue2}
				borderColor={color.darkBlue}
				borderColorHover={color.lightBlue}
				borderColorMouseDown={color.darkBlue2}
				color='white'
				padding='3px 6px'
				fontSize='12px'
				onToggle={this.props.onToggle}>
				{this.props.children}
			</ToggleBtn>
		);
	}
});
exports.DarkBlueSmallToggleBtn = DarkBlueSmallToggleBtn;