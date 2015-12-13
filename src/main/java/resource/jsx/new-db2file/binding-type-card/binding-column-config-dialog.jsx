var React = require('react');
var server = require('../../utils/server.js');
var PolymerIcon = require('../../comps/polymer-icon.jsx');
var AlertDialog = require('../../comps/dialog/alert-dialog.jsx');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
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
var RadioButton = MaterialWrapper.RadioButton;
var RadioButtonGroup = MaterialWrapper.RadioButtonGroup;
var Toggle = MaterialWrapper.Toggle;

var BindingColumnConfigDialog = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			visible: false,
			isColumnsLoaded: false,
			loadedColumns: null
		};
	},

	show() {
		this.setState({ visible: true }, function() {
			this.loadColumns();
		}.bind(this));
	},

	hide() {
		this.setState({ visible: false });
	},

	loadColumns() {
		server.loadColumns({
			jdbc: {
				driver: this.props.jdbcDriver,
				connUrl: this.props.jdbcConnUrl,
				username: this.props.jdbcUsername,
				password: this.props.jdbcPassword
			},
			table: this.props.table
		})
		.then(function(columns) {
			this.setState({
				isColumnsLoaded: true,
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			console.error(err.stack);
			this.setState({ isColumnsLoaded: false });
			if(typeof err !== 'string') err = JSON.stringify(err);
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		var state = {};
		state[name] = evt.target.value;
		this.props.handleStateChange(state);
	},

	renderColumnList() {
		if(this.state.isColumnsLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		return (
			<List>
			{
				this.state.loadedColumns.map(function(column) {
					var columnName = column.columnName.toLowerCase();
					var columnType = column.columnType;

					var onClick = function() {
						this.props.handleStateChange({ bindingColumn: columnName });
					}.bind(this);

					return (
						<ListItem
							key={columnName}
							primaryText={columnName}
							secondaryText={columnType}
							onClick={onClick} />
					);
				}.bind(this))
			}
			</List>
		);
	},

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'close', onClick: this.props.hide }
				]}
				actionFocus="close"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.props.visible}>
				<Card>
					<CardHeader
						title="binding column 설정"
						subtitle="binding column 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="columns"
							value={this.props.dataAdapter.data('bindingColumn')} 
							onChange={this.handleChange.bind(this, 'bindingColumn')}
							fullWidth={true} />
						<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
							{ this.renderColumnList() }
						</div>
					</CardText>
				</Card>
				<AlertDialog ref="alertDialog" />
			</Dialog>
		);
	}
});
module.exports = BindingColumnConfigDialog;