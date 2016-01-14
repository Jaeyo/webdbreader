var React = require('react');
var server = require('../../utils/server.js');
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
var Toggle = MaterialWrapper.Toggle;
var PolymerIcon = require('../../comps/polymer-icon.jsx');
var AlertDialog = require('../../comps/dialog/alert-dialog.jsx');


var ColumnConfigDialog = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			visible: false,
			isColumnsLoaded: false,
			loadedColumns: null
		}
	},

	show() {
		this.setState({ visible: true }, function() {
			this.loadColumns();
		}.bind(this));
	},

	hide() {
		this.setState({ visible: false });
	},

	handleChange(name, evt) {
		evt.stopPropagation();

		switch(name) {
		case 'column': 
			this.props.handleStateChange({ columns: evt.target.value });
			break;
		}
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
		}).then(function(columns) {
			this.setState({
				isColumnsLoaded: true,
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			this.setState({ isColumnsLoaded: false });
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	renderColumnList() {
		if(this.state.isColumnsLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		var selectedColumnsArr = 
			this.props.columns.split(',')
				.map(function(s) { return s.trim(); })
				.filter(function(s){ if(s === '') return false; return true; });

		return (
			<List>
			{
				this.state.loadedColumns.map(function(column) {
					var columnName = column.columnName.toLowerCase();
					var columnType = column.columnType;

					var onClick = function(evt) {
						evt.stopPropagation();
						if(Array.contains(selectedColumnsArr, columnName)) {
							selectedColumnsArr.remove(columnName);
						} else {
							selectedColumnsArr.push(columnName);
						}
						this.props.handleStateChange({ columns: selectedColumnsArr.join(',') })
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

	onClose(evt) {
		evt.stopPropagation();
		this.hide();
	},

	render() {
		try {
			return (
				<Dialog
					actions={[
						{ text: 'close', onClick: this.onClose }
					]}
					actionFocus="close"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<Card>
						<CardHeader
							title="column 설정"
							subtitle="사용할 column 정보를 설정합니다."
							avatar={ <PolymerIcon icon="config" /> } />
						<CardText>
							<TextField
								floatingLabelText="columns"
								value={this.props.columns} 
								onChange={this.handleChange.bind(this, 'columns')}
								fullWidth={true} />
							<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
								{ this.renderColumnList() }
							</div>
						</CardText>
					</Card>
					<AlertDialog ref="alertDialog" />
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ColumnConfigDialog;