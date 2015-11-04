var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var TextBox = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			type: 'text',
			placeholder: '',
			value: '',
			style: {},
			onChange: null,
			onClick: null,
			onFocus: null,
			onKeyUp: null
		};
	},
	
	getInitialState() {
		return { value: this.props.value };
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.value != null)
			this.setState({ value: nextProps.value });
	},
	
	onChange(evt) {
		this.setState({ value: evt.target.value });
		if(this.props.onChange != null)
			this.props.onChange(evt);
	},
	
	classes() {
		return {
			'default': {
				input: _.extend({
					backgroundColor: color.transparentLightGray,
					border: 'none',
					padding: '6px',
					outline: 'none'
				}, this.props.style)
			}
		};
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<input 
				is="input"
				type={this.props.type}
				placeholder={this.props.placeholder}
				value={this.state.value}
				onChange={this.onChange}
				onClick={this.props.onClick}
				onFocus={this.props.onFocus}
				onKeyUp={this.props.onKeyUp} />
		);
	}
});
exports.TextBox = TextBox;

var DashedTextBox = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			type: 'text',
			placeholder: '',
			value: '',
			style: {},
			onChange: null,
			onFocus: null
		};
	},

	classes() {
		return {
			'default': {
				textbox: _.extend({
					padding: '5px',
					border: '1px dashed ' + color.gray,
					outline: 'none',
					borderRadius: '5px'
				}, this.props.style)
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<TextBox 
				type={this.props.type}
				placeholder={this.props.placeholder}
				value={this.props.value}
				is="textbox"
				onChange={this.props.onChange}
				onFocus={this.props.onFocus} />
		);
	}
});
exports.DashedTextBox = DashedTextBox;