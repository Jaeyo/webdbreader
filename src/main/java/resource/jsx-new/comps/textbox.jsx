var React = require('react'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var TextBox = React.createClass({
	getDefaultProps() {
		return {
			type: 'text',
			placeholder: '',
			value: '',
			style: {},
			onChange: null,
			onClick: null
		};
	},
	
	getInitialState() {
		return { value: this.props.value };
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.value)
			this.setState({ value: nextProps.value });
	},
	
	onChange(evt) {
		this.setState({ value: evt.target.value });
		this.props.onChange(evt);
	},
	
	render() {
		var style = _.extend({
			backgroundColor: color.transparentLightGray,
			border: 'none',
			padding: '6px',
			outline: 'none'
		}, this.props.style);

		return (
			<input 
				type={this.props.type}
				style={style}
				placeholder={this.props.placeholder}
				value={this.state.value}
				onChange={this.onChange}
				onClick={this.props.onClick} />
		);
	}
});
exports.TextBox = TextBox;

var DashedTextBox = React.createClass({
	getDefaultProps() {
		return {
			type: 'text',
			placeholder: '',
			value: '',
			style: {},
			onChange: null
		};
	},

	render() {
		var style = _.extend({
			padding: '5px',
			border: '1px dashed ' + color.gray,
			outline: 'none',
			borderRadius: '5px'
		}, this.props.style);

		return (
			<TextBox 
				type={this.props.type}
				placeholder={this.props.placeholder}
				value={this.props.value}
				style={style}
				onChange={this.props.onChange} />
		);
	}
});
exports.DashedTextBox = DashedTextBox;