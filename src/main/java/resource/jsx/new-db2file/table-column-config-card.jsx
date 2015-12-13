var React = require('react');
var jdbcTmpl = require('../utils/util.js').jdbcTmpl;
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var TextField = MaterialWrapper.TextField;
var SelectField = MaterialWrapper.SelectField;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var CircularProgress = MaterialWrapper.CircularProgress;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var ListDivider = MaterialWrapper.ListDivider;
var Dialog = MaterialWrapper.Dialog;
var Toggle = MaterialWrapper.Toggle;
var PolymerIcon = require('../comps/polymer-icon.jsx');

var TableColumnConfigCard = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired
	},

	handleFocus(name, evt) {
		evt.stopPropagation();

		if(this.refs.autoloadToggle.isToggled() === true) {
			if(name === 'table') {
				this.refs.tableConfigDialog.show();
			} else if(name === 'columns') {
				//TODO IMME
			}
		}
	},

	render() {
		var jdbc = {
			jdbcDriver: this.props.jdbcDriver,
			jdbcConnUrl: this.props.jdbcConnUrl,
			jdbcUsername: this.props.jdbcUsername,
			jdbcPassword: this.props.jdbcPassword
		};

		return (
			<Card style={{ marginBottom: '10px' }}>
				<CardHeader
					title="table/column 설정"
					subtitle="source database의 table/column 정보를 설정합니다."
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					<Toggle
						name="autoload"
						value="autoload"
						label="autoload"
						ref="autoloadToggle"
						style={{ width: '150px' }}
						defaultToggled={true} />
					<TextField
						value={this.props.table}
						onChange={this.handleChange.bind(this, 'table')}
						floatingLabelText="table"
						fullWidth={true}
						onFocus={this.handleFocus.bind(this, 'table')} />
					<TextField
						value={this.props.columns}
						onChange={this.handleChange.bind(this, 'columns')}
						floatingLabelText="columns"
						fullWidth={true}
						onFocus={this.handleFocus.bind(this, 'columns')} />
					<TableConfigDialog
						ref="tableConfigDialog"
						handleStateChange={this.props.handleStateChange}
						table={this.props.table}
						{...jdbc} />
					<ColumnConfigDialog
						ref="columnConfigDialog"
						table={this.props.table}
						columns={this.props.columns} 
						{...jdbc} />
				</CardText>
			</Card>
		);
	}
});
module.exports = TableColumnConfigCard;