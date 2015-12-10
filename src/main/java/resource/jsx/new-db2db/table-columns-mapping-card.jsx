var React = require('react');
var _ = require('underscore');
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
var Col = require('react-bootstrap').Col;

var TableColumnsMappingCard = React.createClass({
	PropTypes: {
		dataAdapter: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			columnCount: 1,
			srcColumn0: '',
			destColumn0: ''
		};
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		switch(name) {
		case 'srcTable':
		case 'destTable':
			var state = {};
			state[name] = evt.target.value;
			this.props.dataAdapter.emit('stateChange', state);
			break;
		}
	},

	render() {
		return (
			<Card style={{ marginBottom: '10px' }}>
				<CardHeader
					title="mapping table/columns"
					subtitle="매핑시킬 테이블과 컬럼들을 설정합니다."
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					<Toggle
						name="autoload"
						value="autoload"
						label="autoload"
						ref="autoloadToggle"
						style={{ width: '150px' }}
						defaultToggled={true} />
					<Col xs={6}>
						<AddableColumnTextFields isSrc={true} dataAdapter={this.props.dataAdapter} />
					</Col>
					<Col xs={6}>
						<AddableColumnTextFields isDest={true} dataAdapter={this.props.dataAdapter} />
					</Col>
				</CardText>
			</Card>
		);
	}
});
module.exports = TableColumnsMappingCard;


var AddableColumnTextFields = React.createClass({
	PropTypes: {
		isSrc: React.PropTypes.bool,
		isDest: React.PropTypes.bool,
		dataAdapter: React.PropTypes.object.isRequired
	},

	handleChange(index, evt) {
		evt.stopPropagation();

		var columnKind = this.props.isSrc === true ? 'srcColumns' : 'destColumns';
		var columns = this.props.dataAdapter.data(columnKind);
		var splitedColumns = columns.split(',');
		splitedColumns[index] = evt.target.value;

		var state = {};
		state[columnKind] = splitedColumns.join(',');
		this.props.dataAdapter.emit(columnKind, state);
	},

	render() {
		var columnKind = this.props.isSrc === true ? 'srcColumns' : 'destColumns';
		var columns = this.props.dataAdapter.data(columnKind);

		return (
			<div>
				{
					columns.split(',').map(function(column, index) {
						return (
							<TextField
								floatingLabelText="column"
								value={column}
								fullWidth={true}
								onChange={this.handleChange.bind(this, index)} />
						);
					}.bind(this))
				}
			</div>
		);
	}
});