var React = require('react'),
	ReactCSS = require('reactcss'),
	_ = require('underscore'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color;

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
		Object.sortedForEach(this.props.rows[0], function(key, value) {
			tr.push(
				<Th key={key}
					value={key}
					selectedColumns={this.props.selectedColumns}
					onSelectedColumnChange={this.props.onSelectedColumnChange}
					hoveredColumn={this.props.hoveredColumn}
					onHoveredColumnChange={this.props.onHoveredColumnChange} />
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
			onSelectedColumnChange: null,
			hoveredColumn: '',
			onHoveredColumnChange: null
		};
	},

	styles() { 
		return this.css({
			hovered: this.props.hoveredColumn === this.props.value,
			selected: this.props.hoveredColumn !== this.props.value && 
						String.containsIgnoreCase(this.props.selectedColumns, this.props.value)
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
		var rowCounter = 0;
		this.props.rows.forEach(function(row) {
			var tr = [];
			Object.sortedForEach(row, function(key, value) {
				tr.push(
					<Td key={key + value}
						value={value}
						column={key}
						selectedColumns={this.props.selectedColumns}
						onSelectedColumnChange={this.props.onSelectedColumnChange}
						hoveredColumn={this.props.hoveredColumn}
						onHoveredColumnChange={this.props.onHoveredColumnChange} />
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
			onSelectedColumnChange: null,
			hoveredColumn: '',
			onHoveredColumnChange: null
		};
	},

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.hoveredColumn !== nextProps.hoveredColumn) {
			if(this.props.hoveredColumn === this.props.column) return true;
			else 
				if(nextProps.hoveredColumn === this.props.column) return true;
		} else if(this.props.selectedColumns !== nextProps.selectedColumns) {
			if(String.containsIgnoreCase(nextProps.selectedColumns, this.props.column)) return true;
		}
		return false;
	},

	styles() { 
		return this.css({
			hovered: this.props.hoveredColumn === this.props.column,
			selected: this.props.hoveredColumn !== this.props.column && 
						String.containsIgnoreCase(this.props.selectedColumns, this.props.column)
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
		if(this.props.hoveredColumn === this.props.column) {
			this.props.onHoveredColumnChange('');
		}
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