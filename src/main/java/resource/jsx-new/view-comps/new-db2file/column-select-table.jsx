var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color;

Array.prototype.remove = require('array-remove-by-value');

var ColumnSelectTable = React.createClass({
	getDefaultProps() {
		return {
			rows: [],
			selectedColumns: [],
			onSelectedColumnChange: null
		};
	},

	getInitialState() {
		return {
			hoveredColumn: ''
		};
	},

	onHoveredColumnChange(column) {
		this.setState({ hoveredColumn: column });
	},

	render() {
		var props = {
			rows: this.props.rows,
			selectedColumns: this.props.selectedColumns,
			onSelectedColumnChange: this.props.onSelectedColumnChange,
			hoveredColumn: this.state.hoveredColumn,
			onHoveredColumnChange: this.onHoveredColumnChange
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
			onSelectedColumnChange: null,
			hoveredColumn: '',
			onHoveredColumnChange: null
		};
	},

	render() {
		if(this.props.rows == null || this.props.rows.length === 0) return null;

		var tr = [];
		this.props.row[0].sortedForEach(function(key, value) {
			tr.push(
				<Th value={key}
					selectedColumns={this.props.selectedColumns}
					onSelectedColumnChange={this.props.onSelectedColumnChange}
					hoveredColumn={this.props.hoveredColumn}
					onHoveredColumnChange={this.props.onHoveredColumnChange} />
			);
		});

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
			onSelectedColumnChange: null,
			hoveredColumn: '',
			onHoveredColumnChange: null
		};
	},

	styles() { 
		return this.css({
			hovered: this.props.hoveredColumn === this.props.value,
			selected: this.props.hoveredColumn !== this.props.value && 
						this.props.selectedColumns.indexOf(this.props.value) !== -1,
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
		this.props.onHoveredColumnChange(this.props.value);
	},

	onMouseOut() {
		if(this.hoveredColumn === this.props.value)
			this.props.onHoveredColumnChange('');
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
			onSelectedColumnChange: null,
			hoveredColumn: '',
			onHoveredColumnChange: null
		};
	},

	render() {
		if(this.props.rows == null || this.props.rows.length === 0) return null;

		var tbody = [];
		this.props.rows.forEach(function(row) {
			var tr = [];
			row.sortedForEach(function(key, value) {
				tr.push(
					<Td value={value}
						column={key}
						selectedColumns={this.props.selectedColumns}
						onSelectedColumnChange={this.props.onSelectedColumnChange}
						hoveredColumn={this.props.hoveredColumn}
						onHoveredColumnChange={this.props.onHoveredColumnChange} />
				);
			});
			tbody.push(<tr>{tr}</tr>);
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
			onSelectedColumnChange: null,
			hoveredColumn: '',
			onHoveredColumnChange: null
		};
	},

	styles() { 
		return this.css({
			hovered: this.props.hoveredColumn === this.props.column,
			selected: this.props.hoveredColumn !== this.props.column && 
						this.props.selectedColumns.indexOf(this.props.column) !== -1,
		});
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
		this.props.onHoveredColumnChange(this.props.column);
	},

	onMouseOut() {
		if(this.hoveredColumn === this.props.column)
			this.props.onHoveredColumnChange('');
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