var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	Clearfix = require('./clearfix.jsx').Clearfix;

exports.getKeyValueLine = function(width) {
	return React.createClass({
		mixins: [ ReactCSS.mixin ],

		getDefaultProps() {
			return { label: '', style: {} };
		},

		classes() {
			return {
				'default': {
					left: {
						float: 'left',
						width: width,
						textAlign: 'right',
						marginRight: '15px'
					},
					right: _.extend({
						float: 'left'
					}, this.props.style)
				}
			}
		},

		styles() {
			return this.css();
		},

		render() {
			return (
				<div>
					<div is="left">{this.props.label}</div>
					<div is="right">{this.props.children}</div>
					<Clearfix />
				</div>
			);
		}
	});
};


exports.ListItem = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return { 
			name: '',
			onClick: null
		};
	},

	getInitialState() {
		return { isMouseOver: false };
	},

	onMouseOver(evt) {
		this.setState({ isMouseOver: true });
	},

	onMouseOut(evt) {
		this.setState({ isMouseOver: false });
	},

	classes() {
		return {
			'default': {
				outer: {
					borderBottom: '1px solid ' + color.lightGray,
					padding: '3px 6px',
					cursor: 'pointer',
					// backgroundColor: this.state.isMouseOver === true ? color.lightGray : 'inherit'
				}
			},
			'isMouseOver-true': {
				backgroundColor: color.lightGray
			}
		}
	},

	styles() {
		return this.css({
			'isMouseOver': this.state.isMouseOver
		});
	},

	render() {
		return (
			<div 
				is="outer"
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}>
				onClick={this.props.onClick}
				{this.props.name}
			</div>
		);
	}
});