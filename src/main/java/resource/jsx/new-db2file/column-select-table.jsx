var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	jsUtil = require('../utils/util.js'),
	color = jsUtil.color

var ColumnSelectTable = React.createClass({
	getDefaultProps() {
		return {
			rows: [],
			selectedColumns: [],
			onSelectedColumnChange: null
		};
	},

	getInitialState() {
		return { hoveredColumn: '' };
	},

	onHoveredColumnChange(column) {
		this.setState({ hoveredColumn: column });
	},

	render() {
		var props = {
			rows: this.props.rows,
			selectedColumns: this.props.selectedColumns,
			onSelectedColumnChange: this.props.onSelectedColumnChange
		};

		return (
			<table>
				<Thead {...props} />
				<Tbody {...props} />
			</table>
		);
	}
});
exports.ColumnSelectTable = ColumnSelectTable;

var Thead = React.createClass({
	getDefaultProps() {
		return {
			rows: [],
			selectedColumns: [],
			onSelectedColumnChange: null
		};
	},

	render() {
		if(this.props.rows == null || this.props.rows.length === 0) return null;

		var tr = [];
		Object.sortedForEach(this.props.rows[0], function(key, value) {
			tr.push(
				<Th key={key}
					value={key}
					selectedColumns={this.props.selectedColumns}
					onSelectedColumnChange={this.props.onSelectedColumnChange} />
			);
		}.bind(this));

		return (
			<thead>
				<tr>{tr}</tr>
			</thead>
		);
	}
});


var Th = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			value: '',
			selectedColumns: [],
			onSelectedColumnChange: null
		};
	},

	getInitialState() {
		return { isHovered: false };
	},

	styles() { 
		return this.css({
			hovered: this.state.isHovered,
			selected: this.state.isHovered === false && 
						Array.containsIgnoreCase(this.props.selectedColumns, this.props.value)
		});
	},

	classes() {
		return {
			'default': {
				item: { 
					backgroundColor: color.darkGray2,
					padding: '5px',
					color: 'white',
					fontSize: '80%'
				}
			},
			hovered: {
				item: { backgroundColor: color.darkGray }
			},
			selected: {
				item: { backgroundColor: color.darkGray3 }
			}
		};
	},

	onClick() {
		this.props.onSelectedColumnChange(this.props.value);
	},

	onMouseOver() {
		this.setState({ isHovered: true });
	},

	onMouseOut() {
		this.setState({ isHovered: false });
	},

	render() {
		return (
			<th is="item"
				onClick={this.onClick}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}>
				{this.props.value}
			</th>
		);
	}
});


var Tbody = React.createClass({
	getDefaultProps() {
		return {
			rows: [],
			selectedColumns: [],
			onSelectedColumnChange: null
		};
	},

	render() {
		if(this.props.rows == null || this.props.rows.length === 0) return null;

		var tbody = [];
		var rowCounter = 0;
		this.props.rows.forEach(function(row) {
			var tr = [];
			Object.sortedForEach(row, function(key, value) {
				tr.push(
					<Td key={key + value}
						value={value}
						column={key}
						selectedColumns={this.props.selectedColumns}
						onSelectedColumnChange={this.props.onSelectedColumnChange} />
				);
			}.bind(this));
			tbody.push(<tr key={rowCounter}>{tr}</tr>);
			rowCounter++;
		}.bind(this));

		return (<tbody>{tbody}</tbody>);
	}
});


var Td = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			value: '',
			column: '',
			selectedColumns: [],
			onSelectedColumnChange: null
		};
	},

	getInitialState() {
		return { isHovered: false };
	},

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.selectedColumns !== nextProps.selectedColumns)
			if(Array.containsIgnoreCase(nextProps.selectedColumns, this.props.column)) 
				return true; 

		if(this.state.isHovered !== nextState.isHovered)
			return true;

		return false;
	},

	styles() { 
		return this.css({
			hovered: this.state.isHovered,
			selected: this.state.isHovered === false &&
						Array.containsIgnoreCase(this.props.selectedColumns, this.props.column)
		})
	},

	classes() {
		return {
			'default': {
				item: {
					backgroundColor: 'inherit',
					padding: '5px',
					fontSize: '80%'
				}
			},
			hovered: {
				item: { backgroundColor: color.darkGray }
			},
			selected: {
				item: { backgroundColor: color.darkGray3 }
			}
		};
	},

	onClick() {
		this.props.onSelectedColumnChange(this.props.column);
	},

	onMouseOver() {
		this.setState({ isHovered: true });
	},

	onMouseOut() {
		this.setState({ isHovered: false });
	},

	render() {
		return (
			<td is="item"
				onClick={this.onClick}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}>
				{this.props.value}
			</td>
		);
	}
});