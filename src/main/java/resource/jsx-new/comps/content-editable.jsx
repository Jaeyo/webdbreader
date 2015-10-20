var React = require('react');

var ContentEditable = React.createClass({
	getDefaultProps() {
		return {
			html: '',
			style: {},
			onChange: null
		};
	},
	emitChange(evt) {
		var html = this.getDOMNode().innerHTML;
		if(this.props.onChange)
			this.props.onChange(html);
	},
	render() {
		return (
			<div 
				onInput={this.emitChange}
				onBlur={this.emitChange}
				contentEditable
				style={this.props.style}
				dangerouslySetInnerHTML={{__html: this.props.html}}></div>
		);
	}
});
exports.ContentEditable = ContentEditable;