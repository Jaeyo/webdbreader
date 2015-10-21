var React = require('react'),
	striptags = require('striptags'),
	_ = require('underscore'),
	color = require('../utils/util.js').color,
	DarkBlueSmallBtn = require('./btn.jsx').DarkBlueSmallBtn;

Array.prototype.remove = require('array-remove-by-value');

var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var DashedTagTextBox = React.createClass({
	getDefaultProps() {
		return {
			tags: [],
			addTagCallback: null,
			removeTagCallback: null,
			style: {},
		};
	},

	getInitialState() {
		return {
			text: ''
		};
	},

	componentDidMount() {
		this.refs.inputText.getDOMNode().focus();
	},

	onInput(evt) {
		var text = this.refs.inputText.getDOMNode().innerHTML;	
		if(endsWith(text, '&nbsp;') ||
			endsWith(text, ' ') ||
			endsWith(text, '<br>') ||
			endsWith(text, '<br />') ||
			endsWith(text, '\n')) {
			var newTag = text.replace(/&nbsp;/gi, '').replace(/ /gi, '').replace(/<br>/gi, '')
						.replace(/<br \/>/gi, '').replace(/\n/gi, '');
			this.setState({ text: '' });
			this.props.addTagCallback(newTag);
		} else {
			this.setState({ text: text });
		}
	},

	render() {
		var style = _.extend({
			display: 'inline-block',
			border: '1px dashed ' + color.lightGray
		}, this.props.style);

		var innerDivStyle = {
			display: 'inline-block',
			padding: '3px',
			minWidth: '20px',
			width: '100%'
		};

		var tags = this.props.tags.map(function(tag) {
			return (<TagBtn key={tag} text={tag} removeCallback={this.props.removeTagCallback} />);
		}.bind(this));

		return (
			<div style={style}>
				{tags}
				<div
					style={innerDivStyle}
					contentEditable={true}
					onInput={this.onInput}
					ref="inputText">
					{this.state.text}</div>
			</div>
		);
	}
});
exports.DashedTagTextBox = DashedTagTextBox;

var TagBtn = React.createClass({
	getDefaultProps() {
		return {
			text: '',
			removeCallback: null
		};
	},

	onClick(evt) {
		this.props.removeCallback(this.props.text);
	},

	render() {
		return (
			<DarkBlueSmallBtn
				style={{ margin: '4px' }}
				onClick={this.onClick}>
				{this.props.text}
				<span 
					style={{ marginLeft: '3px' }}
					className="glyphicon glyphicon-remove" />
			</DarkBlueSmallBtn>
		);
	}
});