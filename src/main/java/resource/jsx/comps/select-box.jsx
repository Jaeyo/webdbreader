var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	color = require('../utils/util.js').color;

var SelectBox = React.createClass({
	mixins: [ ReactCSS.mixin ],

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

	classes() {
		return {
			'default': {
				select: _.extend({
					backgroundColor: color.transparentLightGray,
					border: 'none',
					padding: '6px',
					outline: 'none',
					WebkitAppearance: 'none',
					msAppearance: 'none'
				}, this.props.style)
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var body = this.props.values.map(function(value) {
			return <option key={value} value={value}>{value}</option>;
		});

		return (
			<select 
				is="select"
				value={this.state.value}
				onChange={this.onChange}>
				{body}
			</select>
		);
	}
});
exports.SelectBox = SelectBox;

var DashedSelectBox = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			value: null,
			values: [],
			onChange: null,
			style: {}
		};
	},

	classes() {
		return {
			'default': {
				SelectBox: _.extend({
					padding: '3px 5px',
					borderRadius: '6px',
					WebKitBorderRadius: '6px',
					msBorderRadius: '6px',
					border: '1px dashed ' + color.gray,
					outline: 'none',
					WebkitAppearance: 'none',
					msAppearance: 'none'
				}, this.props.style)
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<SelectBox
				is="SelectBox"
				value={this.props.value}
				values={this.props.values}
				onChange={this.props.onChange} />
		);
	}
});
exports.DashedSelectBox = DashedSelectBox;