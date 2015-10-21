var React = require('react'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var SelectBox = React.createClass({
	getDefaultProps() {
		return {
			values: [],
			value: null,
			onChange: null,
			style: {}
		};	
	},
	
	getInitialState() {
		return {
			value: this.props.value
		};
	},
	
	onChange(evt) {
		this.setState({ value: evt.target.value });
		if(this.props.onChange) 
			this.props.onChange(evt);
	},
	
	render() {
		var body = this.props.values.map(function(value) {
			return <option key={value} value={value}>{value}</option>;
		});

		return (
			<select 
				style={this.props.style}
				value={this.state.value}
				onChange={this.onChange}>
				{body}
			</select>
		);
	}
});
exports.SelectBox = SelectBox;

var DashedSelectBox = React.createClass({
	getDefaultProps() {
		return {
			value: null,
			values: [],
			onChange: null,
			style: {}
		};
	},

	render() {
		var style = _.extend({
			padding: '3px 5px',
			borderRadius: '6px',
			WebKitBorderRadius: '6px',
			msBorderRadius: '6px',
			border: '1px dashed ' + color.gray,
			outline: 'none',
			WebkitAppearance: 'none',
			msAppearance: 'none'
		}, this.props.style);

		return (
			<SelectBox
				style={style}
				value={this.props.value}
				values={this.props.values}
				onChange={this.props.onChange} />
		);
	}
});
exports.DashedSelectBox = DashedSelectBox;